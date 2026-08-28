import { Language, CourseItem, Article, ServiceItem, PhotoAlbumItem, BrandLogoItem, SocialLinkItem, ResourceItem, TestimonialItem, LeadItem } from '../types';
import { translations } from './translations';
import { coursesData } from './courses';
import { projectCategoriesData, tiktokChannels, brandVideos } from './projects';
import { articles } from './articles';

export interface SiteGeneralConfig {
  brandName: string;
  subBrandName: string;
  phoneHotline: string;
  emailContact: string;
  studioLocation?: string;
  ctaHeader?: string;
  ctaSubheader?: string;
  ctaDescription?: string;
  videoBgUrl: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroSub: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
  stat5Value: string;
  stat5Label: string;
  storyTitle: string;
  storyTag: string;
  storyQuote: string;
  storyP1: string;
  storyP2: string;
  storyP3: string;
  achievementsTitle?: string;
  mentorQuote?: string;
  p1h?: string;
  p1p?: string;
  p2h?: string;
  p2p?: string;
  p3h?: string;
  p3p?: string;
  careerTitle?: string;
  heroPortraitUrl?: string;
  heroPortraitZoom?: number;
  heroPortraitOffsetX?: number;
  heroPortraitOffsetY?: number;
  heroPortraitFlipX?: boolean;
  fontHeading?: string;
  fontBody?: string;
  fontMono?: string;
  fontSizeScale?: number;
  marqueeDuration?: number;
  messengerLink?: string;
  zaloLink?: string;
  aboutTrainingImages?: string[];
  aboutTrainingVideos?: string[];
  logoImageUrl?: string;
  heroCtaText?: string;
  heroCtaSub?: string;
  contactTitle?: string;
  contactSubtitle?: string;
  navHome?: string;
  navAbout?: string;
  navCourses?: string;
  navServices?: string;
  navProjects?: string;
  navBlog?: string;
  navContact?: string;
  footerDesc?: string;
  footerCopyright?: string;
}

export const defaultServices: ServiceItem[] = [
  {
    id: 'sv-1',
    iconName: 'Headphones',
    title: 'Tư Vấn & Setup Studio Livestream',
    description: 'Tư vấn cấu hình máy tính, góc máy camera 4K, sơ đồ 3 đèn studio và hệ thống âm thanh chống nhiễu.',
    tags: 'Góc Máy 4K · Setup Ánh Sáng 3 Điểm · Soundcard Soundcraft · Cấu Hình PC',
    thumbnailUrl: '/images/covers/thumb_service_1.png',
  },
  {
    id: 'sv-2',
    iconName: 'Video',
    title: 'Vận Hành & Điều Phối Live Multi-Cam',
    description: 'Chuyển cảnh mượt mà với OBS/VMix, tích hợp khung graphics thương hiệu, overlay sản phẩm và khiển âm thanh.',
    tags: 'OBS Studio / VMix · Multi-Cam Switcher · Graphics Overlay · Đạo Diễn Kỹ Thuật',
    thumbnailUrl: '/images/covers/thumb_service_2.png'
  },
  {
    id: 'sv-3',
    iconName: 'Tv',
    title: 'Sản Xuất Livestream Bán Hàng Brand',
    description: 'Tối ưu phiên live bán hàng TikTok Shop, Shopee Live với kịch bản chốt đơn kỷ lục và điều phối phòng live.',
    tags: 'TikTok Shop Live · Shopee Live · Kịch Bản Chốt Đơn · Vận Hành Phòng Live',
    thumbnailUrl: '/images/covers/thumb_service_3.png'
  },
  {
    id: 'sv-4',
    iconName: 'Mic',
    title: 'Đào Tạo Voice Talent & Lồng Tiếng Quảng Cáo',
    description: 'Huấn luyện kỹ thuật đọc TVC, viral video, kiểm soát tốc độ, khẩu hình và làm chủ chất giọng tròn vang.',
    tags: 'Kỹ Thuật Đọc TVC · Kiểm Soát Tốc Độ · Khẩu Hình Chuẩn · Làm Chủ Chất Giọng',
    thumbnailUrl: '/images/covers/thumb_service_4.png'
  },
  {
    id: 'sv-5',
    iconName: 'Award',
    title: 'Đào Tạo Kỹ Năng MC & Thuyết Trình Sân Khấu',
    description: 'Xây dựng sự tự tin, thần thái trước camera, ngôn ngữ cơ thể và kỹ năng làm chủ mọi sự kiện trực tiếp.',
    tags: 'Thuyết Trình Sân Khấu · Thần Thái Camera · Thấu Hiểu Tâm Lý · Kịch Bản',
    thumbnailUrl: '/images/covers/thumb_course_4.png'
  }
];

