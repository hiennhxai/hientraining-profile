import { SocialMediaChannel, ProjectCategoryItem } from '../types';

export const tiktokChannels: SocialMediaChannel[] = [
  {
    id: 'ngoc-trinh',
    title: 'KÊNH TIKTOK - NGỌC TRINH',
    handle: '@ngoctrinh89',
    followers: '6.8M+ Followers',
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
  thumbnailUrl?: string;
  galleryPhotos?: string[];
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
    title: '📱 KÊNH TIKTOK ĐỘI NGŨ & HỌC VIÊN',
    description: 'Các dự án tư vấn, đào tạo kỹ năng livestream & vận hành kênh cho KOL/KOC hàng đầu.',
    items: [
      {
        id: 'ngoc-trinh-tk',
        title: 'TikTok @ngoctrinh89 — Ngọc Trinh Official',
        role: '@ngoctrinh89',
        description: 'Tư vấn kịch bản, ánh sáng studio & điều phối livestream chốt đơn kỷ lục trên TikTok Shop.',
        url: 'https://www.tiktok.com/@ngoctrinh89',
        stats: '6.8M+ Followers',
        tags: ['TikTok Shop', 'Fashion', 'Mega Stream'],
                      },
      {
        id: 'be-duy-tk',
        title: 'TikTok @beduyzuize — Bé Duy Zui Zẻ',
        role: '@beduyzuize',
        description: 'Huấn luyện kỹ năng nói trước ống kính, tương tác livestream nâng cao năng lượng khán giả.',
        url: 'https://www.tiktok.com/@beduyzuize',
        stats: '1.2M+ Followers',
        tags: ['Beauty', 'Livestream Sale', 'Host'],
                      },
      {
        id: 'hian-ny-tk',
        title: 'TikTok Hiany Official',
        role: '@hiany.official',
        description: 'Setup hệ thống 3 đèn chuẩn studio & điều khiển soundcard chống hú rè cho kênh.',
        url: 'https://www.tiktok.com/@ngoctrinh89',
        stats: '850K+ Followers',
        tags: ['Audio Setup', 'Lighting', 'Livestream'],
                      },
      {
        id: 'mc-xuan-hien-tk',
        title: 'TikTok @hiennguyen.mc — MC Xuân Hiển',
        role: '@hiennguyen.mc',
        description: 'Kênh chia sẻ kiến thức setup livestream, quản trị sự tự tin & kỹ năng giao tiếp.',
        url: 'https://www.tiktok.com/@hiennguyen.mc',
        stats: '500K+ Followers',
        tags: ['MC Skills', 'Livestream Tips', 'Coaching'],
                      }
    ]
  },
  {
    id: 'livestream-sales',
    title: '⚡ LIVESTREAM BÁN HÀNG BRAND LỚN',
    description: 'Trực tiếp chỉ đạo sản xuất & dẫn dắt livestream bán hàng cho các tập đoàn thương hiệu danh tiếng.',
    items: [
      {
        id: 'oc-thanh-van',
        title: "Let's Weekend Cùng Ốc Thanh Vân — Havaianas",
        role: 'Havaianas Vietnam',
        description: 'Chương trình trải nghiệm thương hiệu dép Havaianas tại showroom chính thức.',
        url: 'https://www.facebook.com/HavaianasVietnamOfficial/videos/683874168897074',
        stats: 'Maison JSC',
        tags: ['Fashion', 'Live Showroom', 'Host'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
        galleryPhotos: [
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      {
        id: 'aojo-maison',
        title: 'Aojo Eyewear Livestream Launching',
        role: 'Aojo Vietnam',
        description: 'Livestream giới thiệu bộ sưu tập kính mắt thời trang cao cấp Aojo Vietnam.',
        url: 'https://www.facebook.com/maisonjsc/videos/333290181084195/',
        stats: 'Maison Retail',
        tags: ['Eyewear', 'Flash Sale', 'Talkshow'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
        galleryPhotos: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      {
        id: 'galaxy-note20',
        title: 'Trải Nghiệm Galaxy Note 20 — HnamMobile Tech',
        role: 'Samsung HnamMobile',
        description: 'Livestream đánh giá siêu phẩm Samsung Galaxy Note 20 & bốc thăm trúng thưởng.',
        url: 'https://www.facebook.com/Hnammobile.vn/videos/305691387213624',
        stats: 'HnamMobile',
        tags: ['Technology', 'Launch Event', 'Live Unbox'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
        galleryPhotos: [
          'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      {
        id: 'bartending-2022',
        title: 'Vòng Chung Kết Vietnam Flair Bartending 2022',
        role: 'Mathieu Teisseire',
        description: 'Dẫn dắt giải đấu pha chế quy mô quốc gia cùng nhãn hàng Mathieu Teisseire.',
        url: 'https://www.facebook.com/mathieuteiseirevietnam/videos/876594076870282/',
        stats: 'National Event',
        tags: ['Bartending', 'Live Stage', 'Championship'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop',
        galleryPhotos: [
          'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop'
        ]
      }
    ]
  },
  {
    id: 'virtual-events',
    title: '🎬 VISUAL EVENTS & SỰ KIỆN DOANH NGHIỆP',
    description: 'Chuyên gia sản xuất các sự kiện trực tuyến, lễ tôn vinh & hội thảo quy mô hàng nghìn người.',
    items: [
      {
        id: 'vuot-len-kd',
        title: 'Vượt Lên — Những Con Đường Kinh Doanh',
        role: 'Tọa Đàm Doanh Nhân',
        description: 'Tọa đàm truyền cảm hứng kinh doanh và quản trị doanh nghiệp giai đoạn mới.',
        url: 'https://www.facebook.com/vuotlennhungconduongkinhdoanh/videos/1098021087607275/',
        stats: 'Talkshow Doanh Nhân',
        tags: ['Virtual Summit', 'Business', 'Inspiration'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
        galleryPhotos: [
          'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      {
        id: 'anphabe-summit',
        title: 'Anphabe Virtual HR Summit',
        role: 'Anphabe Vietnam',
        description: 'Diễn đàn nhân sự lớn nhất Việt Nam với sự tham gia của hàng trăm CEO & HR Directors.',
        url: 'https://www.facebook.com/anphabe/videos/404621008032735/',
        stats: 'Anphabe Official',
        tags: ['HR Summit', 'Virtual Stream', 'Enterprise'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
        galleryPhotos: [
          'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      {
        id: 'iron-woman-2021',
        title: 'Lễ Tôn Vinh Iron Woman Award 2021',
        role: 'Award Ceremony',
        description: 'Lễ trao giải trực tuyến tôn vinh những người phụ nữ bản lĩnh và cống hiến.',
        url: 'https://fb.watch/9gckAWxSGg/',
        stats: 'Award Ceremony',
        tags: ['Award Show', 'Live Production'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
        galleryPhotos: [
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      {
        id: 'hung-thinh-land',
        title: 'Hưng Thịnh Land Virtual Property Launch',
        role: 'Hưng Thịnh Group',
        description: 'Lễ ra mắt trực tuyến dự án bất động sản cao cấp của Tập đoàn Hưng Thịnh.',
        url: 'https://www.facebook.com/HungThinhLand.Official/videos/325884235969235/',
        stats: 'Hưng Thịnh Land',
        tags: ['Real Estate', '3D Stage', 'Property'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
        galleryPhotos: [
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop'
        ]
      }
    ]
  },
  {
    id: 'brand-videos',
    title: '🎥 SẢN XUẤT VIDEO THƯƠNG HIỆU & TVC',
    description: 'Tư vấn góc máy, ánh sáng & kịch bản nội dung truyền thông F&B chuyên nghiệp.',
    items: [
      {
        id: 'be-bistro',
        title: 'Bế Bistro — Fine Dining Video',
        role: 'Bế Bistro',
        description: 'Sản xuất video quảng cáo & truyền thông thương hiệu ẩm thực phong cách hiện đại.',
        stats: 'F&B Media',
        tags: ['Food Video', 'Commercial', 'Lighting'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
        galleryPhotos: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      {
        id: 'du-yen',
        title: 'Du Yên Vegetarian — Tinh Hoa Ẩm Thực Chay',
        role: 'Du Yên Restaurant',
        description: 'Video giới thiệu kiến trúc không gian tĩnh tại & nghệ thuật ẩm thực chay cao cấp.',
        stats: 'Restaurant Media',
        tags: ['Vegetarian', 'Aesthetic Video', 'Cinematic'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
        galleryPhotos: [
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      {
        id: 'laika-cafe',
        title: 'Laika Cafe Ninh Thuận — Destination Review',
        role: 'Laika Franchise',
        description: 'Sản xuất video trải nghiệm không gian cafe độc đáo & truyền thông điểm đến.',
        stats: 'Cafe Franchise',
        tags: ['Cafe Spaces', 'Promo Video', 'Vlog'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop',
        galleryPhotos: [
          'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop'
        ]
      }
    ]
  }
];

