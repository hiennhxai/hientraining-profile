import { SocialMediaChannel, ProjectCategoryItem } from '../types';

export const tiktokChannels: SocialMediaChannel[] = [
  {
    id: 'ngoc-trinh',
    title: 'KÊNH TIKTOK - NGỌC TRINH',
    handle: '@ngoctrinh89',
    followers: '6.8M+ Followers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    channelUrl: 'https://www.tiktok.com/@ngoctrinh89',
    description: 'Tư vấn kịch bản livestream, cấu hình góc quay 4K và điều phối kỹ thuật cho các phiên Mega Stream chốt đơn.',
    links: [
      { label: 'Clip Livestream 1 — TikTok @ngoctrinh89', url: 'https://www.tiktok.com/@ngoctrinh89/video/7406598157548784914' },
      { label: 'Clip Livestream 2 — TikTok @ngoctrinh89', url: 'https://www.tiktok.com/@ngoctrinh89/video/7405579598836141319' },
      { label: 'Clip Livestream 3 — TikTok @ngoctrinh89', url: 'https://www.tiktok.com/@ngoctrinh89/video/7407005020643675399' }
    ]
  },
  {
    id: 'be-duy',
    title: 'KÊNH TIKTOK - BÉ DUY',
    handle: '@beduyzuize',
    followers: '1.2M+ Followers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    channelUrl: 'https://www.tiktok.com/@beduyzuize',
    description: 'Huấn luyện làm chủ camera, giọng nói truyền cảm hứng và kỹ năng giữ chân người xem livestream.',
    links: [
      { label: 'Clip Livestream 1 — TikTok @beduyzuize', url: 'https://www.tiktok.com/@beduyzuize/video/7405837827885305109' },
      { label: 'Clip Livestream 2 — TikTok @beduyzuize', url: 'https://www.tiktok.com/@beduyzuize/video/7397264972994202897' }
    ]
  },
  {
    id: 'hiany',
    title: 'KÊNH TIKTOK - HIANY',
    handle: '@hiany.official',
    followers: '850K+ Followers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
    channelUrl: 'https://www.tiktok.com/@ngoctrinh89',
    description: 'Setup hệ thống 3 đèn chuẩn studio, soundcard lọc nhiễu âm thanh chuyên nghiệp.',
    links: [
      { label: 'Clip Livestream Hiany 1', url: 'https://www.tiktok.com/@ngoctrinh89/video/7406598157548784914' }
    ]
  },
  {
    id: 'hien-nguyen',
    title: 'KÊNH OFFICIAL - MC XUÂN HIỂN',
    handle: '@hiennguyen.mc',
    followers: '500K+ Followers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
    channelUrl: 'https://www.tiktok.com/@hiennguyen.mc',
    description: 'Kênh chính thức chia sẻ kinh nghiệm MC truyền hình, kỹ năng giao tiếp & tư vấn setup phòng studio.',
    links: [
      { label: 'Channel Official — @hiennguyen.mc', url: 'https://www.tiktok.com/@hiennguyen.mc' }
    ]
  }
];

export const brandVideos = [
  { name: 'Bế Bistro', desc: 'Sản xuất video quảng cáo & truyền thông thương hiệu ẩm thực' },
  { name: 'Du Yên Vegetarian', desc: 'Video ẩm thực chay tinh tế & trải nghiệm không gian sang trọng' },
  { name: 'Laika Cafe Ninh Thuận', desc: 'Video không gian cafe & điểm đến trải nghiệm ấn tượng' }
];

export interface ProjectCardItem {
  id: string;
  title: string;
  role?: string;
  description: string;
  url?: string;
  stats?: string;
  tags?: string[];
}

export interface ProjectCategory {
  id: string;
  title: string;
  description: string;
  items: ProjectCardItem[];
}