export const defaultPhotoAlbum: PhotoAlbumItem[] = [
  {
    id: 'img-1',
    name: 'Studio Setup Pro 4K.jpg',
    url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1200&auto=format&fit=crop',
    originalSize: 2450000,
    compressedSize: 310000,
    width: 1200,
    height: 800,
    createdAt: '2026-07-28',
    caption: 'Góc quay 4K và hệ thống 3 đèn tiêu chuẩn phòng Studio Livestream'
  },
  {
    id: 'img-2',
    name: 'Xuan Hien MC Stage.jpg',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop',
    originalSize: 1850000,
    compressedSize: 240000,
    width: 1200,
    height: 800,
    createdAt: '2026-07-29',
    caption: 'Chương trình diễn thuyết kỹ năng thuyết trình sân khấu trước 500+ khán giả'
  },
  {
    id: 'img-3',
    name: 'Microphone Voice Talent.jpg',
    url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop',
    originalSize: 3100000,
    compressedSize: 290000,
    width: 1200,
    height: 800,
    createdAt: '2026-07-30',
    caption: 'Phòng thu âm lồng tiếng chuẩn broadcast chuyên nghiệp'
  },
  {
    id: 'album-baoviet',
    name: 'Logo Đối Tác — Tập Đoàn Bảo Việt',
    url: '/logos/baoviet.png',
    originalSize: 36969,
    compressedSize: 24646,
    width: 200,
    height: 90,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Tập Đoàn Bảo Việt (Tài Chính & Bảo Hiểm)'
  },
  {
    id: 'album-coca-cola',
    name: 'Logo Đối Tác — Coca-Cola Vietnam',
    url: '/logos/coca-cola.png',
    originalSize: 8001,
    compressedSize: 5334,
    width: 120,
    height: 90,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Coca-Cola Vietnam (FMCG & Đồ Uống)'
  },
  {
    id: 'album-dam-ca-mau',
    name: 'Logo Đối Tác — Đạm Cà Mau',
    url: '/logos/dam-ca-mau.png',
    originalSize: 17445,
    compressedSize: 11630,
    width: 180,
    height: 110,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Đạm Cà Mau (Nông Nghiệp & Phân Bón)'
  },
  {
    id: 'album-prudential',
    name: 'Logo Đối Tác — Prudential Vietnam',
    url: '/logos/prudential.png',
    originalSize: 17240,
    compressedSize: 11493,
    width: 140,
    height: 85,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Prudential Vietnam (Bảo Hiểm Nhân Thọ)'
  },
  {
    id: 'album-hd-saison',
    name: 'Logo Đối Tác — HD SAISON',
    url: '/logos/hd-saison.png',
    originalSize: 9923,
    compressedSize: 6615,
    width: 190,
    height: 85,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức HD SAISON (Tài Chính Tiêu Dùng)'
  },
  {
    id: 'album-dell',
    name: 'Logo Đối Tác — Dell Technology',
    url: '/logos/dell.png',
    originalSize: 4895,
    compressedSize: 3263,
    width: 100,
    height: 90,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Dell Technology (Công Nghệ & Thiết Bị)'
  },
  {
    id: 'album-samsung',
    name: 'Logo Đối Tác — Samsung Group',
    url: '/logos/samsung.png',
    originalSize: 32139,
    compressedSize: 21426,
    width: 200,
    height: 65,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Samsung Group (Tập Đoàn Điện Tử 4K)'
  },
  {
    id: 'album-th-true-milk',
    name: 'Logo Đối Tác — TH True Milk',
    url: '/logos/th-true-milk.png',
    originalSize: 29630,
    compressedSize: 19753,
    width: 140,
    height: 100,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức TH True Milk (Thực Phẩm Sữa TH)'
  },
  {
    id: 'album-scg-trading',
    name: 'Logo Đối Tác — SCG Trading',
    url: '/logos/scg-trading.png',
    originalSize: 5330,
    compressedSize: 3553,
    width: 155,
    height: 85,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức SCG Trading (Tập Đoàn Đa Quốc Gia)'
  },
  {
    id: 'album-bitis',
    name: 'Logo Đối Tác — Biti\'s Vietnam',
    url: '/logos/bitis.png',
    originalSize: 26175,
    compressedSize: 17450,
    width: 150,
    height: 95,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Biti\'s Vietnam (Thương Hiệu Giày Việt)'
  },
  {
    id: 'album-unilever',
    name: 'Logo Đối Tác — Unilever Vietnam',
    url: '/logos/unilever.png',
    originalSize: 36221,
    compressedSize: 24147,
    width: 145,
    height: 120,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Unilever Vietnam (Hóa Mỹ Phẩm Đa Quốc Gia)'
  },
  {
    id: 'album-phong-phu',
    name: 'Logo Đối Tác — Phong Phú Corp',
    url: '/logos/phong-phu.png',
    originalSize: 22307,
    compressedSize: 14871,
    width: 140,
    height: 85,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Phong Phú Corp (Dệt May & Sản Xuất)'
  },
  {
    id: 'album-omo',
    name: 'Logo Đối Tác — OMO Vietnam',
    url: '/logos/omo.png',
    originalSize: 30582,
    compressedSize: 20388,
    width: 135,
    height: 105,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức OMO Vietnam (Thương Hiệu Hàng Đầu)'
  },
  {
    id: 'album-generali',
    name: 'Logo Đối Tác — Generali Vietnam',
    url: '/logos/generali.png',
    originalSize: 24195,
    compressedSize: 16130,
    width: 180,
    height: 130,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Generali Vietnam (Tập Đoàn Bảo Hiểm)'
  },
  {
    id: 'album-chupa-chups',
    name: 'Logo Đối Tác — Chupa Chups',
    url: '/logos/chupa-chups.png',
    originalSize: 10956,
    compressedSize: 7304,
    width: 105,
    height: 90,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Chupa Chups (Bánh Kẹo Quốc Tế)'
  },
  {
    id: 'album-scg-chemicals',
    name: 'Logo Đối Tác — SCG Chemicals',
    url: '/logos/scg-chemicals.png',
    originalSize: 28590,
    compressedSize: 19060,
    width: 155,
    height: 85,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức SCG Chemicals (Hóa Chất & Công Nghiệp)'
  },
  {
    id: 'album-acca',
    name: 'Logo Đối Tác — ACCA Think Ahead',
    url: '/logos/acca.png',
    originalSize: 6101,
    compressedSize: 4067,
    width: 130,
    height: 85,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức ACCA Think Ahead (Tài Chính & Kế Toán)'
  },
  {
    id: 'album-henkel',
    name: 'Logo Đối Tác — Henkel Global',
    url: '/logos/henkel.png',
    originalSize: 10340,
    compressedSize: 6893,
    width: 140,
    height: 80,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Henkel Global (Tập Đoàn Đức)'
  },
  {
    id: 'album-arena-multimedia',
    name: 'Logo Đối Tác — Arena Multimedia',
    url: '/logos/arena-multimedia.png',
    originalSize: 7553,
    compressedSize: 5035,
    width: 130,
    height: 70,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Arena Multimedia (Đào Tạo Mỹ Thuật Đa Phương Tiện)'
  },
  {
    id: 'album-sanofi',
    name: 'Logo Đối Tác — Sanofi Pharmaceuticals',
    url: '/logos/sanofi.png',
    originalSize: 5253,
    compressedSize: 3502,
    width: 150,
    height: 95,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Sanofi Pharmaceuticals (Dược Phẩm Đa Quốc Gia)'
  },
  {
    id: 'album-vacs',
    name: 'Logo Đối Tác — VACS Vietnam Airlines',
    url: '/logos/vacs.png',
    originalSize: 43938,
    compressedSize: 29292,
    width: 260,
    height: 95,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức VACS Vietnam Airlines (Hàng Không & Suất Ăn)'
  },
  {
    id: 'album-fpt',
    name: 'Logo Đối Tác — FPT Corporation',
    url: '/logos/fpt.png',
    originalSize: 14217,
    compressedSize: 9478,
    width: 120,
    height: 55,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức FPT Corporation (Tập Đoàn Công Nghệ Việt)'
  },
  {
    id: 'album-htv7',
    name: 'Logo Đối Tác — HTV7 Truyền Hình TP.HCM',
    url: '/logos/htv7.png',
    originalSize: 11960,
    compressedSize: 7973,
    width: 200,
    height: 70,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức HTV7 Truyền Hình TP.HCM (Kênh TV Trực Tiếp)'
  },
  {
    id: 'album-vtv3',
    name: 'Logo Đối Tác — VTV3 Đài Truyền Hình Việt Nam',
    url: '/logos/vtv3.png',
    originalSize: 10565,
    compressedSize: 7043,
    width: 165,
    height: 70,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức VTV3 Đài Truyền Hình Việt Nam (Kênh Quốc Gia VTV)'
  },
  {
    id: 'album-vtv9',
    name: 'Logo Đối Tác — VTV9 Truyền Hình Quốc Gia',
    url: '/logos/vtv9.png',
    originalSize: 10418,
    compressedSize: 6945,
    width: 175,
    height: 70,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức VTV9 Truyền Hình Quốc Gia (Kênh TV Miền Nam)'
  },
  {
    id: 'album-vtv8',
    name: 'Logo Đối Tác — VTV8 Truyền Hình Quốc Gia',
    url: '/logos/vtv8.png',
    originalSize: 10677,
    compressedSize: 7118,
    width: 160,
    height: 70,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức VTV8 Truyền Hình Quốc Gia (Kênh TV Miền Trung)'
  },
  {
    id: 'album-htv9',
    name: 'Logo Đối Tác — HTV9 Truyền Hình TP.HCM',
    url: '/logos/htv9.png',
    originalSize: 11066,
    compressedSize: 7377,
    width: 200,
    height: 70,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức HTV9 Truyền Hình TP.HCM (Kênh Thời Sự & Tin Tức)'
  },
  {
    id: 'album-vtvcab-styletv',
    name: 'Logo Đối Tác — VTVCab Style TV',
    url: '/logos/vtvcab-styletv.png',
    originalSize: 20879,
    compressedSize: 13919,
    width: 115,
    height: 105,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức VTVCab Style TV (Kênh Phong Cách Sống)'
  },
  {
    id: 'album-toan-canh-24h',
    name: 'Logo Đối Tác — Toàn Cảnh 24h VTV9',
    url: '/logos/toan-canh-24h.png',
    originalSize: 49250,
    compressedSize: 32833,
    width: 190,
    height: 115,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Toàn Cảnh 24h VTV9 (Chương Trình TV Show)'
  },
  {
    id: 'album-thoi-su-drt1',
    name: 'Logo Đối Tác — Thời Sự DRT1 Đà Nẵng',
    url: '/logos/thoi-su-drt1.png',
    originalSize: 108180,
    compressedSize: 72120,
    width: 235,
    height: 125,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Thời Sự DRT1 Đà Nẵng (Truyền Hình Đà Nẵng)'
  },
  {
    id: 'album-tuoi-tre-online',
    name: 'Logo Đối Tác — Báo Tuổi Trẻ Online',
    url: '/logos/tuoi-tre-online.png',
    originalSize: 21570,
    compressedSize: 14380,
    width: 315,
    height: 105,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Báo Tuổi Trẻ Online (Cơ Quan Ngôn Luận)'
  },
  {
    id: 'album-tieng-cuoi-sinh-vien',
    name: 'Logo Đối Tác — Tiếng Cười Sinh Viên HTV7',
    url: '/logos/tieng-cuoi-sinh-vien.png',
    originalSize: 76583,
    compressedSize: 51055,
    width: 190,
    height: 110,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Tiếng Cười Sinh Viên HTV7 (Show Truyền Hình HTV7)'
  },
  {
    id: 'album-tin-nhanh-18h',
    name: 'Logo Đối Tác — Tin Nhanh 18h Kiên Giang',
    url: '/logos/tin-nhanh-18h.png',
    originalSize: 119291,
    compressedSize: 79527,
    width: 240,
    height: 135,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Tin Nhanh 18h Kiên Giang (Truyền Hình Kiên Giang)'
  },
  {
    id: 'album-thtpct',
    name: 'Logo Đối Tác — TH Cần Thơ THTPCT',
    url: '/logos/thtpct.png',
    originalSize: 10449,
    compressedSize: 6966,
    width: 130,
    height: 45,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức TH Cần Thơ THTPCT (Đài Truyền Hình Cần Thơ)'
  },
  {
    id: 'album-thtg',
    name: 'Logo Đối Tác — TH Tiền Giang THTG',
    url: '/logos/thtg.png',
    originalSize: 14765,
    compressedSize: 9843,
    width: 135,
    height: 45,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức TH Tiền Giang THTG (Đài Truyền Hình Tiền Giang)'
  },
  {
    id: 'album-thdt',
    name: 'Logo Đối Tác — TH Đồng Tháp THĐT',
    url: '/logos/thdt.png',
    originalSize: 16023,
    compressedSize: 10682,
    width: 130,
    height: 115,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức TH Đồng Tháp THĐT (Đài Truyền Hình Đồng Tháp)'
  },
  {
    id: 'album-chuyen-trua-12g',
    name: 'Logo Đối Tác — Chuyện Trưa 12h HTV7/HTV9',
    url: '/logos/chuyen-trua-12g.png',
    originalSize: 75831,
    compressedSize: 50554,
    width: 195,
    height: 145,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức Chuyện Trưa 12h HTV7/HTV9 (Show MC Xuân Hiến Dẫn)'
  },
  {
    id: 'album-todaytv',
    name: 'Logo Đối Tác — TodayTV Thế Giới Của Bạn',
    url: '/logos/todaytv.png',
    originalSize: 39261,
    compressedSize: 26174,
    width: 210,
    height: 95,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức TodayTV Thế Giới Của Bạn (Kênh Truyền Hình TodayTV)'
  },
  {
    id: 'album-sctv12',
    name: 'Logo Đối Tác — SCTV12 Cáp SCTV',
    url: '/logos/sctv12.png',
    originalSize: 41015,
    compressedSize: 27343,
    width: 210,
    height: 80,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức SCTV12 Cáp SCTV (Kênh Truyền Hình Cáp)'
  },
  {
    id: 'album-htv-coop',
    name: 'Logo Đối Tác — HTV Co.op Shopping',
    url: '/logos/htv-coop.png',
    originalSize: 10356,
    compressedSize: 6904,
    width: 200,
    height: 50,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức HTV Co.op Shopping (Kênh Mua Sắm HTV)'
  },
  {
    id: 'album-vgs-shop',
    name: 'Logo Đối Tác — VGS Shop My Real Shop',
    url: '/logos/vgs-shop.png',
    originalSize: 24522,
    compressedSize: 16348,
    width: 170,
    height: 55,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức VGS Shop My Real Shop (Kênh Shopping Livestream)'
  },
  {
    id: 'album-vtv-hyundai',
    name: 'Logo Đối Tác — VTV Hyundai Home Shopping',
    url: '/logos/vtv-hyundai.png',
    originalSize: 27552,
    compressedSize: 18368,
    width: 175,
    height: 55,
    createdAt: '2026-07-30',
    caption: 'Logo chính thức VTV Hyundai Home Shopping (Kênh Truyền Hình Mua Sắm)'
  }
];

