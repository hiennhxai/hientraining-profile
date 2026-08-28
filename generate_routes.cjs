const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'src', 'app');

const createDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// 1. Static Pages
const pages = [
  { name: 'about', component: 'AboutSection', title: 'Câu Chuyện Của Xuân Hiến' },
  { name: 'courses', component: 'CoursesSection', title: 'Các Khóa Học Đào Tạo' },
  { name: 'resources', component: 'ResourceLibrarySection', title: 'Kho Tài Liệu & Biểu Mẫu Thực Chiến' },
  { name: 'services', component: 'ServicesSection', title: 'Dịch Vụ Studio & Truyền Thông' },
  { name: 'projects', component: 'ProductsSection', title: 'Dự Án & Showcase Thực Tế' },
  { name: 'blog', component: 'BlogSection', title: 'Góc Kiến Thức & Kinh Nghiệm' },
  { name: 'contact', component: 'ContactSection', title: 'Đăng Ký Tư Vấn' },
];

pages.forEach(p => {
  createDir(path.join(appDir, p.name));
  const content = `"use client";
import { useState, useEffect } from "react";
import { SubPageHeader } from "../../components/SubPageHeader";
import { ${p.component} } from "../../components/${p.component}";
import { SubPageBottomCta } from "../../components/SubPageBottomCta";
import { Language } from "../../types";
import { useRouter } from "next/navigation";

export default function ${p.name.charAt(0).toUpperCase() + p.name.slice(1)}Page() {
  const [lang] = useState<Language>("vi");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const router = useRouter();
  const isAdminMode = false;
  const isEditActive = false;

  useEffect(() => setIsDataLoaded(true), []);
  if (!isDataLoaded) return null;

  return (
    <>
      <SubPageHeader 
        title="${p.title}"
        lang={lang}
        onBackToHome={() => router.push("/")}
      />
      <${p.component} 
        lang={lang}
        isEditActive={isAdminMode && isEditActive}
        onEditField={() => {}}
        ${p.name === 'courses' ? 'onOpenCourse={(c) => router.push(`/course/${c.id}`)}' : ''}
        ${p.name === 'blog' ? 'onOpenArticle={(slug) => router.push(`/article/${slug}`)}' : ''}
        ${p.name === 'services' ? 'onOpenService={(s) => router.push(`/service/${s.id}`)}' : ''}
      />
      <SubPageBottomCta 
        lang={lang} 
        onNavigatePage={(page) => router.push(page === "home" ? "/" : \`/\${page}\`)} 
        isEditActive={isAdminMode && isEditActive}
        onEditField={() => {}}
      />
    </>
  );
}`;
  fs.writeFileSync(path.join(appDir, p.name, 'page.tsx'), content);
});

// 2. Dynamic Pages (SEO)
const dynamicPages = [
  { name: 'course', idParam: 'slug', component: 'CourseModal' },
  { name: 'article', idParam: 'slug', component: 'ArticleReaderModal' },
  { name: 'service', idParam: 'slug', component: 'ServiceGalleryModal' }
];

dynamicPages.forEach(p => {
  createDir(path.join(appDir, p.name, '[slug]'));
  let loadLogic = '';
  if (p.name === 'course') {
    loadLogic = `const found = adminData.courses?.find((c: any) => c.id === params.slug); setData(found);`;
  } else if (p.name === 'service') {
    loadLogic = `const found = adminData.services?.find((s: any) => s.id === params.slug); setData(found);`;
  } else {
    loadLogic = `setData(params.slug);`;
  }

  const content = `"use client";
import { useState, useEffect } from "react";
import { ${p.component} } from "../../../components/${p.component}";
import { getAdminData, loadAdminDataAsync } from "../../../data/adminStore";
import { useRouter } from "next/navigation";

export default function ${p.name.charAt(0).toUpperCase() + p.name.slice(1)}Page({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Client-side fetch logic for standalone pages
    const load = async () => {
      await loadAdminDataAsync();
      const adminData = getAdminData();
      ${loadLogic}
    };
    load();
  }, [params.slug]);

  if (!data) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <${p.component} 
        ${p.name === 'course' ? 'course={data}' : p.name === 'service' ? 'service={data}' : 'slug={data}'}
        lang="vi"
        onClose={() => router.push("/${p.name === 'course' ? 'courses' : p.name === 'service' ? 'services' : 'blog'}")}
      />
    </div>
  );
}`;
  fs.writeFileSync(path.join(appDir, p.name, '[slug]', 'page.tsx'), content);
});

// 3. Modal Parallel Routes
const modalDir = path.join(appDir, '@modal');
createDir(modalDir);
fs.writeFileSync(path.join(modalDir, 'default.tsx'), 'export default function Default() { return null; }');

dynamicPages.forEach(p => {
  const interceptDir = path.join(modalDir, `(.)${p.name}`, '[slug]');
  createDir(interceptDir);
  let loadLogic = '';
  if (p.name === 'course') {
    loadLogic = `const found = adminData.courses?.find((c: any) => c.id === params.slug); setData(found);`;
  } else if (p.name === 'service') {
    loadLogic = `const found = adminData.services?.find((s: any) => s.id === params.slug); setData(found);`;
  } else {
    loadLogic = `setData(params.slug);`;
  }

  const content = `"use client";
import { useState, useEffect } from "react";
import { ${p.component} } from "../../../../components/${p.component}";
import { getAdminData } from "../../../../data/adminStore";
import { useRouter } from "next/navigation";

export default function ${p.name.charAt(0).toUpperCase() + p.name.slice(1)}ModalIntercept({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const adminData = getAdminData();
    ${loadLogic}
  }, [params.slug]);

  if (!data) return null;

  return (
    <${p.component} 
      ${p.name === 'course' ? 'course={data}' : p.name === 'service' ? 'service={data}' : 'slug={data}'}
      lang="vi"
      onClose={() => router.back()}
    />
  );
}`;
  fs.writeFileSync(path.join(interceptDir, 'page.tsx'), content);
});

console.log("Next.js pages generated successfully!");
