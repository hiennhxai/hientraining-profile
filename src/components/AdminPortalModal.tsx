import React, { useState } from 'react';
import { Article, CourseItem, ServiceItem, PhotoAlbumItem, BrandLogoItem, ArticleCategory, ResourceItem, ResourceCategory, ResourceFileType } from '../types';
import { getAdminData, saveAdminData, resetAdminData, FullAdminData } from '../data/adminStore';
import { PhotoAlbumManager } from './PhotoAlbumManager';
import { RichArticleBlockEditor } from './RichArticleBlockEditor';
import { UniversalImagePickerModal } from './UniversalImagePickerModal';
import { ArticleReaderModal } from './ArticleReaderModal';
import { AVAILABLE_FONTS, applyTypography } from '../utils/typographyEngine';
import { 
  X, Save, RotateCcw, RotateCw, Download, Upload, Plus, Trash2, Check, Settings, 
  BookOpen, Layers, Video, FileText, User, Image as ImageIcon, Sparkles, 
  ShieldCheck, Headphones, Tv, Mic, Award, Monitor, ExternalLink, ChevronDown, ChevronUp, Share2, FolderGit2,
  Eye, EyeOff, Smartphone, FolderDown
} from 'lucide-react';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [data, setData] = useState<FullAdminData>(getAdminData());
  const [activeTab, setActiveTab] = useState<'general' | 'story' | 'courses' | 'resources' | 'services' | 'projects' | 'articles' | 'album' | 'brands'>('general');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Article Pop-up Preview State
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  // Article selection for Rich Editing
  const [editingArticleSlug, setEditingArticleSlug] = useState<string | null>(null);

  // Universal Image Picker State
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerCallback, setPickerCallback] = useState<((url: string) => void) | null>(null);
  const [pickerTitle, setPickerTitle] = useState('CHỌN HOẶC TẢI HÌNH ẢNH MỚI');
  const [pickerCurrentUrl, setPickerCurrentUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const openPicker = (callback: (url: string) => void, title: string, currentUrl: string = '') => {
    setPickerCallback(() => callback);
    setPickerTitle(title);
    setPickerCurrentUrl(currentUrl);
    setPickerOpen(true);
  };

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = async (shouldReload: boolean = false) => {
    setIsSaving(true);
    const success = await saveAdminData(data);
    setIsSaving(false);
    
    if (success) {
      showNotification(shouldReload ? "Đã lưu thành công! Đang tải lại trang chủ..." : "Đã lưu toàn bộ cấu hình Super Admin thành công!");
      if (onSaved) onSaved();
      if (shouldReload) {
        setTimeout(() => {
          window.location.reload();
        }, 400);
      }
    } else {
      showNotification("Lỗi khi lưu dữ liệu. Vui lòng kiểm tra quyền truy cập Supabase!");
    }
  };

  const handleReset = async () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục toàn bộ nội dung về mặc định ban đầu? Tất cả dữ liệu chỉnh sửa sẽ được đặt lại.")) {
      setIsSaving(true);
      const reset = await resetAdminData();
      setData(reset);
      setIsSaving(false);
      showNotification("Đã khôi phục cài đặt mặc định!");
      if (onSaved) onSaved();
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `xuanhien-superadmin-config-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.general) {
            setData(parsed);
            setIsSaving(true);
            await saveAdminData(parsed);
            setIsSaving(false);
            showNotification("Nhập file cấu hình JSON thành công!");
            if (onSaved) onSaved();
          } else {
            alert("File JSON không đúng cấu trúc quản trị!");
          }
        } catch {
          alert("Lỗi đọc file JSON!");
        }
      };
    }
  };

  // --- COURSE CRUD ---
  const handleAddCourse = () => {
    const newId = `course-${Date.now()}`;
    const newCourse: CourseItem = {
      id: newId,
      code: `KH-0${data.courses.length + 1}`,
      title: 'KHÓA HỌC MỚI 1-1 THỰC CHIẾN',
      subtitle: 'Mô tả ngắn gọn mục tiêu và đầu ra của khóa học...',
      formatOffline: 'Phòng Studio Q.3, TP.HCM',
      formatOnline: 'Online Live 1:1 qua Google Meet',
      feeNotice: 'Liên hệ tư vấn & báo phí qua SĐT: 0813.13.13.85',
      duration: '10 buổi',
      badge: 'Chuyên Sâu 1-1',
      lessons: [
        {
          lessonTitle: 'Bài 1: Định Hướng & Xây Dựng Bản Đồ Năng Lực',
          points: ['Xác định mục tiêu cá nhân', 'Đánh giá chỉ số hiện tại']
        }
      ]
    };
    setData({ ...data, courses: [...data.courses, newCourse] });
    showNotification("Đã thêm khóa học mới vào danh sách!");
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      setData({ ...data, courses: data.courses.filter(c => c.id !== id) });
      showNotification("Đã xóa khóa học!");
    }
  };

  // --- SERVICE CRUD ---
  const handleAddService = () => {
    const newService: ServiceItem = {
      id: `sv-${Date.now()}`,
      iconName: 'Sparkles',
      title: 'DỊCH VỤ & GIẢI PHÁP MỚI',
      description: 'Mô tả chi tiết giải pháp trọn gói tư vấn và vận hành cho khách hàng...',
      tags: 'Tư Vấn · Setup · Vận Hành · Broadcast'
    };
    setData({ ...data, services: [...data.services, newService] });
    showNotification("Đã thêm dịch vụ giải pháp mới!");
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      setData({ ...data, services: data.services.filter(s => s.id !== id) });
      showNotification("Đã xóa dịch vụ!");
    }
  };

  // --- BRAND LOGO CRUD ---
  const handleAddBrandLogo = () => {
    const newBrand: BrandLogoItem = {
      id: `brand-${Date.now()}`,
      name: 'Thương Hiệu Mới',
      category: 'Đối Tác Đồng Hành',
      color: 'from-orange-500 to-amber-600 text-white',
      icon: '✦'
    };
    setData({ ...data, brandLogos: [...(data.brandLogos || []), newBrand] });
    showNotification("Đã thêm logo thương hiệu đối tác mới!");
  };

  const handleDeleteBrandLogo = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa logo đối tác này khỏi danh sách chạy ngang?")) {
      setData({ ...data, brandLogos: (data.brandLogos || []).filter(b => b.id !== id) });
      showNotification("Đã xóa logo đối tác!");
    }
  };

  // --- RESOURCE / DOWNLOAD CRUD ---
  const handleAddResource = () => {
    const newRes: ResourceItem = {
      id: `res-${Date.now()}`,
      title: 'TÀI LIỆU / BIỂU MẪU MỚI TẢI VỀ',
      description: 'Mô tả chi tiết nội dung tài liệu, hướng dẫn sử dụng hoặc mật khẩu truy cập...',
      cat: 'script',
      fileType: 'PDF',
      fileUrl: 'https://drive.google.com',
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      fileSize: '2.5 MB',
      tags: ['#New', '#TaiLieu'],
      accessNote: 'Công khai hoặc dành riêng cho học viên 1-1'
    };
    setData({ ...data, resources: [...(data.resources || []), newRes] });
    showNotification("Đã thêm tài liệu mới vào Kho Tài Liệu!");
  };

  const handleDeleteResource = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài liệu này khỏi kho?")) {
      setData({ ...data, resources: (data.resources || []).filter(r => r.id !== id) });
      showNotification("Đã xóa tài liệu khỏi hệ thống!");
    }
  };

  // --- ARTICLE CRUD ---
  const handleAddArticle = () => {
    const slug = `bai-viet-moi-${Date.now()}`;
    const newArticle: Article = {
      slug: slug,
      cat: 'livestream',
      date: new Date().toISOString().slice(0, 10),
      author: 'Xuân Hiến',
      initials: 'XH',
      tags: ['Livestream', 'Setup', 'Chia Sẻ'],
      vi: {
        title: 'Tiêu Đề Bài Viết Mới Chia Sẻ Kinh Nghiệm',
        dek: 'Mô tả tóm tắt ngắn về bài viết chia sẻ thực chiến...',
        role: 'MC & Specialist Trainer',
        readTime: '5 phút đọc',
        body: [
          { t: 'p', c: 'Chào bạn, đây là nội dung khởi tạo cho bài viết mới.' },
          { t: 'h', sn: '01', c: 'Nội Dung Đầu Tiên' },
          { t: 'p', c: 'Thêm các đoạn văn và khối thông tin tùy chỉnh bằng trình soạn thảo.' }
        ]
      },
      en: {
        title: 'New Article Title',
        dek: 'Short description summary...',
        role: 'MC & Trainer',
        readTime: '5 mins read',
        body: [
          { t: 'p', c: 'Welcome to this article.' }
        ]
      }
    };

    setData({
      ...data,
      articles: {
        ...data.articles,
        [slug]: newArticle
      }
    });
    setEditingArticleSlug(slug);
    showNotification("Đã tạo bài viết mới! Bạn có thể chỉnh sửa ngay.");
  };

  const handleDeleteArticle = (slug: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này vĩnh viễn?")) {
      const newArticles = { ...data.articles };
      delete newArticles[slug];
      setData({ ...data, articles: newArticles });
      if (editingArticleSlug === slug) setEditingArticleSlug(null);
      showNotification("Đã xóa bài viết!");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/85 backdrop-blur-md p-2 sm:p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-7xl h-[94vh] flex flex-col overflow-hidden">
        
        {/* Super Admin Top Header Bar */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-mono font-bold shadow-lg shadow-orange-500/20">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">SUPER ADMIN PORTAL</h2>
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                  TOÀN QUYỀN QUẢN TRỊ A-Z
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Chỉnh sửa, thêm bớt khóa học, dịch vụ, dự án, bài viết & Album ảnh nén 4K</p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Tất Cả Thay Đổi</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Thoát Super Admin"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu — Organized into 2 Clean Rows */}
        <div className="bg-slate-100 p-2.5 border-b border-slate-200 space-y-2 shrink-0">
          {/* Row 1: General, Logos, Story, Courses, Resources */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              onClick={() => { setActiveTab('general'); setEditingArticleSlug(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'general' ? 'bg-white text-orange-600 shadow-sm border border-slate-200 ring-1 ring-orange-500/20' : 'bg-white/60 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <Settings className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">Chung & Branding</span>
            </button>

            <button
              onClick={() => { setActiveTab('brands'); setEditingArticleSlug(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'brands' ? 'bg-orange-600 text-white shadow-md' : 'bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="truncate">⚡ Logo ({(data.brandLogos || []).length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('story'); setEditingArticleSlug(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'story' ? 'bg-white text-orange-600 shadow-sm border border-slate-200 ring-1 ring-orange-500/20' : 'bg-white/60 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <User className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">Story</span>
            </button>

            <button
              onClick={() => { setActiveTab('courses'); setEditingArticleSlug(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'courses' ? 'bg-white text-orange-600 shadow-sm border border-slate-200 ring-1 ring-orange-500/20' : 'bg-white/60 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <BookOpen className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">Khóa Học ({data.courses.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('resources'); setEditingArticleSlug(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'resources' ? 'bg-orange-600 text-white shadow-md' : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <FolderDown className="w-4 h-4 shrink-0 text-amber-500" />
              <span className="truncate">📚 Kho Tài Liệu ({(data.resources || []).length})</span>
            </button>
          </div>

          {/* Row 2: Services, Projects & TikTok, Blog Articles, Photo Album */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => { setActiveTab('services'); setEditingArticleSlug(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'services' ? 'bg-white text-orange-600 shadow-sm border border-slate-200 ring-1 ring-orange-500/20' : 'bg-white/60 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <Layers className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">Dịch Vụ & Solutions ({data.services.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('projects'); setEditingArticleSlug(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'projects' ? 'bg-white text-orange-600 shadow-sm border border-slate-200 ring-1 ring-orange-500/20' : 'bg-white/60 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <Video className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">Dự Án & TikTok ({data.tiktokChannels.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'articles' ? 'bg-white text-orange-600 shadow-sm border border-slate-200 ring-1 ring-orange-500/20' : 'bg-white/60 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <FileText className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">Bài Viết Blog ({Object.keys(data.articles).length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('album'); setEditingArticleSlug(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'album' 
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md ring-2 ring-orange-500/30' 
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
              }`}
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span className="truncate">📸 KHO HÌNH ÁNH ({(data.photoAlbum || []).length})</span>
            </button>
          </div>
        </div>

        {/* Scrollable Main Workspace */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">

          {/* Toast Alert */}
          {toastMsg && (
            <div className="mb-4 p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* TAB 1: GENERAL CONFIG */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Brand, Logo & General Information */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-orange-600" />
                    <span>1. Cấu Hình Logo, Thương Hiệu & Thông Tin Liên Hệ</span>
                  </div>
                  <span className="text-[10px] font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-bold">
                    TOÀN QUYỀN THAY ĐỔI A-Z
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tên Thương Hiệu Chính (VD: XUÂN HIẾN)</label>
                    <input 
                      type="text" 
                      value={data.general.brandName || ''} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, brandName: e.target.value } })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Thương Hiệu Phụ / Định Dạng (VD: MEDIA & TRAINING)</label>
                    <input 
                      type="text" 
                      value={data.general.subBrandName || ''} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, subBrandName: e.target.value } })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">URL Logo Hình Ảnh Custom (Tùy chọn upload ảnh Logo riêng thay cho Vector mặc định)</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text" 
                        placeholder="Để trống nếu muốn dùng Logo Vector mặc định hoặc dán URL ảnh Logo vào đây"
                        value={data.general.logoImageUrl || ''} 
                        onChange={(e) => setData({ ...data, general: { ...data.general, logoImageUrl: e.target.value } })}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => openPicker(
                          (selectedUrl) => setData({ ...data, general: { ...data.general, logoImageUrl: selectedUrl } }),
                          'CHỌN / TẢI LOGO HÌNH ẢNH MỚI',
                          data.general.logoImageUrl || ''
                        )}
                        className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Chọn / Tải Ảnh Logo</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hotline / Zalo Liên Hệ Báo Phí</label>
                    <input 
                      type="text" 
                      value={data.general.phoneHotline || ''} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, phoneHotline: e.target.value } })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Tiếp Nhận Hồ Sơ & Booking</label>
                    <input 
                      type="text" 
                      value={data.general.emailContact || ''} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, emailContact: e.target.value } })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">URL Video Background Hero (MP4/Cloudfront/CDN)</label>
                    <input 
                      type="text" 
                      value={data.general.videoBgUrl || ''} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, videoBgUrl: e.target.value } })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* ═══ FONT & TYPOGRAPHY SETTINGS ═══ */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>Font & Kiểu Chữ (Typography)</span>
                  <span className="text-[10px] font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-bold">
                    LIVE PREVIEW
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Font Heading */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Font Tiêu Đề (Heading)</label>
                    <select
                      value={data.general.fontHeading || 'Space Grotesk'}
                      onChange={(e) => {
                        const val = e.target.value;
                        const nextGen = { ...data.general, fontHeading: val };
                        setData({ ...data, general: nextGen });
                        applyTypography(val, data.general.fontBody || 'Be Vietnam Pro', data.general.fontMono || 'IBM Plex Mono', data.general.fontSizeScale || 100);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold bg-white cursor-pointer"
                    >
                      {AVAILABLE_FONTS.filter(f => f.category !== 'mono').map(f => (
                        <option key={f.id} value={f.name}>{f.name} ({f.category})</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1" style={{ fontFamily: `'${data.general.fontHeading || 'Space Grotesk'}', sans-serif` }}>
                      Xem trước: <strong>ABCĐ abcđ 0123 — Xuân Hiến Media</strong>
                    </p>
                  </div>

                  {/* Font Body */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Font Nội Dung (Body Text)</label>
                    <select
                      value={data.general.fontBody || 'Be Vietnam Pro'}
                      onChange={(e) => {
                        const val = e.target.value;
                        const nextGen = { ...data.general, fontBody: val };
                        setData({ ...data, general: nextGen });
                        applyTypography(data.general.fontHeading || 'Space Grotesk', val, data.general.fontMono || 'IBM Plex Mono', data.general.fontSizeScale || 100);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold bg-white cursor-pointer"
                    >
                      {AVAILABLE_FONTS.filter(f => f.category !== 'mono').map(f => (
                        <option key={f.id} value={f.name}>{f.name} ({f.category})</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1" style={{ fontFamily: `'${data.general.fontBody || 'Be Vietnam Pro'}', sans-serif` }}>
                      Xem trước: <span>Đào tạo kỹ năng MC, Livestream chuyên nghiệp 1 kèm 1</span>
                    </p>
                  </div>

                  {/* Font Mono */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Font Code / Nhãn (Mono)</label>
                    <select
                      value={data.general.fontMono || 'IBM Plex Mono'}
                      onChange={(e) => {
                        const val = e.target.value;
                        const nextGen = { ...data.general, fontMono: val };
                        setData({ ...data, general: nextGen });
                        applyTypography(data.general.fontHeading || 'Space Grotesk', data.general.fontBody || 'Be Vietnam Pro', val, data.general.fontSizeScale || 100);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold bg-white cursor-pointer"
                    >
                      {AVAILABLE_FONTS.filter(f => f.category === 'mono').map(f => (
                        <option key={f.id} value={f.name}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size Scale */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Cỡ Chữ Toàn Trang: <span className="text-orange-600">{data.general.fontSizeScale || 100}%</span>
                    </label>
                    <input
                      type="range"
                      min={80}
                      max={130}
                      step={5}
                      value={data.general.fontSizeScale || 100}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        const nextGen = { ...data.general, fontSizeScale: val };
                        setData({ ...data, general: nextGen });
                        applyTypography(data.general.fontHeading || 'Space Grotesk', data.general.fontBody || 'Be Vietnam Pro', data.general.fontMono || 'IBM Plex Mono', val);
                      }}
                      className="w-full accent-orange-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                      <span>80% (Nhỏ)</span>
                      <span>100% (Mặc định)</span>
                      <span>130% (To)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editable Section Titles & Call-to-Action Text */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>2. Tiêu Đề Các Khối & Thông Điệp Đồng Hành</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tiêu Đề Khối Đồng Hành (Default: "Hãy để tôi đồng hành...")</label>
                    <input 
                      type="text" 
                      value={data.general.heroCtaText || ''} 
                      placeholder="Hãy để tôi đồng hành trên hành trình này"
                      onChange={(e) => setData({ ...data, general: { ...data.general, heroCtaText: e.target.value } })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mô Tả Phụ Khối Đồng Hành</label>
                    <input 
                      type="text" 
                      value={data.general.heroCtaSub || ''} 
                      placeholder="TƯ VẤN & XÂY DỰNG HỆ THỐNG CHUYÊN NGHIỆP"
                      onChange={(e) => setData({ ...data, general: { ...data.general, heroCtaSub: e.target.value } })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tiêu Đề Đăng Ký Tư Vấn Khóa Học & Dự Án</label>
                    <input 
                      type="text" 
                      value={data.general.contactTitle || ''} 
                      placeholder="Đăng ký tư vấn khóa học và dự án"
                      onChange={(e) => setData({ ...data, general: { ...data.general, contactTitle: e.target.value } })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mô Tả Khối Đăng Ký Tư Vấn</label>
                    <input 
                      type="text" 
                      value={data.general.contactSubtitle || ''} 
                      placeholder="Xuân Hiến sẽ gọi lại trực tiếp cho bạn..."
                      onChange={(e) => setData({ ...data, general: { ...data.general, contactSubtitle: e.target.value } })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Editable Navigation Menu Items & Footer */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>3. Tên Các Mục Menu Điều Hướng (Navigation Bar) & Chân Trang (Footer)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Menu 1 (Trang chủ)</label>
                    <input 
                      type="text" 
                      value={data.general.navHome || ''} 
                      placeholder="Trang chủ"
                      onChange={(e) => setData({ ...data, general: { ...data.general, navHome: e.target.value } })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Menu 2 (Về tôi)</label>
                    <input 
                      type="text" 
                      value={data.general.navAbout || ''} 
                      placeholder="Về tôi"
                      onChange={(e) => setData({ ...data, general: { ...data.general, navAbout: e.target.value } })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Menu 3 (Khóa học)</label>
                    <input 
                      type="text" 
                      value={data.general.navCourses || ''} 
                      placeholder="Khóa học"
                      onChange={(e) => setData({ ...data, general: { ...data.general, navCourses: e.target.value } })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Menu 4 (Dịch vụ)</label>
                    <input 
                      type="text" 
                      value={data.general.navServices || ''} 
                      placeholder="Dịch vụ"
                      onChange={(e) => setData({ ...data, general: { ...data.general, navServices: e.target.value } })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Menu 5 (Dự án)</label>
                    <input 
                      type="text" 
                      value={data.general.navProjects || ''} 
                      placeholder="Dự án"
                      onChange={(e) => setData({ ...data, general: { ...data.general, navProjects: e.target.value } })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Menu 6 (Kiến thức)</label>
                    <input 
                      type="text" 
                      value={data.general.navBlog || ''} 
                      placeholder="Kiến thức"
                      onChange={(e) => setData({ ...data, general: { ...data.general, navBlog: e.target.value } })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Menu 7 (Đăng ký tư vấn)</label>
                    <input 
                      type="text" 
                      value={data.general.navContact || ''} 
                      placeholder="Đăng ký tư vấn"
                      onChange={(e) => setData({ ...data, general: { ...data.general, navContact: e.target.value } })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mô Tả Chân Trang (Footer Description)</label>
                    <textarea 
                      rows={2}
                      value={data.general.footerDesc || ''} 
                      placeholder="Đào tạo kỹ năng cá nhân 1 kèm 1 thực chiến..."
                      onChange={(e) => setData({ ...data, general: { ...data.general, footerDesc: e.target.value } })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dòng Bản Quyền Chân Trang (Copyright Text)</label>
                    <textarea 
                      rows={2}
                      value={data.general.footerCopyright || ''} 
                      placeholder="© 2026 XUÂN HIẾN MEDIA & TRAINING. All rights reserved."
                      onChange={(e) => setData({ ...data, general: { ...data.general, footerCopyright: e.target.value } })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Portrait Control Box with Real-Time Live Monitor */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-600" />
                    <span>Quản Lý Ảnh Chân Dung MC Xuân Hiến (Trang Chủ Hero)</span>
                  </div>
                  <span className="text-[10px] font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-bold">
                    KHÔNG VIỀN · HÒA NỀN MỜ · NỔI BẬT HOVER
                  </span>
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Sliders & Controls */}
                  <div className="lg:col-span-7 space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Hình Ảnh Chân Dung (Góc Dáng Đứng Khoanh Tay / MC Chuyên Nghiệp)</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                          type="text" 
                          placeholder="https://images.unsplash.com/... hoac URL anh nén 4K"
                          value={data.general.heroPortraitUrl || ''} 
                          onChange={(e) => setData({ ...data, general: { ...data.general, heroPortraitUrl: e.target.value } })}
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => openPicker(
                            (selectedUrl) => setData({ ...data, general: { ...data.general, heroPortraitUrl: selectedUrl } }),
                            'CHỌN / TẢI ÀNH CHÂN DUNG HERO (TỰ ĐỘNG NÉN 300KB-500KB)',
                            data.general.heroPortraitUrl || ''
                          )}
                          className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span>Chọn / Tải Ảnh Nén</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <div className="flex justify-between font-bold text-slate-700 mb-1">
                          <span>Phóng To / Thu Nhỏ (Zoom)</span>
                          <span className="font-mono text-orange-600">{data.general.heroPortraitZoom || 100}%</span>
                        </div>
                        <input 
                          type="range"
                          min={70}
                          max={180}
                          value={data.general.heroPortraitZoom || 100}
                          onChange={(e) => setData({ ...data, general: { ...data.general, heroPortraitZoom: Number(e.target.value) } })}
                          className="w-full accent-orange-600 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-slate-700 mb-1">
                          <span>Dịch Chuyển Ngang (Offset X)</span>
                          <span className="font-mono text-orange-600">{data.general.heroPortraitOffsetX || 0}px</span>
                        </div>
                        <input 
                          type="range"
                          min={-100}
                          max={100}
                          value={data.general.heroPortraitOffsetX || 0}
                          onChange={(e) => setData({ ...data, general: { ...data.general, heroPortraitOffsetX: Number(e.target.value) } })}
                          className="w-full accent-orange-600 cursor-pointer"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <div className="flex justify-between font-bold text-slate-700 mb-1">
                          <span>Dịch Chuyển Dọc (Offset Y)</span>
                          <span className="font-mono text-orange-600">{data.general.heroPortraitOffsetY || 0}px</span>
                        </div>
                        <input 
                          type="range"
                          min={-100}
                          max={100}
                          value={data.general.heroPortraitOffsetY || 0}
                          onChange={(e) => setData({ ...data, general: { ...data.general, heroPortraitOffsetY: Number(e.target.value) } })}
                          className="w-full accent-orange-600 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-500 italic">★ Nhìn sang khung Monitor bên phải để xem kết quả hiển thị thực tế!</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setData({ 
                            ...data, 
                            general: { 
                              ...data.general, 
                              heroPortraitFlipX: !(data.general.heroPortraitFlipX !== false) 
                            } 
                          })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer transition-all ${
                            data.general.heroPortraitFlipX !== false
                              ? 'bg-orange-100 text-orange-700 border-orange-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          ↔ Lật Ngược Ngang ({data.general.heroPortraitFlipX !== false ? 'Quay Vào Trong' : 'Quay Ra'})
                        </button>
                        <button
                          type="button"
                          onClick={() => setData({ 
                            ...data, 
                            general: { 
                              ...data.general, 
                              heroPortraitZoom: 100, 
                              heroPortraitOffsetX: 0, 
                              heroPortraitOffsetY: 0,
                              heroPortraitFlipX: true
                            } 
                          })}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-mono font-bold border border-slate-200 cursor-pointer"
                        >
                          Đặt Lại Vị Trí
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Real-Time Visual Live Monitor Preview Frame */}
                  <div className="lg:col-span-5 p-3 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-2">
                    <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-extrabold tracking-wider uppercase text-slate-200">🔴 LIVE MONITOR TRANG CHỦ</span>
                      </div>
                      <span className="text-[10px] font-mono text-orange-400 font-bold">XEM TRỰC TIẾP</span>
                    </div>

                    {/* Live Preview Box */}
                    <div className="relative aspect-[4/5] bg-gradient-to-b from-orange-950/40 via-slate-900 to-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800/80">
                      {/* Ambient Aura */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

                      {/* Image Preview with maskImage and transform */}
                      <div className="relative w-full h-full overflow-hidden">
                        <img 
                          src={data.general.heroPortraitUrl || ""} 
                          alt="Live Monitor Portrait"
                          style={{
                            transform: `scaleX(${(data.general.heroPortraitFlipX !== false ? -1 : 1) * ((data.general.heroPortraitZoom || 100) / 100)}) scaleY(${(data.general.heroPortraitZoom || 100) / 100}) translate(${data.general.heroPortraitOffsetX || 0}px, ${data.general.heroPortraitOffsetY || 0}px)`,
                            maskImage: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0) 96%)',
                            WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0) 96%)',
                          }}
                          className="w-full h-full object-cover object-top transition-transform duration-200"
                        />
                      </div>

                      {/* Floating Badge Overlays */}
                      <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-md border border-orange-500/40 px-2 py-0.5 rounded-xl text-[9px] font-mono font-bold text-orange-400">
                        MC TRUYỀN HÌNH
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2 rounded-xl text-left">
                        <div className="text-[11px] font-extrabold text-white">NGUYỄN HỒNG XUÂN HIẾN</div>
                        <div className="text-[9px] font-mono text-orange-400 font-bold">TRAINER & COACHING</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Global Typography & Font Size Control Box */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                    <span>Cấu Hình Font Chữ & Kích Thước Chữ (20+ Font Việt Hóa Chuẩn)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    ÁP DỤNG TOÀN BỘ WEBSITE
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Font Tiêu Đề (Headings)</label>
                    <select
                      value={data.general.fontHeading || 'Space Grotesk'}
                      onChange={(e) => setData({ ...data, general: { ...data.general, fontHeading: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-slate-800"
                    >
                      {AVAILABLE_FONTS.map(f => (
                        <option key={f.id} value={f.name.split(' (')[0]}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Font Nội Dung (Body Text)</label>
                    <select
                      value={data.general.fontBody || 'Be Vietnam Pro'}
                      onChange={(e) => setData({ ...data, general: { ...data.general, fontBody: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-slate-800"
                    >
                      {AVAILABLE_FONTS.map(f => (
                        <option key={f.id} value={f.name.split(' (')[0]}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Font Mã / Thống Kê (Monospace)</label>
                    <select
                      value={data.general.fontMono || 'IBM Plex Mono'}
                      onChange={(e) => setData({ ...data, general: { ...data.general, fontMono: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-slate-800"
                    >
                      {AVAILABLE_FONTS.map(f => (
                        <option key={f.id} value={f.name.split(' (')[0]}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Cỡ Chữ Tổng Thể (Size Scale)</span>
                      <span className="font-mono text-orange-600">{data.general.fontSizeScale || 100}%</span>
                    </div>
                    <input 
                      type="range"
                      min={90}
                      max={125}
                      step={5}
                      value={data.general.fontSizeScale || 100}
                      onChange={(e) => setData({ ...data, general: { ...data.general, fontSizeScale: Number(e.target.value) } })}
                      className="w-full accent-orange-600 cursor-pointer mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Headlines */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Tiêu Đề & Mô Tả Trang Chủ (Hero Section)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Headline 1</label>
                    <input 
                      type="text" 
                      value={data.general.heroHeadline1} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, heroHeadline1: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Headline 2 (Gradient)</label>
                    <input 
                      type="text" 
                      value={data.general.heroHeadline2} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, heroHeadline2: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-orange-600"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Mô Tả Ngắn Giới Thiệu (Hỗ trợ HTML)</label>
                    <textarea 
                      rows={3}
                      value={data.general.heroSub} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, heroSub: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Thống Kê Kinh Nghiệm (Stats Highlights)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số 1 (MC Truyền Hình)</label>
                    <input type="text" value={data.general.stat1Value} onChange={(e) => setData({ ...data, general: { ...data.general, stat1Value: e.target.value } })} className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-bold" />
                    <input type="text" value={data.general.stat1Label} onChange={(e) => setData({ ...data, general: { ...data.general, stat1Label: e.target.value } })} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 mt-1" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số 2 (Setup Studio)</label>
                    <input type="text" value={data.general.stat2Value} onChange={(e) => setData({ ...data, general: { ...data.general, stat2Value: e.target.value } })} className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-bold" />
                    <input type="text" value={data.general.stat2Label} onChange={(e) => setData({ ...data, general: { ...data.general, stat2Label: e.target.value } })} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 mt-1" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số 3 (Kênh Truyền Hình)</label>
                    <input type="text" value={data.general.stat3Value} onChange={(e) => setData({ ...data, general: { ...data.general, stat3Value: e.target.value } })} className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-bold" />
                    <input type="text" value={data.general.stat3Label} onChange={(e) => setData({ ...data, general: { ...data.general, stat3Label: e.target.value } })} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 mt-1" />
                  </div>
                </div>
              </div>

              {/* SOCIAL MEDIA & MESSAGING CHANNELS MANAGEMENT */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-orange-600" />
                      <span>QUẢN LÝ KÊNH MẠNG XÃ HỘI & TRUYỀN THÔNG (FOOTER SOCIAL LINKS)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chỉnh sửa nhãn hiển thị, đường dẫn URL/ID, chọn biểu tượng đại diện hoặc Thêm/Xóa các kênh hiển thị ở chân trang.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newSocial: any = {
                        id: `social-${Date.now()}`,
                        platform: 'Mạng Xã Hội',
                        label: 'Kênh Mới',
                        url: 'https://',
                        iconName: 'Globe'
                      };
                      setData({ ...data, socialLinks: [...(data.socialLinks || []), newSocial] });
                    }}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Kênh Mạng Xã Hội Mới</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(data.socialLinks || []).map((item, sIdx) => (
                    <div
                      key={item.id || sIdx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-300 transition-all space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                        <span className="text-xs font-mono font-extrabold text-orange-600">
                          #{sIdx + 1} {item.platform || 'Platform'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Xóa kênh "${item.label}" khỏi chân trang?`)) {
                              const list = (data.socialLinks || []).filter((_, i) => i !== sIdx);
                              setData({ ...data, socialLinks: list });
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                          title="Xóa kênh này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Nhãn Hiển Thị (Tên nút)</label>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const list = [...(data.socialLinks || [])];
                              list[sIdx] = { ...list[sIdx], label: e.target.value };
                              setData({ ...data, socialLinks: list });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-bold text-slate-900 text-xs"
                            placeholder="Vd: Zalo Official, TikTok Channel..."
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Đường Dẫn URL / ID Liên Kết</label>
                          <input
                            type="text"
                            value={item.url}
                            onChange={(e) => {
                              const list = [...(data.socialLinks || [])];
                              list[sIdx] = { ...list[sIdx], url: e.target.value };
                              setData({ ...data, socialLinks: list });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-mono text-slate-800 text-[11px]"
                            placeholder="https://zalo.me/0813131385"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Biểu Tượng (Icon)</label>
                          <select
                            value={item.iconName || 'Globe'}
                            onChange={(e) => {
                              const list = [...(data.socialLinks || [])];
                              list[sIdx] = { ...list[sIdx], iconName: e.target.value };
                              setData({ ...data, socialLinks: list });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-bold text-slate-800 text-xs"
                          >
                            <option value="MessageCircle">MessageCircle (Zalo)</option>
                            <option value="Share2">Share2 (Facebook)</option>
                            <option value="Video">Video (TikTok)</option>
                            <option value="Youtube">Youtube</option>
                            <option value="Send">Send (Telegram)</option>
                            <option value="PhoneCall">PhoneCall (WhatsApp)</option>
                            <option value="Gamepad2">Gamepad2 (Discord)</option>
                            <option value="X">𝕏 (X.com / Twitter)</option>
                            <option value="AtSign">AtSign (Threads/Insta)</option>
                            <option value="Globe">Globe (Trang Web / Khác)</option>
                            <option value="Link2">Link2 (Liên kết)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STORY & ACHIEVEMENTS (FULL CONTENT EDITING A-Z) */}
          {activeTab === 'story' && (
            <div className="space-y-6">
              {/* Block 1: Story Narrative & Slogan */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>1. Bài Viết Sứ Mệnh & Câu Chuyện Của Xuân Hiến</span>
                  <span className="text-[10px] font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-bold">
                    TOÀN BỘ CÂU CÚ
                  </span>
                </h3>
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tiêu Đề Mục Câu Chuyện</label>
                      <input 
                        type="text" 
                        value={data.general.storyTitle || 'Hành Trình Của Xuân Hiến'} 
                        onChange={(e) => setData({ ...data, general: { ...data.general, storyTitle: e.target.value } })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Thẻ Tag Nhỏ Phía Trên Tiêu Đề</label>
                      <input 
                        type="text" 
                        value={data.general.storyTag || 'CÂU CHUYỆN CỦA TÔI'} 
                        onChange={(e) => setData({ ...data, general: { ...data.general, storyTag: e.target.value } })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-orange-600 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Câu Trích Dẫn Mở Đầu (Lead Quote)</label>
                    <textarea 
                      rows={2}
                      value={data.general.storyQuote || ''} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, storyQuote: e.target.value } })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-orange-700 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Đoạn 1 (Hành Trình U40 & Sứ Mệnh)</label>
                    <textarea 
                      rows={4}
                      value={data.general.storyP1 || ''} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, storyP1: e.target.value } })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 leading-relaxed text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Đoạn 2 (Đặc Tính Hướng Nội & Quan Sát Sâu)</label>
                    <textarea 
                      rows={4}
                      value={data.general.storyP2 || ''} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, storyP2: e.target.value } })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 leading-relaxed text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Đoạn 3 (Đọc Sách Tâm Lý & Sự Thấu Hiểu)</label>
                    <textarea 
                      rows={4}
                      value={data.general.storyP3 || ''} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, storyP3: e.target.value } })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 leading-relaxed text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Block 2: TV Host Achievements & Mentor Quote */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  2. Bảng Thành Tựu Truyền Hình & Trích Dẫn Đồng Hành
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tiêu Đề Bảng Thành Tựu</label>
                    <input 
                      type="text" 
                      value={data.general.achievementsTitle || 'THÀNH TỰU & KINH NGHIỆM THỰC CHIẾN'} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, achievementsTitle: e.target.value } })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-extrabold text-slate-900 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tiêu Đề Mục Lịch Sử Hành Trình</label>
                    <input 
                      type="text" 
                      value={data.general.careerTitle || 'Hành Trình Kinh Nghiệm & Lịch Sử Hoạt Động'} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, careerTitle: e.target.value } })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Trích Dẫn Khối Mentor Đồng Hành</label>
                    <textarea 
                      rows={3}
                      value={data.general.mentorQuote || ''} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, mentorQuote: e.target.value } })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-orange-900 bg-orange-50/50 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Block 3: Core Philosophy Cards (3 Thẻ Triết Lý) */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  3. 3 Giá Trị Cốt Lõi / Triết Lý Đào Tạo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Card 1 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="block font-bold text-slate-900">Thẻ 1: Tiêu Đề</label>
                    <input 
                      type="text" 
                      value={data.general.p1h || 'Thấu Hiểu Cốt Lõi'} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, p1h: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900"
                    />
                    <label className="block font-bold text-slate-700 pt-1">Mô Tả Thẻ 1</label>
                    <textarea 
                      rows={4}
                      value={data.general.p1p || ''} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, p1p: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 leading-relaxed font-medium"
                    />
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="block font-bold text-slate-900">Thẻ 2: Tiêu Đề</label>
                    <input 
                      type="text" 
                      value={data.general.p2h || 'Đồng Hành Thực Chiến'} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, p2h: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900"
                    />
                    <label className="block font-bold text-slate-700 pt-1">Mô Tả Thẻ 2</label>
                    <textarea 
                      rows={4}
                      value={data.general.p2p || ''} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, p2p: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 leading-relaxed font-medium"
                    />
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="block font-bold text-slate-900">Thẻ 3: Tiêu Đề</label>
                    <input 
                      type="text" 
                      value={data.general.p3h || 'Truyền Cảm Hứng & Thần Thái'} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, p3h: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900"
                    />
                    <label className="block font-bold text-slate-700 pt-1">Mô Tả Thẻ 3</label>
                    <textarea 
                      rows={4}
                      value={data.general.p3p || ''} 
                      onChange={(e) => setData({ ...data, general: { ...data.general, p3p: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 leading-relaxed font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COURSES FULL CRUD — 2 COLUMNS GRID LAYOUT */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Quản Lý Khóa Học 1-1 ({data.courses.length} Khóa)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Bố cục 2 cột song song gọn gàng, ô nhập chữ rộng rãi dễ soạn thảo nội dung</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCourse}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Thêm Khóa Học Mới</span>
                </button>
              </div>

              {/* 2-Column Grid for Course Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {data.courses.map((course, idx) => (
                  <div key={course.id || idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Header Title & Delete */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="text"
                            value={course.code}
                            onChange={(e) => {
                              const newCourses = [...data.courses];
                              newCourses[idx].code = e.target.value;
                              setData({ ...data, courses: newCourses });
                            }}
                            className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 w-20 shrink-0 text-center"
                          />
                          <input 
                            type="text" 
                            value={course.title}
                            onChange={(e) => {
                              const newCourses = [...data.courses];
                              newCourses[idx].title = e.target.value;
                              setData({ ...data, courses: newCourses });
                            }}
                            className="text-sm sm:text-base font-extrabold text-slate-900 bg-transparent border-b border-slate-300 px-2 py-0.5 flex-1 min-w-0"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer shrink-0"
                          title="Xóa khóa học này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">Mô Tả Phụ (Subtitle)</label>
                          <input 
                            type="text" 
                            value={course.subtitle} 
                            onChange={(e) => {
                              const newCourses = [...data.courses];
                              newCourses[idx].subtitle = e.target.value;
                              setData({ ...data, courses: newCourses });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-800" 
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Thời Lượng (Duration)</label>
                          <input 
                            type="text" 
                            value={course.duration} 
                            onChange={(e) => {
                              const newCourses = [...data.courses];
                              newCourses[idx].duration = e.target.value;
                              setData({ ...data, courses: newCourses });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900" 
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Hình Thức Offline</label>
                          <input 
                            type="text" 
                            value={course.formatOffline} 
                            onChange={(e) => {
                              const newCourses = [...data.courses];
                              newCourses[idx].formatOffline = e.target.value;
                              setData({ ...data, courses: newCourses });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium" 
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">Hình Thức Online</label>
                          <input 
                            type="text" 
                            value={course.formatOnline} 
                            onChange={(e) => {
                              const newCourses = [...data.courses];
                              newCourses[idx].formatOnline = e.target.value;
                              setData({ ...data, courses: newCourses });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium" 
                          />
                        </div>

                        {/* Banner & Thumbnail Image Pickers */}
                        <div className="sm:col-span-2 pt-2 border-t border-slate-100 space-y-3">
                          <div>
                            <label className="block font-bold text-slate-800 text-xs mb-1">Ảnh Banner Quảng Cáo Khóa Học</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={course.bannerImage || course.bgImage || ''} 
                                onChange={(e) => {
                                  const newCourses = [...data.courses];
                                  newCourses[idx].bannerImage = e.target.value;
                                  newCourses[idx].bgImage = e.target.value;
                                  setData({ ...data, courses: newCourses });
                                }}
                                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 bg-orange-50/40" 
                              />
                              <button
                                type="button"
                                onClick={() => openPicker(
                                  (selectedUrl) => {
                                    const newCourses = [...data.courses];
                                    newCourses[idx].bannerImage = selectedUrl;
                                    newCourses[idx].bgImage = selectedUrl;
                                    setData({ ...data, courses: newCourses });
                                  },
                                  `CHỌN BANNER KHÓA HỌC: ${course.title}`,
                                  course.bannerImage || course.bgImage || ''
                                )}
                                className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>Đổi Banner</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-800 text-xs mb-1">Ảnh Thumbnail (Danh Sách Khóa Học)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={course.thumbnailUrl || ''} 
                                onChange={(e) => {
                                  const newCourses = [...data.courses];
                                  newCourses[idx].thumbnailUrl = e.target.value;
                                  setData({ ...data, courses: newCourses });
                                }}
                                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 bg-orange-50/40" 
                              />
                              <button
                                type="button"
                                onClick={() => openPicker(
                                  (selectedUrl) => {
                                    const newCourses = [...data.courses];
                                    newCourses[idx].thumbnailUrl = selectedUrl;
                                    setData({ ...data, courses: newCourses });
                                  },
                                  `CHỌN ẢNH THUMBNAIL: ${course.title}`,
                                  course.thumbnailUrl || ''
                                )}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>Đổi Thumbnail</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lessons Editor */}
                      <div className="pt-2 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-800">Các Bài Học Lộ Trình ({course.lessons.length} Bài)</span>
                          <button 
                            type="button"
                            onClick={() => {
                              const newCourses = [...data.courses];
                              newCourses[idx].lessons.push({ lessonTitle: `BÀI ${newCourses[idx].lessons.length + 1}: Bài học thực hành mới`, points: ['Chỉ số đạt được...'] });
                              setData({ ...data, courses: newCourses });
                            }}
                            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Thêm Bài Học
                          </button>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {course.lessons.map((les, lIdx) => (
                            <div key={lIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <input 
                                  type="text" 
                                  value={les.lessonTitle} 
                                  onChange={(e) => {
                                    const newCourses = [...data.courses];
                                    newCourses[idx].lessons[lIdx].lessonTitle = e.target.value;
                                    setData({ ...data, courses: newCourses });
                                  }}
                                  className="w-full font-bold text-slate-900 bg-white px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newCourses = [...data.courses];
                                    newCourses[idx].lessons.splice(lIdx, 1);
                                    setData({ ...data, courses: newCourses });
                                  }}
                                  className="text-slate-400 hover:text-red-600 p-1 cursor-pointer shrink-0"
                                  title="Xóa bài học này"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Chi tiết bài học (Mỗi dòng 1 ý)</label>
                                <textarea 
                                  rows={3}
                                  value={les.points.join('\n')}
                                  onChange={(e) => {
                                    const newCourses = [...data.courses];
                                    newCourses[idx].lessons[lIdx].points = e.target.value.split('\n').filter(p => p.trim());
                                    setData({ ...data, courses: newCourses });
                                  }}
                                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-xs leading-relaxed font-medium"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SERVICES FULL CRUD */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Quản Lý Dịch Vụ & Solutions ({data.services.length} Dịch Vụ)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Bố cục 2 cột song song gọn gàng, đổi biểu tượng icon, mô tả chi tiết & thẻ từ khóa</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Thêm Dịch Vụ Mới</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.services.map((sv, sIdx) => (
                  <div key={sv.id || sIdx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3.5 text-xs flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <select
                            value={sv.iconName || 'Headphones'}
                            onChange={(e) => {
                              const newSv = [...data.services];
                              newSv[sIdx].iconName = e.target.value;
                              setData({ ...data, services: newSv });
                            }}
                            className="p-1.5 rounded-xl bg-orange-50 text-orange-600 font-bold border border-orange-200 text-xs cursor-pointer shrink-0"
                          >
                            <option value="Headphones">🎧 Studio Setup</option>
                            <option value="Tv">📺 Truyền Hình</option>
                            <option value="Video">🎥 Livestream</option>
                            <option value="Mic">🎙️ Đào Tạo Voice</option>
                            <option value="Monitor">💻 Khóa Học Live</option>
                            <option value="Layers">📚 Giải Pháp</option>
                            <option value="Sparkles">⚡ Booking KOL</option>
                          </select>

                          <input
                            type="text"
                            value={sv.title}
                            onChange={(e) => {
                              const newSv = [...data.services];
                              newSv[sIdx].title = e.target.value;
                              setData({ ...data, services: newSv });
                            }}
                            className="text-sm font-extrabold text-slate-900 bg-transparent border-b border-slate-300 px-2 py-0.5 flex-1 min-w-0"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(sv.id)}
                          className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer shrink-0"
                          title="Xóa dịch vụ này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Dịch Vụ & Giải Pháp</label>
                        <textarea
                          rows={4}
                          value={sv.description}
                          onChange={(e) => {
                            const newSv = [...data.services];
                            newSv[sIdx].description = e.target.value;
                            setData({ ...data, services: newSv });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs sm:text-sm text-slate-800 leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Thẻ Từ Khóa (Cách nhau bằng dấu ·)</label>
                        <input
                          type="text"
                          value={sv.tags}
                          onChange={(e) => {
                            const newSv = [...data.services];
                            newSv[sIdx].tags = e.target.value;
                            setData({ ...data, services: newSv });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs text-orange-700 bg-orange-50/40"
                        />
                      </div>

                      {/* Service Thumbnail */}
                      <div className="pt-2 border-t border-slate-100">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Ảnh Thumbnail Dịch Vụ (Landscape 16:9)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Dán URL ảnh thumbnail..."
                            value={sv.thumbnailUrl || ''}
                            onChange={(e) => {
                              const newSv = [...data.services];
                              newSv[sIdx].thumbnailUrl = e.target.value;
                              setData({ ...data, services: newSv });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 bg-orange-50/40"
                          />
                          <button
                            type="button"
                            onClick={() => openPicker(
                              (selectedUrl) => {
                                const newSv = [...data.services];
                                newSv[sIdx].thumbnailUrl = selectedUrl;
                                setData({ ...data, services: newSv });
                              },
                              `CHỌN ẢNH THUMBNAIL: ${sv.title}`,
                              sv.thumbnailUrl || ''
                            )}
                            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Đổi Ảnh</span>
                          </button>
                        </div>
                      </div>

                      {/* Service Showcase Photo Album (Add / Delete multiple photos) */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700">Album Ảnh Dự Án Thực Tế (Showcase Album)</label>
                          <button
                            type="button"
                            onClick={() => openPicker(
                              (selectedUrl) => {
                                const newSv = [...data.services];
                                const currentPhotos = newSv[sIdx].galleryPhotos || [];
                                newSv[sIdx].galleryPhotos = [...currentPhotos, selectedUrl];
                                setData({ ...data, services: newSv });
                              },
                              `THÊM ẢNH VÀO ALBUM: ${sv.title}`
                            )}
                            className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Thêm Ảnh
                          </button>
                        </div>
                        
                        {sv.galleryPhotos && sv.galleryPhotos.length > 0 ? (
                          <div className="grid grid-cols-4 gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 border border-slate-200 rounded-lg">
                            {sv.galleryPhotos.map((url, pIdx) => (
                              <div key={pIdx} className="relative aspect-video rounded bg-slate-200 overflow-hidden group">
                                <img src={url} className="w-full h-full object-cover" alt="" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSv = [...data.services];
                                    const currentPhotos = [...(newSv[sIdx].galleryPhotos || [])];
                                    currentPhotos.splice(pIdx, 1);
                                    newSv[sIdx].galleryPhotos = currentPhotos;
                                    setData({ ...data, services: newSv });
                                  }}
                                  className="absolute inset-0 bg-red-600/90 text-white font-bold text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  Xóa
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic text-center py-2 bg-slate-50 rounded-lg border border-slate-200 font-medium">
                            Chưa có ảnh nào trong album. Bấm "+ Thêm Ảnh" để tải thêm.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DỰ ÁN & TIKTOK (QUẢN LÝ ĐẦY ĐỦ 4 HẠNG MỤC THEO LƯỚI 4 CỘT) */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-xs text-orange-900 font-medium flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-600 shrink-0" />
                  <span>
                    <strong>QUẢN LÝ DỰ ÁN DẠNG LƯỚI 4 CỘT (4 HẠNG MỤC CHÍNH)</strong>: Mỗi dự án có thể dán link video, tùy chỉnh ảnh đại diện 16:9 và đính kèm <strong>Album ảnh thực tế</strong> để khách bấm vào xem Pop-up!
                  </span>
                </div>
              </div>

              {/* ITERATE OVER ALL 4 PROJECT CATEGORIES */}
              {(data.projects || []).map((cat, catIdx) => (
                <div key={cat.id || catIdx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  
                  {/* Category Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-orange-600" />
                        <span>Hạng Mục #{catIdx + 1}: {cat.title} ({cat.items.length} Dự Án)</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{cat.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newItem = {
                          id: `proj-${Date.now()}`,
                          title: 'TÊN DỰ ÁN MỚI',
                          role: 'ĐỐI TÁC / ROLE',
                          stats: '100K+ Views',
                          description: 'Mô tả ngắn gọn kết quả & hạng mục triển khai.',
                          url: 'https://',
                          thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
                          tags: ['Project', 'Live'],
                          galleryPhotos: []
                        };
                        const newProjects = [...(data.projects || [])];
                        newProjects[catIdx].items.push(newItem);
                        setData({ ...data, projects: newProjects });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Thêm Dự Án Vào Hạng Mục Này</span>
                    </button>
                  </div>

                  {/* 4-COLUMN COMPACT GRID LAYOUT FOR THIS CATEGORY */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    {cat.items.map((item, itemIdx) => (
                      <div
                        key={item.id || itemIdx}
                        className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-orange-400 transition-all space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          {/* 16:9 Thumbnail Photo Box */}
                          <div className="relative aspect-video w-full rounded-lg bg-slate-900 border border-slate-200 overflow-hidden group/img">
                            {item.thumbnailUrl ? (
                              <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-slate-400 font-bold">
                                Chưa có ảnh 16:9
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => openPicker(
                                (selectedUrl) => {
                                  const newProjects = [...(data.projects || [])];
                                  newProjects[catIdx].items[itemIdx].thumbnailUrl = selectedUrl;
                                  setData({ ...data, projects: newProjects });
                                },
                                `CHỌN ANH THUMBNAIL 16:9: ${item.title}`,
                                item.thumbnailUrl || ''
                              )}
                              className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs text-white opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-[10px] font-extrabold transition-opacity cursor-pointer"
                            >
                              📷 Đổi Ảnh Thumbnail 16:9
                            </button>
                          </div>

                          {/* Title Input */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tên Dự Án / Kênh</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const newProjects = [...(data.projects || [])];
                                newProjects[catIdx].items[itemIdx].title = e.target.value;
                                setData({ ...data, projects: newProjects });
                              }}
                              className="w-full font-extrabold text-slate-900 bg-white px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                            />
                          </div>

                          {/* Role & Stats Inputs */}
                          <div className="grid grid-cols-2 gap-1.5">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Handle / Khách Hàng</label>
                              <input
                                type="text"
                                value={item.role || ''}
                                placeholder="@ngoctrinh89"
                                onChange={(e) => {
                                  const newProjects = [...(data.projects || [])];
                                  newProjects[catIdx].items[itemIdx].role = e.target.value;
                                  setData({ ...data, projects: newProjects });
                                }}
                                className="w-full font-mono text-[11px] font-bold text-orange-600 bg-white px-2 py-1 rounded-lg border border-slate-300"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Followers / Thống Kê</label>
                              <input
                                type="text"
                                value={item.stats || ''}
                                placeholder="6.8M Followers"
                                onChange={(e) => {
                                  const newProjects = [...(data.projects || [])];
                                  newProjects[catIdx].items[itemIdx].stats = e.target.value;
                                  setData({ ...data, projects: newProjects });
                                }}
                                className="w-full font-mono text-[11px] font-bold text-slate-800 bg-white px-2 py-1 rounded-lg border border-slate-300"
                              />
                            </div>
                          </div>

                          {/* URL Input */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">URL Video / Trang Kênh</label>
                            <input
                              type="text"
                              value={item.url || ''}
                              placeholder="https://tiktok.com/@..."
                              onChange={(e) => {
                                const newProjects = [...(data.projects || [])];
                                newProjects[catIdx].items[itemIdx].url = e.target.value;
                                setData({ ...data, projects: newProjects });
                              }}
                              className="w-full px-2 py-1 rounded-lg border border-slate-300 font-mono text-[10px] bg-white text-slate-800"
                            />
                          </div>

                          {/* Description Textarea */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Mô Tả Chi Tiết Hạng Mục</label>
                            <textarea
                              rows={2}
                              value={item.description || ''}
                              onChange={(e) => {
                                const newProjects = [...(data.projects || [])];
                                newProjects[catIdx].items[itemIdx].description = e.target.value;
                                setData({ ...data, projects: newProjects });
                              }}
                              className="w-full px-2.5 py-1 bg-white rounded-lg border border-slate-300 text-[11px] font-medium leading-relaxed"
                            />
                          </div>

                          {/* Showcase Photos Gallery Attachments */}
                          <div className="pt-2 border-t border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="block text-[10px] font-extrabold text-slate-700">
                                📸 Album Ảnh Thực Tế ({item.galleryPhotos?.length || 0} Ảnh)
                              </label>
                              <button
                                type="button"
                                onClick={() => openPicker(
                                  (selectedUrl) => {
                                    const newProjects = [...(data.projects || [])];
                                    const currentGallery = newProjects[catIdx].items[itemIdx].galleryPhotos || [];
                                    newProjects[catIdx].items[itemIdx].galleryPhotos = [...currentGallery, selectedUrl];
                                    setData({ ...data, projects: newProjects });
                                  },
                                  `THÊM ẢNH VÀO ALBUM: ${item.title}`,
                                  ''
                                )}
                                className="text-[10px] font-extrabold text-orange-600 hover:text-orange-700 cursor-pointer flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Thêm Ảnh</span>
                              </button>
                            </div>

                            {/* Mini Gallery Grid */}
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                              {(item.galleryPhotos || []).map((imgUrl, gIdx) => (
                                <div key={gIdx} className="relative w-10 h-10 rounded-md overflow-hidden bg-slate-800 border border-slate-300 group/gal">
                                  <img src={imgUrl} alt={`Album ${gIdx}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newProjects = [...(data.projects || [])];
                                      const currentGallery = newProjects[catIdx].items[itemIdx].galleryPhotos || [];
                                      newProjects[catIdx].items[itemIdx].galleryPhotos = currentGallery.filter((_, i) => i !== gIdx);
                                      setData({ ...data, projects: newProjects });
                                    }}
                                    className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover/gal:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                    title="Xóa ảnh này khỏi album"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              {(!item.galleryPhotos || item.galleryPhotos.length === 0) && (
                                <span className="text-[9px] text-slate-400 font-mono italic">Chưa đính kèm album ảnh</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400">#{itemIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Xóa dự án "${item.title}"?`)) {
                                const newProjects = [...(data.projects || [])];
                                newProjects[catIdx].items = newProjects[catIdx].items.filter((_, i) => i !== itemIdx);
                                setData({ ...data, projects: newProjects });
                              }
                            }}
                            className="text-slate-400 hover:text-red-600 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa Dự Án</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: ARTICLES & BLOG RICH EDITOR */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              {!editingArticleSlug ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                        Danh Sách Bài Viết Blog ({Object.keys(data.articles).length} Bài)
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Bấm vào bất kỳ bài viết nào để mở Trình Soạn Thảo Block Chuyên Nghiệp</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddArticle}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Viết Bài Viết Mới</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(Object.entries(data.articles) as [string, Article][]).map(([slug, art]) => (
                      <div 
                        key={slug} 
                        className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-orange-400 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-600 font-mono text-[10px] font-bold uppercase">
                              {art.cat}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">{art.date}</span>
                          </div>

                          <h4 className="text-sm font-extrabold text-slate-900 mb-1 line-clamp-2">
                            {art.vi.title}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2 font-medium">
                            {art.vi.dek}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingArticleSlug(slug)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Soạn Thảo Block</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewArticle(art)}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              title="Xem kết quả hiển thị thực tế"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-600" />
                              <span>Live Pop-up</span>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(slug)}
                            className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                            title="Xóa bài viết"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl text-white">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingArticleSlug(null)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        ← Trở Về Danh Sách Bài Viết
                      </button>
                      <span className="text-xs text-slate-400 font-mono">
                        Slug: {editingArticleSlug}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewArticle(data.articles[editingArticleSlug])}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        <span>👁️ Xem Pop-up Preview Bài Viết</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave(false)}
                        className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Lưu Bài Viết</span>
                      </button>
                    </div>
                  </div>

                  {data.articles[editingArticleSlug] && (
                    <RichArticleBlockEditor
                      translation={data.articles[editingArticleSlug].vi}
                      onChange={(updatedVi) => {
                        setData({
                          ...data,
                          articles: {
                            ...data.articles,
                            [editingArticleSlug]: {
                              ...data.articles[editingArticleSlug],
                              vi: updatedVi
                            }
                          }
                        });
                      }}
                      albumPhotos={data.photoAlbum}
                      onUpdateAlbumPhotos={(updatedPhotos) => {
                        setData({ ...data, photoAlbum: updatedPhotos });
                      }}
                      onOpenPicker={openPicker}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PHOTO ALBUM & COMPRESSOR */}
          {activeTab === 'album' && (
            <PhotoAlbumManager
              photos={data.photoAlbum}
              onUpdatePhotos={(updatedPhotos) => {
                setData({ ...data, photoAlbum: updatedPhotos });
              }}
            />
          )}

          {/* TAB 8: BRAND LOGOS & MARQUEE SPEED */}
          {activeTab === 'brands' && (
            <div className="space-y-6">
              {/* SPEED CONTROL BOX */}
              <div className="p-6 bg-white rounded-2xl border border-orange-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-orange-600 font-extrabold text-sm uppercase tracking-wider">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>⚡ ĐIỀU CHỈNH TỐC ĐỘ CHẠY LOGO THƯƠNG HIỆU (MARQUEE SPEED)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                    {data.general.marqueeDuration || 55} giây / vòng
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">
                  Kéo thanh trượt để điều chỉnh tốc độ cuộn của thanh logo thương hiệu trên Trang Chủ (Thời gian càng ngắn thì logo cuộn càng nhanh).
                </p>

                <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100 space-y-2">
                  <div className="flex justify-between font-extrabold text-xs text-slate-800">
                    <span>⚡ Tốc độ cuộn:</span>
                    <span className="font-mono text-orange-600">{data.general.marqueeDuration || 55}s</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={120}
                    step={5}
                    value={data.general.marqueeDuration || 55}
                    onChange={(e) => setData({ ...data, general: { ...data.general, marqueeDuration: Number(e.target.value) } })}
                    className="w-full accent-orange-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500 pt-1">
                    <span className="text-orange-600">⚡ 15s (Chạy Rất Nhanh)</span>
                    <span>55s (Khuyên Dùng)</span>
                    <span className="text-slate-600">🐢 120s (Chạy Chậm Từ Từ)</span>
                  </div>
                </div>
              </div>

              {/* BRAND LOGOS MANAGEMENT LIST */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-orange-600" />
                      <span>DANH SÁCH LOGO THƯƠNG HIỆU & ĐỐI TÁC TRUYỀN HÌNH</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Thêm, xóa hoặc cập nhật tên thương hiệu, danh mục và hình ảnh đại diện hiển thị trên thanh cuộn.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newBrand: BrandLogoItem = {
                        id: `brand-${Date.now()}`,
                        name: 'Thương Hiệu Mới',
                        category: 'Đối Tác / Brand'
                      };
                      setData({ ...data, brandLogos: [...(data.brandLogos || []), newBrand] });
                    }}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Logo Thương Hiệu Mới</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {(data.brandLogos || []).map((brand, bIdx) => (
                    <div
                      key={brand.id || bIdx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-400 transition-all space-y-2 relative group flex flex-col justify-between"
                    >
                      {/* Compact Logo Image Box */}
                      <div className="relative aspect-video w-full rounded-lg bg-slate-900 border border-slate-200 flex items-center justify-center p-1.5 overflow-hidden group/img">
                        {brand.logoUrl ? (
                          <img src={brand.logoUrl} alt={brand.name} className="max-h-full max-w-full object-contain mx-auto my-auto" />
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-slate-400">Không có ảnh</span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            openPicker((selectedUrl) => {
                              const list = [...(data.brandLogos || [])];
                              list[bIdx] = { ...list[bIdx], logoUrl: selectedUrl };
                              setData({ ...data, brandLogos: list });
                            }, `Chọn Logo Cho ${brand.name}`, brand.logoUrl || '');
                          }}
                          className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs text-white opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-[10px] font-extrabold transition-opacity cursor-pointer"
                        >
                          Đổi Ảnh Logo
                        </button>
                      </div>

                      {/* Brand Name & Delete */}
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={brand.name}
                          placeholder="Tên thương hiệu..."
                          onChange={(e) => {
                            const list = [...(data.brandLogos || [])];
                            list[bIdx] = { ...list[bIdx], name: e.target.value };
                            setData({ ...data, brandLogos: list });
                          }}
                          className="w-full px-2 py-1 rounded-lg bg-white border border-slate-300 font-bold text-slate-900 text-[11px] focus:bg-white truncate"
                          title={brand.name}
                        />

                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 font-mono">#{bIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Xóa logo thương hiệu "${brand.name}"?`)) {
                                const list = (data.brandLogos || []).filter((_, i) => i !== bIdx);
                                setData({ ...data, brandLogos: list });
                              }
                            }}
                            className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                            title="Xóa thương hiệu này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: KHO TÀI LIỆU & FILE THỰC CHIẾN (Resources Manager) */}
          {activeTab === 'resources' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fadeIn space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <FolderDown className="w-5 h-5 text-orange-600" />
                    <span>QUẢN LÝ KHO TÀI LIỆU & FILE THỰC CHIẾN ({(data.resources || []).length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Thêm, sửa, xóa file PDF, Word, Excel, Link Google Drive, Ebook và tài khoản đăng nhập cho học viên.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddResource}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Tài Liệu Mới</span>
                </button>
              </div>

              {/* Resources List — 2-Column Balanced Admin Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(data.resources || []).map((res, idx) => (
                  <div key={res.id} className="p-5 rounded-2xl bg-white border-2 border-slate-900 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-extrabold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                        MỤC THỨ #{idx + 1} · ID: {res.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteResource(res.id)}
                        className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer bg-red-50 px-3 py-1 rounded-lg border border-red-200 shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa Tài Liệu</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[11px] font-mono font-bold text-slate-700">TÊN TÀI LIỆU / MẪU KỊCH BẢN:</label>
                        <input
                          type="text"
                          value={res.title}
                          onChange={(e) => {
                            const list = [...(data.resources || [])];
                            list[idx] = { ...list[idx], title: e.target.value };
                            setData({ ...data, resources: list });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-extrabold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      {/* Flexible Category Input / Select Combo */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono font-bold text-slate-700">DANH MỤC TÀI LIỆU (NHẬP HOẶC CHỌN):</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={res.cat}
                            placeholder="Nhập tên danh mục (VD: script, ebook, Kịch bản)..."
                            onChange={(e) => {
                              const list = [...(data.resources || [])];
                              list[idx] = { ...list[idx], cat: e.target.value as any };
                              setData({ ...data, resources: list });
                            }}
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-800 text-xs"
                          />
                          <select
                            value={['script', 'template', 'ebook', 'software', 'setup_guide'].includes(res.cat) ? res.cat : ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                const list = [...(data.resources || [])];
                                list[idx] = { ...list[idx], cat: e.target.value as any };
                                setData({ ...data, resources: list });
                              }
                            }}
                            className="px-2 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 text-xs w-28 shrink-0"
                          >
                            <option value="">Gợi Ý...</option>
                            <option value="script">Kịch Bản</option>
                            <option value="template">Template</option>
                            <option value="ebook">Ebook</option>
                            <option value="software">Phần Mềm</option>
                            <option value="setup_guide">Setup Guide</option>
                          </select>
                        </div>
                      </div>

                      {/* Flexible File Type Input / Select Combo */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono font-bold text-slate-700">LOẠI FILE / ĐỊNH DẠNG (NHẬP HOẶC CHỌN):</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={res.fileType}
                            placeholder="VD: PDF, DOCX, XLSX, DRIVE, ZIP..."
                            onChange={(e) => {
                              const list = [...(data.resources || [])];
                              list[idx] = { ...list[idx], fileType: e.target.value as any };
                              setData({ ...data, resources: list });
                            }}
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-800 text-xs uppercase"
                          />
                          <select
                            value={['PDF', 'DOCX', 'XLSX', 'DRIVE', 'ZIP', 'LINK'].includes(res.fileType) ? res.fileType : ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                const list = [...(data.resources || [])];
                                list[idx] = { ...list[idx], fileType: e.target.value as any };
                                setData({ ...data, resources: list });
                              }
                            }}
                            className="px-2 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 text-xs w-24 shrink-0"
                          >
                            <option value="">Gợi Ý...</option>
                            <option value="PDF">PDF</option>
                            <option value="DOCX">Word</option>
                            <option value="XLSX">Excel</option>
                            <option value="DRIVE">Drive</option>
                            <option value="ZIP">Zip</option>
                            <option value="LINK">Link</option>
                          </select>
                        </div>
                      </div>

                      {/* File URL / Download Link */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[11px] font-mono font-bold text-slate-700">ĐƯỜNG DẪN LINK TẢI / DRIVE URL:</label>
                        <input
                          type="text"
                          value={res.fileUrl}
                          placeholder="https://drive.google.com/... hoặc link nén file"
                          onChange={(e) => {
                            const list = [...(data.resources || [])];
                            list[idx] = { ...list[idx], fileUrl: e.target.value };
                            setData({ ...data, resources: list });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono text-xs text-blue-600 font-bold focus:bg-white"
                        />
                      </div>

                      {/* Optional Description */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[11px] font-mono font-bold text-slate-700 flex items-center justify-between">
                          <span>MÔ TẢ CHI TIẾT NỘI DUNG:</span>
                          <span className="text-slate-400 font-normal text-[10px]">(Không bắt buộc - Có thể bỏ trống nếu không muốn hiện)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={res.description || ''}
                          placeholder="Bỏ trống nếu không muốn hiển thị dòng mô tả dài..."
                          onChange={(e) => {
                            const list = [...(data.resources || [])];
                            list[idx] = { ...list[idx], description: e.target.value };
                            setData({ ...data, resources: list });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium focus:bg-white"
                        />
                      </div>

                      {/* Optional Access Note */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[11px] font-mono font-bold text-slate-700 flex items-center justify-between">
                          <span>GHI CHÚ QUYỀN TRUY CẬP / MẬT KHẨU FILE:</span>
                          <span className="text-slate-400 font-normal text-[10px]">(Không bắt buộc)</span>
                        </label>
                        <input
                          type="text"
                          value={res.accessNote || ''}
                          placeholder="VD: Mật khẩu mở file: 123456 hoặc Dành riêng học viên 1-1"
                          onChange={(e) => {
                            const list = [...(data.resources || [])];
                            list[idx] = { ...list[idx], accessNote: e.target.value };
                            setData({ ...data, resources: list });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-medium text-slate-800 text-xs focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: KHO HÌNH ẢNH & MEDIA STUDIO (PhotoAlbumManager) */}
          {activeTab === 'album' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fadeIn">
              <PhotoAlbumManager
                photos={data.photoAlbum}
                onUpdatePhotos={(updatedPhotos) => setData({ ...data, photoAlbum: updatedPhotos })}
              />
            </div>
          )}

        </div>

        {/* Footer Super Admin Bar */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất File Cấu Hình JSON</span>
            </button>
            <label className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Nhập File JSON</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi Phục Mặc Định</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Đóng Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className={`px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all ${
                isSaving ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 cursor-pointer'
              }`}
              title="Lưu tất cả dữ liệu và tiếp tục ở lại giao diện Admin để chỉnh sửa"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Đang Lưu...' : 'Lưu & Chỉnh Tiếp'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className={`px-5 py-2 rounded-xl text-white text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all ${
                isSaving ? 'bg-orange-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-500/30 cursor-pointer'
              }`}
              title="Lưu tất cả dữ liệu và tự động làm mới lại trang chủ"
            >
              <RotateCw className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'ĐANG LƯU LÊN MÁY CHỦ...' : 'LƯU LÊN SUPABASE & TẢI LẠI TRANG'}</span>
            </button>
          </div>
        </div>

        {/* Universal Image Picker Modal */}
        <UniversalImagePickerModal
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          title={pickerTitle}
          currentUrl={pickerCurrentUrl}
          photos={data.photoAlbum}
          onUpdatePhotos={(updatedPhotos) => setData({ ...data, photoAlbum: updatedPhotos })}
          onSelectUrl={(selectedUrl) => {
            if (pickerCallback) pickerCallback(selectedUrl);
          }}
        />

        {/* ARTICLE LIVE PREVIEW POP-UP MODAL */}
        {previewArticle && (
          <ArticleReaderModal
            slug={editingArticleSlug || 'preview'}
            lang="vi"
            onClose={() => setPreviewArticle(null)}
            overrideArticle={previewArticle}
          />
        )}

      </div>
    </div>
  );
};