export interface FullAdminData {
  general: SiteGeneralConfig;
  courses: CourseItem[];
  services: ServiceItem[];
  projects: typeof projectCategoriesData;
  tiktokChannels: typeof tiktokChannels;
  brandVideos: typeof brandVideos;
  articles: Record<string, Article>;
  photoAlbum: PhotoAlbumItem[];
  brandLogos: BrandLogoItem[];
  socialLinks: SocialLinkItem[];
  resources: ResourceItem[];
  testimonials: TestimonialItem[];
}

export const defaultSocialLinks: SocialLinkItem[] = [
  { id: 's-zalo', platform: 'Zalo', label: 'Zalo Official', url: 'https://zalo.me/0813131385', iconName: 'MessageCircle' },
  { id: 's-fb', platform: 'Facebook', label: 'Facebook MC', url: 'https://facebook.com', iconName: 'Share2' },
  { id: 's-tiktok', platform: 'TikTok', label: 'TikTok', url: 'https://tiktok.com', iconName: 'Video' },
  { id: 's-yt', platform: 'YouTube', label: 'YouTube', url: 'https://youtube.com', iconName: 'Youtube' },
  { id: 's-tele', platform: 'Telegram', label: 'Telegram', url: 'https://t.me/mcxuanhien', iconName: 'Send' },
  { id: 's-wa', platform: 'WhatsApp', label: 'WhatsApp', url: 'https://wa.me/84813131385', iconName: 'PhoneCall' },
  { id: 's-discord', platform: 'Discord', label: 'Discord', url: 'https://discord.gg/xuanhien', iconName: 'Gamepad2' },
  { id: 's-x', platform: 'X.com', label: 'X.com', url: 'https://x.com/mcxuanhien', iconName: 'X' },
  { id: 's-threads', platform: 'Threads', label: 'Threads', url: 'https://threads.net/@xuanhien.mc', iconName: 'AtSign' }
];