export const projectCategoriesData: ProjectCategory[] = [
  {
    id: 'tiktok-channels',
    title: 'KÊNH TIKTOK ĐỘI NGŨ & HỌC VIÊN',
    description: 'Các dự án tư vấn, đào tạo kỹ năng livestream & vận hành kênh cho KOL/KOC hàng đầu.',
    items: [
      {
        id: 'ngoc-trinh-tk',
        title: 'TikTok @ngoctrinh89 — Ngọc Trinh Official',
        role: 'PRODUCER & LIVESTREAM COACH',
        description: 'Tư vấn kịch bản, ánh sáng studio & điều phối livestream chốt đơn kỷ lục trên TikTok Shop.',
        url: 'https://www.tiktok.com/@ngoctrinh89',
        stats: '6.8M+ Followers',
        tags: ['TikTok Shop', 'Fashion', 'Mega Stream']
      },
      {
        id: 'be-duy-tk',
        title: 'TikTok @beduyzuize — Bé Duy Zui Zẻ',
        role: 'LIVESTREAM MENTOR',
        description: 'Huấn luyện kỹ năng nói trước ống kính, tương tác livestream nâng cao năng lượng khán giả.',
        url: 'https://www.tiktok.com/@beduyzuize',
        stats: '1.2M+ Followers',
        tags: ['Beauty', 'Livestream Sale', 'Host']
      },
      {
        id: 'hian-ny-tk',
        title: 'TikTok Hiany Official',
        role: 'STUDIO PRODUCER',
        description: 'Setup hệ thống 3 đèn chuẩn studio & điều khiển soundcard chống hú rè cho kênh.',
        url: 'https://www.tiktok.com/@ngoctrinh89',
        stats: 'High Retention',
        tags: ['Audio Setup', 'Lighting', 'Livestream']
      },
      {
        id: 'mc-xuan-hien-tk',
        title: 'TikTok @hiennguyen.mc — Xuân Hiển Official',
        role: 'PERSONAL BRAND',
        description: 'Kênh chia sẻ kiến thức setup livestream, quản trị sự tự tin & kỹ năng giao tiếp.',
        url: 'https://www.tiktok.com/@hiennguyen.mc',
        stats: 'Official Channel',
        tags: ['MC Skills', 'Livestream Tips', 'Coaching']
      }
    ]
  },
  {
    id: 'livestream-sales',
    title: 'LIVESTREAM BÁN HÀNG BRAND LỚN',
    description: 'Trực tiếp chỉ đạo sản xuất & dẫn dắt livestream bán hàng cho các tập đoàn thương hiệu danh tiếng.',
    items: [
      {
        id: 'oc-thanh-van',
        title: "Let's Weekend Cùng Ốc Thanh Vân — Havaianas",
        role: 'TALKSHOW & LIVE SALE',
        description: 'Chương trình trải nghiệm thương hiệu dép Havaianas tại showroom chính thức.',
        url: 'https://www.facebook.com/HavaianasVietnamOfficial/videos/683874168897074',
        stats: 'Maison JSC',
        tags: ['Fashion', 'Live Showroom', 'Host']
      },
      {
        id: 'aojo-maison',
        title: 'Aojo Eyewear Livestream Launching',
        role: 'PRODUCER & HOST',
        description: 'Livestream giới thiệu bộ sưu tập kính mắt thời trang cao cấp Aojo Vietnam.',
        url: 'https://www.facebook.com/maisonjsc/videos/333290181084195/',
        stats: 'Maison Retail',
        tags: ['Eyewear', 'Flash Sale', 'Talkshow']
      },
      {
        id: 'galaxy-note20',
        title: 'Trải Nghiệm Galaxy Note 20 — HnamMobile Tech',
        role: 'TECH REVIEWER & MC',
        description: 'Livestream đánh giá siêu phẩm Samsung Galaxy Note 20 & bốc thăm trúng thưởng.',
        url: 'https://www.facebook.com/Hnammobile.vn/videos/305691387213624',
        stats: 'HnamMobile',
        tags: ['Technology', 'Launch Event', 'Live Unbox']
      },
      {
        id: 'bartending-2022',
        title: 'Vòng Chung Kết Vietnam Flair Bartending 2022',
        role: 'MAIN STAGE MC',
        description: 'Dẫn dắt giải đấu pha chế quy mô quốc gia cùng nhãn hàng Mathieu Teisseire.',
        url: 'https://www.facebook.com/mathieuteiseirevietnam/videos/876594076870282/',
        stats: 'National Event',
        tags: ['Bartending', 'Live Stage', 'Championship']
      }
    ]
  },
  {
    id: 'virtual-events',
    title: 'VIRTUAL EVENTS & SỰ KIỆN DOANH NGHIỆP',
    description: 'Chuyên gia sản xuất các sự kiện trực tuyến, lễ tôn vinh & hội thảo quy mô hàng nghìn người.',
    items: [
      {
        id: 'vuot-len-kd',
        title: 'Vượt Lên — Những Con Đường Kinh Doanh',
        role: 'TALKSHOW HOST',
        description: 'Tọa đàm truyền cảm hứng kinh doanh và quản trị doanh nghiệp giai đoạn mới.',
        url: 'https://www.facebook.com/vuotlennhungconduongkinhdoanh/videos/1098021087607275/',
        stats: 'Talkshow Doanh Nhân',
        tags: ['Virtual Summit', 'Business', 'Inspiration']
      },
      {
        id: 'anphabe-summit',
        title: 'Anphabe Virtual HR Summit',
        role: 'EVENT PRODUCER',
        description: 'Diễn đàn nhân sự lớn nhất Việt Nam với sự tham gia của hàng trăm CEO & HR Directors.',
        url: 'https://www.facebook.com/anphabe/videos/404621008032735/',
        stats: 'Anphabe Official',
        tags: ['HR Summit', 'Virtual Stream', 'Enterprise']
      },
      {
        id: 'iron-woman-2021',
        title: 'Lễ Tôn Vinh Iron Woman Award 2021',
        role: 'CEREMONY MC',
        description: 'Lễ trao giải trực tuyến tôn vinh những người phụ nữ bản lĩnh và cống hiến.',
        url: 'https://fb.watch/9gckAWxSGg/',
        stats: 'Award Ceremony',
        tags: ['Award Show', 'Live Production']
      },
      {
        id: 'hung-thinh-land',
        title: 'Hưng Thịnh Land Virtual Property Launch',
        role: 'VIRTUAL MC',
        description: 'Lễ ra mắt trực tuyến dự án bất động sản cao cấp của Tập đoàn Hưng Thịnh.',
        url: 'https://www.facebook.com/HungThinhLand.Official/videos/325884235969235/',
        stats: 'Hưng Thịnh Land',
        tags: ['Real Estate', '3D Stage', 'Property']
      }
    ]
  },
  {
    id: 'brand-videos',
    title: 'SẢN XUẤT VIDEO THƯƠNG HIỆU & F&B',
    description: 'Tư vấn góc máy, ánh sáng & kịch bản nội dung truyền thông F&B chuyên nghiệp.',
    items: [
      {
        id: 'be-bistro',
        title: 'Bế Bistro — Fine Dining Video',
        role: 'VIDEO DIRECTOR',
        description: 'Sản xuất video quảng cáo & truyền thông thương hiệu ẩm thực phong cách hiện đại.',
        stats: 'F&B Media',
        tags: ['Food Video', 'Commercial', 'Lighting']
      },
      {
        id: 'du-yen',
        title: 'Du Yên Vegetarian — Tinh Hoa Ẩm Thực Chay',
        role: 'CREATIVE DIRECTOR',
        description: 'Video giới thiệu kiến trúc không gian tĩnh tại & nghệ thuật ẩm thực chay cao cấp.',
        stats: 'Restaurant Media',
        tags: ['Vegetarian', 'Aesthetic Video', 'Cinematic']
      },
      {
        id: 'laika-cafe',
        title: 'Laika Cafe Ninh Thuận — Destination Review',
        role: 'PRODUCER',
        description: 'Sản xuất video trải nghiệm không gian cafe độc đáo & truyền thông điểm đến.',
        stats: 'Cafe Franchise',
        tags: ['Cafe Spaces', 'Promo Video', 'Vlog']
      }
    ]
  }
];