export const defaultTestimonials: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Nguyễn Văn A',
    role: 'Học viên Khóa Giao Tiếp K12',
    content: 'Khóa học của anh Hiến rất thực tế, giúp tôi tự tin hơn hẳn khi thuyết trình trước đám đông. Kỹ năng kiểm soát giọng nói là một bước ngoặt lớn.',
    rating: 5,
    avatarUrl: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: 't-2',
    name: 'Trần Thị B',
    role: 'KOL / TikToker',
    content: 'Studio Setup quá chuyên nghiệp. Nhờ đội ngũ Xuân Hiến Media mà phòng livestream của tôi lên hình siêu nét, âm thanh mượt mà không bị rè.',
    rating: 5,
    avatarUrl: 'https://i.pravatar.cc/150?u=2'
  },
  {
    id: 't-3',
    name: 'Công ty Cổ phần VNG',
    role: 'Đối tác Truyền thông',
    content: 'Làm việc với MC Xuân Hiến mang lại cảm giác an tâm tuyệt đối. Khả năng xử lý tình huống trên sân khấu và kịch bản rất chắc tay.',
    rating: 5,
    avatarUrl: 'https://i.pravatar.cc/150?u=3'
  }
];

export const defaultBrandLogos: BrandLogoItem[] = [
  { id: 'baoviet', name: 'Bảo Việt Group', category: 'Tài Chính & Bảo Hiểm', logoUrl: '/logos/baoviet.png' },
  { id: 'coca-cola', name: 'Coca-Cola', category: 'FMCG & Đồ Uống', logoUrl: '/logos/coca-cola.png' },
  { id: 'dam-ca-mau', name: 'Đạm Cà Mau', category: 'Nông Nghiệp & Phân Bón', logoUrl: '/logos/dam-ca-mau.png' },
  { id: 'prudential', name: 'Prudential', category: 'Bảo Hiểm Nhân Thọ', logoUrl: '/logos/prudential.png' },
  { id: 'hd-saison', name: 'HD SAISON', category: 'Tài Chính Tiêu Dùng', logoUrl: '/logos/hd-saison.png' },
  { id: 'dell', name: 'Dell Technology', category: 'Công Nghệ & Thiết Bị', logoUrl: '/logos/dell.png' },
  { id: 'samsung', name: 'Samsung', category: 'Tập Đoàn Điện Tử 4K', logoUrl: '/logos/samsung.png' },
  { id: 'th-true-milk', name: 'TH True Milk', category: 'Thực Phẩm Sữa TH', logoUrl: '/logos/th-true-milk.png' },
  { id: 'scg-trading', name: 'SCG Trading', category: 'Tập Đoàn Đa Quốc Gia', logoUrl: '/logos/scg-trading.png' },
  { id: 'bitis', name: 'Biti\'s', category: 'Thương Hiệu Giày Việt', logoUrl: '/logos/bitis.png' },
  { id: 'unilever', name: 'Unilever', category: 'Hóa Mỹ Phẩm Đa Quốc Gia', logoUrl: '/logos/unilever.png' },
  { id: 'phong-phu', name: 'Phong Phú Corp', category: 'Dệt May & Sản Xuất', logoUrl: '/logos/phong-phu.png' },
  { id: 'omo', name: 'OMO', category: 'Thương Hiệu Hàng Đầu', logoUrl: '/logos/omo.png' },
  { id: 'generali', name: 'Generali', category: 'Tập Đoàn Bảo Hiểm', logoUrl: '/logos/generali.png' },
  { id: 'chupa-chups', name: 'Chupa Chups', category: 'Bánh Kẹo Quốc Tế', logoUrl: '/logos/chupa-chups.png' },
  { id: 'scg-chemicals', name: 'SCG Chemicals', category: 'Hóa Chất & Công Nghiệp', logoUrl: '/logos/scg-chemicals.png' },
  { id: 'acca', name: 'ACCA Think Ahead', category: 'Tài Chính & Kế Toán', logoUrl: '/logos/acca.png' },
  { id: 'henkel', name: 'Henkel', category: 'Tập Đoàn Đức', logoUrl: '/logos/henkel.png' },
  { id: 'arena-multimedia', name: 'Arena Multimedia', category: 'Mỹ Thuật Đa Phương Tiện', logoUrl: '/logos/arena-multimedia.png' },
  { id: 'sanofi', name: 'Sanofi', category: 'Dược Phẩm Đa Quốc Gia', logoUrl: '/logos/sanofi.png' },
  { id: 'vacs', name: 'VACS Vietnam Airlines', category: 'Hàng Không & Suất Ăn', logoUrl: '/logos/vacs.png' },
  { id: 'fpt', name: 'FPT Corporation', category: 'Tập Đoàn Công Nghệ Việt', logoUrl: '/logos/fpt.png' },
  { id: 'htv7', name: 'HTV7', category: 'Kênh TV Trực Tiếp', logoUrl: '/logos/htv7.png' },
  { id: 'vtv3', name: 'VTV3', category: 'Kênh Quốc Gia VTV', logoUrl: '/logos/vtv3.png' },
  { id: 'vtv9', name: 'VTV9', category: 'Kênh TV Miền Nam', logoUrl: '/logos/vtv9.png' },
  { id: 'vtv8', name: 'VTV8', category: 'Kênh TV Miền Trung', logoUrl: '/logos/vtv8.png' },
  { id: 'htv9', name: 'HTV9', category: 'Kênh Thời Sự & Tin Tức', logoUrl: '/logos/htv9.png' },
  { id: 'vtvcab-styletv', name: 'VTVCab Style TV', category: 'Kênh Phong Cách Sống', logoUrl: '/logos/vtvcab-styletv.png' },
  { id: 'toan-canh-24h', name: 'Toàn Cảnh 24h VTV9', category: 'Chương Trình TV Show', logoUrl: '/logos/toan-canh-24h.png' },
  { id: 'thoi-su-drt1', name: 'Thời Sự DRT1 Đà Nẵng', category: 'Truyền Hình Đà Nẵng', logoUrl: '/logos/thoi-su-drt1.png' },
  { id: 'tuoi-tre-online', name: 'Báo Tuổi Trẻ Online', category: 'Cơ Quan Ngôn Luận', logoUrl: '/logos/tuoi-tre-online.png' },
  { id: 'tieng-cuoi-sinh-vien', name: 'Tiếng Cười Sinh Viên HTV7', category: 'Show Truyền Hình HTV7', logoUrl: '/logos/tieng-cuoi-sinh-vien.png' },
  { id: 'tin-nhanh-18h', name: 'Tin Nhanh 18h Kiên Giang', category: 'Truyền Hình Kiên Giang', logoUrl: '/logos/tin-nhanh-18h.png' },
  { id: 'thtpct', name: 'THTPCT Cần Thơ', category: 'Đài Truyền Hình Cần Thơ', logoUrl: '/logos/thtpct.png' },
  { id: 'thtg', name: 'THTG Tiền Giang', category: 'Đài Truyền Hình Tiền Giang', logoUrl: '/logos/thtg.png' },
  { id: 'thdt', name: 'THĐT Đồng Tháp', category: 'Đài Truyền Hình Đồng Tháp', logoUrl: '/logos/thdt.png' },
  { id: 'chuyen-trua-12g', name: 'Chuyện Trưa 12h HTV7/HTV9', category: 'Show MC Xuân Hiến Dẫn', logoUrl: '/logos/chuyen-trua-12g.png' },
  { id: 'todaytv', name: 'TodayTV', category: 'Kênh Truyền Hình TodayTV', logoUrl: '/logos/todaytv.png' },
  { id: 'sctv12', name: 'SCTV12', category: 'Kênh Truyền Hình Cáp', logoUrl: '/logos/sctv12.png' },
  { id: 'htv-coop', name: 'HTV Co.op', category: 'Kênh Mua Sắm HTV', logoUrl: '/logos/htv-coop.png' },
  { id: 'vgs-shop', name: 'VGS Shop', category: 'Kênh Shopping Livestream', logoUrl: '/logos/vgs-shop.png' },
  { id: 'vtv-hyundai', name: 'VTV Hyundai', category: 'Kênh Truyền Hình Mua Sắm', logoUrl: '/logos/vtv-hyundai.png' },
];

export const defaultResources: ResourceItem[] = [];

export const defaultAdminData: FullAdminData = {
  general: {
    brandName: "XUÂN HIẾN",
    subBrandName: "MEDIA & STUDIO",
    phoneHotline: "0813 13 13 85",
    emailContact: "admin@xuanhien.info",
    messengerLink: "https://m.me/hiennguyen.mc",
    zaloLink: 'https://zalo.me/0813131385',
    aboutTrainingImages: [
      "/images/covers/thumb_service_1.png",
      "/images/covers/thumb_service_2.png",
      "/images/covers/thumb_service_3.png",
      "/images/covers/thumb_service_4.png",
      "/images/covers/thumb_course_4.png"
    ],
    aboutTrainingVideos: [],
    studioLocation: "TP. Hồ Chí Minh (Đào tạo Offline 1-1 & Online)",
    ctaHeader: "BẮT ĐẦU HÀNH TRÌNH BỨT PHÁ CÙNG XUÂN HIẾN",
    ctaSubheader: "Bạn cần thiết kế lộ trình đào tạo riêng?",
    ctaDescription: "Liên hệ trực tiếp với Xuân Hiến qua Zalo/Hotline hoặc gửi thông tin để nhận buổi tư vấn 1-1 định hướng miễn phí.",
    videoBgUrl: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4",
    heroHeadline1: "ĐÀO TẠO KỸ NĂNG CÁ NHÂN",
    heroHeadline2: "TUYỆT VỜI CHO BẠN",
    heroSub: "Tôi là <strong>Xuân Hiến</strong> — Chuyên gia Đào Tạo Kỹ Năng, Mentor đồng hành & Producer Livestream chuyên nghiệp với <strong>12+ năm kinh nghiệm MC truyền hình</strong> và <strong>8+ năm tư vấn setup studio livestream</strong>.",
    stat1Value: "12+",
    stat1Label: "Năm MC Truyền Hình",
    stat2Value: "08+",
    stat2Label: "Năm Setup Livestream",
    stat3Value: "14+",
    stat3Label: "Đài TV Đã Từng Dẫn",
    stat4Value: "04",
    stat4Label: "Khóa Học 1-1 Thực Chiến",
    stat5Value: "500+",
    stat5Label: "Học Viên & Đơn Vị Đồng Hành",
    storyTitle: "Hành Trình Của Xuân Hiến",
    storyTag: "CÂU CHUYỆN CỦA TÔI",
    storyQuote: "\"Mỗi người trong chúng ta đều sở hữu những năng lực tuyệt vời chờ được khai phá...\"",
    storyP1: translations.vi.a_p1,
    storyP2: translations.vi.a_p2,
    storyP3: translations.vi.a_p3,
    achievementsTitle: translations.vi.a_achievements_title,
    mentorQuote: translations.vi.a_mentor_quote,
    p1h: translations.vi.p1h,
    p1p: translations.vi.p1p,
    p2h: translations.vi.p2h,
    p2p: translations.vi.p2p,
    p3h: translations.vi.p3h,
    p3p: translations.vi.p3p,
    careerTitle: "Hành Trình Kinh Nghiệm & Lịch Sử Hoạt Động",
    heroPortraitUrl: "",
    heroPortraitZoom: 100,
    heroPortraitOffsetX: 0,
    heroPortraitOffsetY: 0,
    heroPortraitFlipX: true,
    fontHeading: "Space Grotesk",
    fontBody: "Be Vietnam Pro",
    fontMono: "IBM Plex Mono",
    fontSizeScale: 100,
    marqueeDuration: 55,
  },
  courses: coursesData,
  services: defaultServices,
  projects: projectCategoriesData,
  tiktokChannels: tiktokChannels,
  brandVideos: brandVideos,
  articles: articles,
  photoAlbum: defaultPhotoAlbum,
  brandLogos: defaultBrandLogos,
  socialLinks: defaultSocialLinks,
  resources: defaultResources,
  testimonials: defaultTestimonials,
};

const STORAGE_KEY = 'xuanhien_super_admin_v4';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache for regular users

import { supabase } from '../lib/supabase';

// Đồng bộ từ localStorage ngay khi nạp script để tránh F5 bị nạp font mặc định
let currentAdminData: FullAdminData = (() => {
  try {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultAdminData,
        ...parsed,
        general: { ...defaultAdminData.general, ...(parsed.general || {}) },
        resources: (parsed.resources && parsed.resources.length > 0) ? parsed.resources : defaultResources,
        testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : defaultTestimonials,
      };
    }
  } catch (e) {
    console.warn("Failed to load initial adminData from localStorage", e);
  }
  return defaultAdminData;
})();

export function getAdminData(): FullAdminData {
  if (!currentAdminData.resources || currentAdminData.resources.length === 0) {
    currentAdminData.resources = defaultResources;
  }
  return currentAdminData;
}

let isSubscribed = false;

export async function loadAdminDataAsync(subscribe: boolean = false, forceReload: boolean = false): Promise<FullAdminData> {
  try {
    if (typeof window !== 'undefined' && !forceReload) {
      const lastFetch = sessionStorage.getItem('xuanhien_last_fetch');
      const isAdmin = sessionStorage.getItem('xuanhien_admin_mode') === 'true';
      if (!isAdmin && lastFetch && Date.now() - parseInt(lastFetch) < CACHE_TTL_MS) {
        // Cache is fresh, skip Supabase query to prevent DB overload
        console.log("Using cached admin data (TTL 15m)");
        return currentAdminData;
      }
    }

    const { data, error } = await supabase
      .from('site_config')
      .select('data')
      .eq('id', 1)
      .single();
      
    if (error) {
      console.warn("Supabase fetch error, fallback to local:", error);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        currentAdminData = { ...defaultAdminData, ...JSON.parse(saved) };
      }
    } else if (data && data.data) {
      const parsed = data.data as Partial<FullAdminData>;
      // LUẬT SẮT: Supabase là nguồn sự thật duy nhất. KHÔNG BAO GIỜ ghi đè dữ liệu Supabase bằng defaultAdminData.
      currentAdminData = {
        general: { ...defaultAdminData.general, ...(parsed.general || {}) },
        courses: Array.isArray(parsed.courses) ? parsed.courses : defaultAdminData.courses,
        services: Array.isArray(parsed.services) ? parsed.services : defaultAdminData.services,
        projects: parsed.projects || defaultAdminData.projects,
        tiktokChannels: Array.isArray(parsed.tiktokChannels) ? parsed.tiktokChannels : defaultAdminData.tiktokChannels,
        brandVideos: Array.isArray(parsed.brandVideos) ? parsed.brandVideos : defaultAdminData.brandVideos,
        articles: (parsed.articles && Object.keys(parsed.articles).length > 0) ? parsed.articles : defaultAdminData.articles,
        photoAlbum: Array.isArray(parsed.photoAlbum) ? parsed.photoAlbum : defaultAdminData.photoAlbum,
        brandLogos: Array.isArray(parsed.brandLogos) ? parsed.brandLogos : defaultAdminData.brandLogos,
        socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : defaultAdminData.socialLinks,
        resources: Array.isArray(parsed.resources) ? parsed.resources : (defaultAdminData.resources || []),
        testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : (defaultAdminData.testimonials || []),
      };
      // Lưu lại vào localStorage để F5 sau này nạp tức thì
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentAdminData));
        sessionStorage.setItem('xuanhien_last_fetch', Date.now().toString());
      } catch (err) {
        console.warn("Could not write to localStorage", err);
      }
    }

    // Bắn sự kiện để tất cả các component (bao gồm typography engine) áp dụng dữ liệu mới nhất từ Supabase
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('admin_data_updated'));
    }

    // Lắng nghe thay đổi Realtime từ Supabase (Chỉ khi cần thiết, VD: Admin)
    if (subscribe && !isSubscribed) {
      supabase
        .channel('public:site_config')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_config' }, (payload) => {
          console.log("🔄 Realtime update received!", payload);
          let parsed = payload.new.data as Partial<FullAdminData>;
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch(e) {}
          }
          if (parsed) {
            currentAdminData = {
              general: { ...defaultAdminData.general, ...(parsed.general || {}) },
              courses: Array.isArray(parsed.courses) ? parsed.courses : defaultAdminData.courses,
              services: Array.isArray(parsed.services) ? parsed.services : defaultAdminData.services,
              projects: parsed.projects || defaultAdminData.projects,
              tiktokChannels: Array.isArray(parsed.tiktokChannels) ? parsed.tiktokChannels : defaultAdminData.tiktokChannels,
              brandVideos: Array.isArray(parsed.brandVideos) ? parsed.brandVideos : defaultAdminData.brandVideos,
              articles: parsed.articles ? parsed.articles : defaultAdminData.articles,
              photoAlbum: Array.isArray(parsed.photoAlbum) ? parsed.photoAlbum : defaultAdminData.photoAlbum,
              brandLogos: Array.isArray(parsed.brandLogos) ? parsed.brandLogos : defaultAdminData.brandLogos,
              socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : defaultAdminData.socialLinks,
              resources: Array.isArray(parsed.resources) ? parsed.resources : (defaultAdminData.resources || []),
              testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : (defaultAdminData.testimonials || []),
            };
            window.dispatchEvent(new Event('admin_data_updated'));
            window.dispatchEvent(new Event('supabase_realtime_update')); // Dùng để App.tsx re-render
          }
        })
        .subscribe();
      isSubscribed = true;
    }
  } catch (e) {
    console.error("Failed to load admin data from Supabase", e);
  }
  return currentAdminData;
}

export async function saveAdminData(newData: FullAdminData): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('site_config')
      .update({ data: newData })
      .eq('id', 1);

    if (error) {
      console.error("Lỗi khi lưu lên Supabase:", error);
      return false;
    }
    
    currentAdminData = newData;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentAdminData));
      sessionStorage.setItem('xuanhien_last_fetch', Date.now().toString()); // Reset cache timestamp
    } catch(e) {}
    
    window.dispatchEvent(new Event('admin_data_updated'));
    return true;
  } catch (e: any) {
    console.error("Failed to save admin data to Supabase", e);
    if (typeof window !== 'undefined') {
      if (e?.code === '42501' || (e?.message && e.message.includes('row-level security'))) {
          alert("🚨 LỖI BẢO MẬT SUPABASE (RLS): Dữ liệu CỦA BẠN CHƯA ĐƯỢC LƯU LÊN DATABASE!\n\nLý do: Row Level Security (RLS) của Supabase đang chặn quyền Ghi dữ liệu.\n\nCách xử lý:\n1. Vào trang quản trị Supabase của dự án này.\n2. Chọn phần Authentication -> Policies hoặc Table Editor -> site_config.\n3. Nhấn 'Disable RLS' cho bảng `site_config` hoặc thêm Policy cho phép UPDATE/INSERT.");
      } else {
          alert(`❌ LỖI LƯU DỮ LIỆU LÊN SUPABASE:\n${e?.message || 'Vui lòng kiểm tra tab Console (F12) để biết thêm chi tiết.'}\n\nDữ liệu của bạn chưa được lưu thành công!`);
      }
    }
    return false;
  }
}

export async function resetAdminData(): Promise<FullAdminData> {
  try {
    const { error } = await supabase
      .from('site_config')
      .upsert({ id: 1, data: defaultAdminData });
      
    if (error) throw error;
    currentAdminData = defaultAdminData;
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('admin_data_updated'));
  } catch (e) {
    console.error("Failed to reset admin data on Supabase", e);
  }
  return currentAdminData;
}
