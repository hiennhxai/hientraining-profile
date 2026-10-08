import { CourseItem } from '../types';

export const coursesData: CourseItem[] = [
  {
    id: 'setup-livestream',
    code: 'CRS.01',
    title: 'Kỹ Thuật Setup Live Stream',
    subtitle: 'Build thiết bị & Setup Studio Livestream chuyên nghiệp từ A → Z',
    formatOffline: 'Offline 1-1 tại Studio Giảng Viên (Nhấp để xem địa chỉ)',
    formatOnline: 'Online 1:1 qua Google Meet/Zoom (Dành cho học viên bận rộn hoặc phần lý thuyết)',
    feeNotice: 'Liên hệ tư vấn & báo phí qua SĐT: 0813.13.13.85',
    duration: '5 đến 6 buổi (Tùy thực lực học viên)',
    badge: 'Kỹ thuật Studio & OBS/Vmix',
    bgImage: '/images/covers/thumb_course_1.png',
    bannerImage: '/images/covers/course_banner_1.png',
    thumbnailUrl: '/images/covers/thumb_course_1.png',
                            lessons: [
      {
        lessonTitle: 'BÀI 1: Thiết bị & Kết nối cơ bản',
        points: [
          'Setup tiêu chuẩn 1 phòng livestream',
          'Tìm hiểu về các thiết bị livestream cơ bản từ điện thoại cho đến camera chuyên nghiệp',
          'Kết nối thiết bị và kỹ thuật truyền dẫn hình ảnh',
          'Tìm hiểu thông số tiêu chuẩn của máy livestream',
          'Setup buổi livestream cơ bản'
        ]
      },
      {
        lessonTitle: 'BÀI 2: Bố cục, Ánh sáng & Nền tảng Live',
        points: [
          'Setup không gian live từ A đến Z',
          'Setup ánh sáng livestream (hướng sáng, nguồn sáng, góc đèn)',
          'Setup bố cục live stream và bố cục sản phẩm khi lên live',
          'Tìm hiểu về phần mềm live OBS với các nền tảng Facebook, Shopee, TikTok...',
          'Hướng dẫn kết nối cơ bản với nền tảng bán hàng'
        ]
      },
      {
        lessonTitle: 'BÀI 3: OBS Nâng cao, Canva Pro & Multi-Cam',
        points: [
          'Hướng dẫn sử dụng OBS từ A đến Z với các thông số tiêu chuẩn',
          'Học viên tự setup 1 buổi live cơ bản',
          'Hướng dẫn thiết kế nhanh với Canva Pro để livestream thương hiệu',
          'Hướng dẫn setup live stream chuyên nghiệp với bàn trộn và nhiều máy quay'
        ]
      },
      {
        lessonTitle: 'BÀI 4: Bàn Trộn Âm Thanh & Backup Tình Huống',
        points: [
          'Hướng dẫn sử dụng bàn trộn cơ bản và cách kết nối âm thanh đa dạng thiết bị vào bàn trộn hoặc máy tính',
          'Các phương án backup, xử lý tình huống sự cố cơ bản khi setup và trong khi live'
        ]
      },
      {
        lessonTitle: 'BÀI 5: Vmix Chuyên Nghiệp & Thực Hành Tổng Ôn',
        points: [
          'Hướng dẫn sử dụng phần mềm Vmix cơ bản',
          'Học viên thực hành setup và vận hành live trực tiếp trên Vmix'
        ]
      }
    ]
  },
  {
    id: 'ban-hang-livestream',
    code: 'CRS.02',
    title: 'Kỹ Năng Bán Hàng Livestream',
    subtitle: 'Trở thành <span class="bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded shadow-sm">Người Bán Hàng Đa Nền Tảng</span> tự tin trước ống kính',
    formatOffline: 'Offline 1-1 tại Studio Giảng Viên',
    formatOnline: 'Online 1:1 qua Google Meet/Zoom',
    feeNotice: 'Liên hệ tư vấn & báo phí qua SĐT: 0813.13.13.85',
    duration: '5 buổi thực chiến',
    badge: 'Kịch bản & Bán hàng',
    bgImage: '/images/covers/thumb_course_2.png',
    bannerImage: '/images/covers/course_banner_2.png',
    thumbnailUrl: '/images/covers/thumb_course_2.png',
                            lessons: [
      {
        lessonTitle: 'BÀI 1: Tổng Quan & Tâm Lý Bán Hàng Online',
        points: [
          'Tổng quan về livestream & So sánh sự khác biệt giữa các nền tảng (TikTok, FB, Shopee)',
          'Định vị "Bạn là ai?" trong mắt khán giả',
          'Tâm lý bán hàng online & Giải mã rào cản sợ ống kính',
          'Phân tích điểm tự tin & thiếu tự tin của bản thân',
          'Phân tích tâm lý cá nhân giúp bạn tự tin vào bản thân'
        ]
      },
      {
        lessonTitle: 'BÀI 2: Chân Dung Khách Hàng & Xây Dựng Câu Chuyện',
        points: [
          'Phân tích người mua (Chân dung KH) dựa trên sản phẩm của bạn',
          'Kết nối bản thân với KH thông qua các thông tin đã nắm bắt',
          'Câu chuyện về ai đó sử dụng sản phẩm',
          'Trải nghiệm bản thân với sản phẩm',
          'Kiến thức xã hội liên quan đến sản phẩm & Kết nối kỹ năng giải trí của bản thân'
        ]
      },
      {
        lessonTitle: 'BÀI 3 - 4: Xây Dựng Kịch Bản Live Thu Hút',
        points: [
          'Các yếu tố thu hút khách hàng xem livestream ngay 3 giây đầu',
          'Kịch bản livestream chuẩn cho mọi phiên live',
          'Phân tích cấu trúc phiên live bán hàng thành công',
          'Setup phiên live & Kỹ thuật Demo sản phẩm trực tiếp'
        ]
      },
      {
        lessonTitle: 'BÀI 5: Lên Kịch Bản Live - Thực Hành Trực Tiếp',
        points: [
          'Hướng dẫn lên 2 kịch bản livestream thực tế cho sản phẩm của bạn',
          'Thực hành setup phiên live trên nền tảng cá nhân dưới sự cố vấn 1-1'
        ]
      }
    ]
  },
  {
    id: 'long-tieng-quang-cao',
    code: 'CRS.03',
    title: 'Kỹ Năng - Lồng Tiếng Quảng Cáo / Giọng Nói Hay',
    subtitle: 'Sức mạnh giọng nói — "Kiếm tiền bằng thanh âm"',
    formatOffline: 'Offline 1-1 (Free bán kính 5km / Tại Studio / Quán Cafe)',
    formatOnline: 'Online 1:1',
    feeNotice: 'Liên hệ tư vấn & báo phí qua SĐT: 0813.13.13.85',
    duration: '11 - 12 buổi',
    badge: 'Luyện Giọng & Voice Talent',
    bgImage: '/images/covers/thumb_course_3.png',
    bannerImage: '/images/covers/course_banner_3.png',
    thumbnailUrl: '/images/covers/thumb_course_3.png',
                lessons: [
      {
        lessonTitle: 'Bài 1: Khám Giọng & Định Hướng Phát Triển (1 buổi)',
        points: ['Kiểm tra chất giọng hiện tại', 'Nhận diện điểm mạnh, điểm yếu', 'Định hướng phong cách lồng tiếng phù hợp']
      },
      {
        lessonTitle: 'Bài 2: Tập Luyện Hơi Thở & Giọng Nói (5 buổi)',
        points: [
          'Tập hơi thở bụng sâu và bền',
          'Học khẩu hình miệng chuẩn',
          'Tập luyện phát âm, giọng nói tròn và vang',
          'Kỹ thuật kiểm soát tốc độ nói và ngữ điệu'
        ]
      },
      {
        lessonTitle: 'Bài 3: Các Thể Loại Lồng Tiếng Quảng Cáo (3-4 buổi)',
        points: [
          'Kể chuyện truyền cảm',
          'Các kiểu đọc quảng cáo TVC, viral, chương trình',
          'Kỹ thuật đưa cảm xúc và hồn vào giọng đọc'
        ]
      },
      {
        lessonTitle: 'Bài 4: Phần Mềm & Thiết Bị Thu Âm (1 buổi)',
        points: ['Tìm hiểu và lựa chọn thiết bị thu âm cá nhân', 'Sử dụng phần mềm thu âm và xử lý cơ bản']
      },
      {
        lessonTitle: 'Bài 5: Quy Trình Sản Xuất Audio (1 buổi)',
        points: ['Quy trình biên tập, xử lý tiếng ồn và xuất file audio chất lượng cao']
      }
    ]
  },
  {
    id: 'dan-chuong-trinh-mc',
    code: 'CRS.04',
    title: 'Kỹ Năng - Dẫn Chương Trình (MC)',
    subtitle: '"Quản Trị Sự Tự Tin" trước đám đông & Sân khấu chuyên nghiệp',
    formatOffline: 'Offline 1-1 (Tại Studio / Nhà Học Viên / Cafe Share)',
    formatOnline: 'Online 1:1',
    feeNotice: 'Liên hệ tư vấn & báo phí qua SĐT: 0813.13.13.85',
    duration: '15 - 18 buổi',
    badge: 'Nghề MC & Kỹ Năng Sân Khấu',
    bgImage: '/images/covers/thumb_course_4.png',
    bannerImage: '/images/covers/course_banner_4.png',
    thumbnailUrl: '/images/covers/thumb_course_4.png',
                lessons: [
      {
        lessonTitle: 'Bài 1: Tư Vấn & Định Hướng - Mind Map Cá Nhân (1 buổi)',
        points: ['Xây dựng bản đồ tư duy sự nghiệp MC', 'Phân tích mục tiêu cá nhân']
      },
      {
        lessonTitle: 'Bài 2: Định Hình Phong Cách Cá Nhân (1 buổi)',
        points: ['Tìm kiếm phong cách riêng phù hợp với ngoại hình và tính cách']
      },
      {
        lessonTitle: 'Bài 3: Xây Dựng Hình Ảnh Offline & Online (1 buổi)',
        points: ['Thời trang sân khấu, kiểu tóc, style trang phục và nhân hiệu số']
      },
      {
        lessonTitle: 'Bài 4: Phong Thái & Di Chuyển Sân Khấu (1 buổi)',
        points: ['Tập luyện phong thái đứng, đi lại, ngôn ngữ cơ thể trên sân khấu']
      },
      {
        lessonTitle: 'Bài 5: Tập Luyện Hơi Thở & Giọng Nói MC (4 buổi)',
        points: ['Luyện hơi thở sâu, lực giọng sân khấu, khả năng phát âm chuẩn']
      },
      {
        lessonTitle: 'Bài 6: Các Thể Loại Dẫn Chương Trình (5-6 buổi)',
        points: [
          'Event: Hội nghị, ra mắt sản phẩm...',
          'Talk show chuyên sâu',
          'Teambuilding & Sự kiện ngoài trời',
          'Dẫn tin tức truyền hình',
          'Dẫn chuyện truyền cảm'
        ]
      },
      {
        lessonTitle: 'Bài 7: Kỹ Năng Nghề MC & Xử Lý Tình Huống (2-4 buổi)',
        points: ['Xây dựng kịch bản MC chuyên nghiệp', 'Xử lý sự cố sân khấu linh hoạt', 'Kiến thức về tổ chức sự kiện']
      }
    ]
  },
  {
    id: 'xay-dung-website-bang-ai',
    code: 'CRS.05',
    title: 'Xây Dựng Website Cá Nhân Bằng AI',
    subtitle: 'Tự tay thiết kế website chuyên nghiệp mà không cần viết code!',
    formatOffline: 'Offline 1-1 tại Studio Giảng Viên',
    formatOnline: 'Online 1:1 qua Google Meet/Zoom',
    feeNotice: 'Liên hệ tư vấn & báo phí qua SĐT: 0813.13.13.85',
    duration: 'Linh hoạt theo tốc độ tiếp thu (Dự kiến 16-20 tiếng)',
    badge: 'Ứng dụng AI & No-Code',
    bgImage: '/images/covers/thumb_course_5.png',
    bannerImage: '/images/covers/course_banner_5.png',
    thumbnailUrl: '/images/covers/thumb_course_5.png',
    lessons: [
      {
        lessonTitle: 'Định Vị Chiến Lược & Xây Dựng Cấu Trúc (Sitemap) Bằng AI',
        points: [
          'Hiểu rõ về bản chất Website (Tên miền, Hosting, Hệ quản trị nội dung)',
          'Định vị rõ ràng mục tiêu: Website cá nhân vs Website doanh nghiệp/bán hàng',
          'Sử dụng AI (ChatGPT/Claude) để định hướng cấu trúc website (Sitemap), lên sườn nội dung và hệ thống luồng trải nghiệm người dùng (UX)',
          'Phác thảo toàn bộ tài nguyên cần thiết: Bảng màu, định dạng hình ảnh, văn phong (tone of voice) cho website'
        ]
      },
      {
        lessonTitle: 'Khởi Tạo Giao Diện & Làm Việc Trực Tiếp Với AI',
        points: [
          'Hướng dẫn chọn nền tảng làm web (Kéo-thả hoàn toàn, không cần code) và thiết lập môi trường làm việc',
          'Dùng AI để tạo lập các đoạn nội dung cơ bản (tiêu đề, tagline, giới thiệu)',
          'Sử dụng prompt AI để lên ý tưởng bố cục (layout) và hình ảnh minh họa cho trang chủ'
        ]
      },
      {
        lessonTitle: 'Triển Khai & Tinh Chỉnh Giao Diện Chuyên Sâu',
        points: [
          'Hướng dẫn thao tác kéo - thả, tinh chỉnh giao diện chi tiết từng thành phần (Hero Banner, Khóa học, Dịch vụ)',
          'Cách chỉnh sửa, thay thế nội dung, màu sắc, font chữ để khớp với bộ nhận diện thương hiệu',
          'Đưa các hình ảnh, video thực tế của cá nhân/doanh nghiệp vào thay thế cho các hình ảnh nháp'
        ]
      },
      {
        lessonTitle: 'Tối Ưu Cấu Trúc & Các Trang Phụ trợ',
        points: [
          'Triển khai thiết kế các trang phụ quan trọng: Trang Giới Thiệu (About), Liên Hệ (Contact), Blog/Tin tức',
          'Tối ưu hiển thị để website đẹp mắt trên mọi thiết bị (Đặc biệt là Mobile)',
          'Kết nối các luồng tương tác thực tế: Form đăng ký, nút Zalo, Messenger, liên kết mạng xã hội'
        ]
      },
      {
        lessonTitle: 'Tối Ưu SEO Bằng AI, Quản Trị & "Go Live"',
        points: [
          'Rà soát toàn diện: Kiểm tra lỗi, tối ưu tốc độ tải trang',
          'Dùng AI để tối ưu hóa công cụ tìm kiếm (SEO) cơ bản: tự động viết Meta Title, Meta Description',
          'Đăng ký và kết nối Tên Miền (Domain) chính thức cho website',
          'Hướng dẫn học viên tự quản trị, tự thay đổi nội dung, đăng bài viết mới hoàn toàn chủ động sau khóa học',
          'Nghiệm thu & Đưa website chính thức hoạt động trên Internet'
        ]
      }
    ]
  },
  {
    id: 'xay-dung-thuong-hieu-kinh-doanh',
    code: 'CRS.06',
    title: 'Xây Dựng Thương Hiệu Kinh Doanh Thực Chiến',
    subtitle: 'Định hình Brand Guideline, chuẩn hóa điểm bán Offline (F&B/SME/Retail) & Thiết lập hệ sinh thái số bán hàng O2O',
    formatOffline: 'Offline 1-1 tại Điểm bán học viên / Studio Giảng viên (Khảo sát trực tiếp mặt bằng, biển hiệu & POSM)',
    formatOnline: 'Online 1:1 qua Google Meet/Zoom (Dành cho các buổi tư vấn chiến lược, duyệt file thiết kế & cố vấn từ xa)',
    feeNotice: 'Liên hệ tư vấn & báo phí qua SĐT: 0813.13.13.85',
    duration: '6 - 8 buổi (Cố vấn & Đào tạo thực chiến 1-1)',
    badge: 'Branding & Kinh Doanh Thực Chiến (O2O)',
    bgImage: '/images/covers/thumb_course_6.png',
    bannerImage: '/images/covers/course_banner_6.png',
    thumbnailUrl: '/images/covers/thumb_course_6.png',
    lessons: [
      {
        lessonTitle: 'BÀI 1: Định Vị Mô Hình & Lập Kế Hoạch Kinh Doanh Thực Chiến',
        duration: '1 buổi',
        points: [
          'Khảo sát & phân tích mô hình kinh doanh; xác định chân dung khách hàng mục tiêu quanh khu vực kinh doanh',
          'Lập bảng kế hoạch kinh doanh tinh gọn (Lean Canvas): Dự toán chi phí mặt bằng, vốn đầu tư ban đầu, chi phí vận hành',
          'Chiến lược định giá sản phẩm (Pricing Strategy), tính toán biên lợi nhuận và xác định điểm hòa vốn',
          'Xác lập điểm bán hàng độc nhất (USP) cạnh tranh cho quán F&B, shop bán lẻ và SME',
          'Cố vấn lộ trình triển khai chi tiết từ chuẩn bị, setup điểm bán đến ngày khai trương'
        ]
      },
      {
        lessonTitle: 'BÀI 2: Chuẩn Hóa Bộ Nhận Diện Thương Hiệu & Brand Guidelines',
        duration: '1 buổi',
        points: [
          'Định hình bản sắc thương hiệu: Câu chuyện thương hiệu (Brand Story), thông điệp cốt lõi và slogan ấn tượng',
          'Xây dựng Brand Guideline: Quy chuẩn Logo, khoảng cách an toàn, ứng dụng trên các nền màu khác nhau',
          'Xác lập Bảng màu nhận diện (mã màu CMYK in ấn & RGB màn hình) cùng bộ phông chữ chuẩn (Typography)',
          'Ứng dụng AI & Canva Pro để chủ quán tự lên ý tưởng thiết kế, moodboard nhận diện không phụ thuộc agency',
          'Quy chuẩn hình ảnh sản phẩm/món ăn đồng nhất trên mọi ấn phẩm truyền thông'
        ]
      },
      {
        lessonTitle: 'BÀI 3: Thực Chiến Điểm Bán Offline (Mặt Bằng, Biển Hiệu & Trọn Bộ POSM In Ấn)',
        duration: '1-2 buổi',
        points: [
          'Tối ưu không gian mặt bằng kinh doanh: Quầy thu ngân/order, luồng di chuyển khách và góc check-in (photo-spot)',
          'Tiêu chuẩn thiết kế & thi công hệ thống bảng hiệu: Bảng mặt tiền, hộp đèn led, biển vẫy, vật liệu phù hợp ngân sách',
          'Thiết kế trọn bộ ấn phẩm in ấn (POSM) cho F&B và bán lẻ: Menu cuốn, menu để bàn, standee ưu đãi, voucher, tem nhãn bao bì, ly cốc, túi đựng, thẻ tích điểm, đồng phục nhân viên',
          'Kỹ thuật in ấn & làm việc thông minh với xưởng in: Xuất file chuẩn 300DPI, kiểm tra test màu mẫu tránh rủi ro sai màu lãng phí'
        ]
      },
      {
        lessonTitle: 'BÀI 4: Kế Hoạch Khai Trương, Quảng Cáo Địa Phương & Nghệ Thuật Giữ Chân Khách',
        duration: '1 buổi',
        points: [
          'Lập kế hoạch tuần lễ khai trương (Grand Opening): Kịch bản hoạt náo, giờ vàng ưu đãi và kéo khách trải nghiệm',
          'Chiến lược Marketing bán kính gần (Local Marketing 1 - 3km): Băng rôn, tờ rơi thông minh quét mã QR, sampling dùng thử trực tiếp',
          'Xây dựng quy trình trải nghiệm khách hàng tại chỗ: Phong cách chào đón, kịch bản up-sell/cross-sell làm tăng giá trị đơn hàng',
          'Thiết lập cơ chế tích điểm - tri ân khách quen (Loyalty Program) giữ chân khách quay lại thường xuyên'
        ]
      },
      {
        lessonTitle: 'BÀI 5: Số Hóa Điểm Bán Lên Nền Tảng Số & Kênh Social Media Chuyên Nghiệp',
        duration: '1 buổi',
        points: [
          'Tối ưu toàn diện Google Doanh Nghiệp (Google Maps): Ghim vị trí, tối ưu từ khóa tìm kiếm địa phương, chiến dịch kéo đánh giá 5 sao',
          'Chuẩn hóa hệ thống Social Media: Fanpage Facebook, TikTok Shop, Instagram đồng bộ hình ảnh đại diện và cover banner',
          'Kỹ năng quay chụp hình ảnh món ăn / sản phẩm bằng điện thoại sắc nét, bắt mắt',
          'Thiết lập kênh Zalo Doanh Nghiệp (Zalo OA) chăm sóc khách tự động và gửi thông báo ưu đãi không tốn phí'
        ]
      },
      {
        lessonTitle: 'BÀI 6: Thiết Lập Website / Ứng Dụng Bán Hàng & Tự Động Hóa Vận Hành (Go-Live)',
        duration: '1 buổi',
        points: [
          'Tạo Menu điện tử quét mã QR thông minh tại bàn để khách tự gọi món/đặt hàng nhanh chóng',
          'Thiết lập Landing Page / Website bán hàng không cần code',
          'Tích hợp thanh toán quét mã QR ngân hàng tự động (VietQR), hạn chế thất thoát và đối soát dễ dàng',
          'Kết nối luồng thông báo đơn hàng trực tiếp về Zalo / Telegram / Điện thoại chủ quán theo thời gian thực',
          'Tổng kết & bàn giao toàn bộ file thiết kế, guideline, quy trình vận hành sẵn sàng đưa vào kinh doanh thực tế'
        ]
      }
    ]
  },
  {
    id: 'quy-trinh-san-xuat-video',
    code: 'CRS.07',
    title: 'Đào Tạo Quy Trình Sản Xuất Video Chuyên Nghiệp',
    subtitle: 'Phân tích quy trình sản xuất chuẩn, sơ đồ vị trí nhân sự & chuẩn hóa vận hành từ A → Z cho Cá nhân & Team Media',
    formatOffline: 'Offline 1-1 tại Studio Giảng viên hoặc Trực tiếp tại Bối cảnh/Doanh nghiệp học viên',
    formatOnline: 'Online 1:1 qua Google Meet/Zoom (Kèm phân tích kịch bản & đánh giá file dựng)',
    feeNotice: 'Liên hệ tư vấn & báo phí qua SĐT: 0813.13.13.85',
    duration: '7 - 8 buổi thực chiến (Huấn luyện theo dự án thực tế)',
    badge: 'Quy Trình Sản Xuất & Media Team Roles',
    bgImage: '/images/covers/thumb_course_7.png',
    bannerImage: '/images/covers/course_banner_7.png',
    thumbnailUrl: '/images/covers/thumb_course_7.png',
    lessons: [
      {
        lessonTitle: 'BÀI 1: Tổng Quan Quy Trình Sản Xuất & Bản Đồ Vị Trí Nhân Sự',
        duration: '1 buổi',
        points: [
          'Phân tích chi tiết 4 giai đoạn sống còn của quy trình sản xuất video: Tiền kỳ (Pre-production) → Sản xuất tại hiện trường (Production) → Hậu kỳ (Post-production) → Đóng gói & Phân phối (Distribution & Analytics)',
          'Bản đồ vị trí & Mô tả công việc (JD) chi tiết của từng mắt xích: Producer (Điều phối/ngân sách), Biên kịch (Content/Scriptwriter), Đạo diễn (Director), Quay phim (DoP/Cameraman), Kỹ thuật âm thanh (Soundman), Ánh sáng/Bối cảnh (Gaffer/Art), Dựng phim (Editor/Colorist) và Talent/Diễn viên',
          'Tầm quan trọng và sự liên kết giữa các bộ phận: Vì sao thiếu sót ở một khâu (âm thanh rè, thiếu shot bổ trợ cut-away) sẽ phá hỏng toàn bộ sản phẩm ở khâu hậu kỳ',
          'Chiến lược vận hành linh hoạt: Mô hình "One-Man Band" (1 cá nhân tự làm tất cả – cách kiêm nhiệm thông minh, tối ưu công cụ) vs Mô hình Team Media nhỏ (2 - 5 người phối hợp ăn ý, rõ trách nhiệm)',
          'Bộ tiêu chuẩn đánh giá hoàn thành nhiệm vụ (Checklist nghiệm thu & KPI) cho từng vị trí trước, trong và sau buổi quay'
        ]
      },
      {
        lessonTitle: 'BÀI 2: Tiền Kỳ & Sáng Tạo Ý Tưởng Nội Dung (Idea, Hook & Kịch Bản Chi Tiết)',
        duration: '1 buổi',
        points: [
          'Phương pháp tìm kiếm và phát triển ý tưởng (Idea Mining), nghiên cứu xu hướng và phân tích nhu cầu khán giả mục tiêu',
          'Xây dựng kế hoạch nội dung (Content Plan): Lịch trình phát hành định kỳ, tỷ lệ nội dung giá trị vs nội dung bán hàng/truyền thông',
          'Kỹ thuật viết kịch bản chi tiết: Cấu trúc 3 giây đầu (Hook), thân bài dẫn dắt giữ chân người xem (Retention) và lời kêu gọi hành động (CTA)',
          'Phân cảnh kịch bản (Storyboarding) & Bảng phân công nhiệm vụ cụ thể cho từng vị trí trong buổi quay'
        ]
      },
      {
        lessonTitle: 'BÀI 3: Chuẩn Bị Thiết Bị & Khảo Sát Bối Cảnh Thực Chiến',
        duration: '1 buổi',
        points: [
          'Tiêu chuẩn lựa chọn thiết bị tối ưu theo ngân sách: Điện thoại cao cấp vs Máy quay Mirrorless/Cinema, dải tiêu cự ống kính phù hợp',
          'Hệ thống âm thanh hiện trường: Lựa chọn micro cài áo không dây, micro shotgun, kỹ thuật giấu mic và kiểm soát tạp âm môi trường',
          'Thiết kế ánh sáng trường quay: Thiết lập hệ thống đèn 3 điểm (Key, Fill, Rim Light) và phụ kiện tản sáng chuyên dụng',
          'Khảo sát bối cảnh (Recce): Đánh giá âm học, nguồn điện, góc đặt máy, hậu cảnh tạo chiều sâu trường ảnh và chuẩn bị đạo cụ'
        ]
      },
      {
        lessonTitle: 'BÀI 4: Kế Hoạch Tổ Chức Buổi Quay, Timeline & Quản Trị Deadline',
        duration: '1 buổi',
        points: [
          'Thiết lập Bảng kế hoạch sản xuất (Production Schedule) và Lệnh bấm máy (Call Sheet) chuẩn xác từng khung giờ',
          'Phương pháp quay cuốn chiếu (Batch Shooting): Bí quyết lên lịch để quay 5 - 10 video ngắn hoặc 2 - 3 video dài trong 1 ngày làm việc',
          'Phân bổ Timeline chi tiết: Thời gian setup máy/đèn, diễn tập (rehearsal), bấm máy chính thức và thời gian dự phòng phát sinh',
          'Quản trị deadline dự án truyền thông: Phân chia mốc thời gian rõ ràng giữa Kịch bản → Ghi hình → Dựng thô → Duyệt bài → Xuất bản'
        ]
      },
      {
        lessonTitle: 'BÀI 5: Kỹ Thuật Đạo Diễn Hiện Trường & Chỉ Đạo Ghi Hình',
        duration: '1-2 buổi',
        points: [
          'Kỹ thuật vận hành máy quay: Quy tắc 1/3, các cỡ cảnh (Toàn - Trung - Cận - Đặc tả) và chuyển động máy quay mượt mà (Pan, Tilt, Gimbal)',
          'Kỹ năng đạo diễn & chỉ đạo diễn xuất: Giúp người nói/talent giải tỏa căng thẳng, lấy lại thần thái tự tin, chỉnh sửa khẩu hình và ngắt nghỉ tự nhiên',
          'Kỹ thuật quay nhiều góc máy (Multi-cam setup): Đồng bộ mã thời gian (Timecode / Audio Sync) giữa hình ảnh và âm thanh riêng biệt',
          'Quy trình quản lý file dữ liệu tại hiện trường (DIT): Đặt tên file theo cảnh/take, backup dữ liệu 2 bản an toàn tuyệt đối'
        ]
      },
      {
        lessonTitle: 'BÀI 6: Quy Trình Hậu Kỳ Tiêu Chuẩn Cho Cá Nhân & Media Team',
        duration: '1-2 buổi',
        points: [
          'Quy trình dựng phim tuần tự: Tổ chức cấu trúc thư mục dự án → Dựng thô (Rough cut) → Tinh chỉnh nhịp điệu (Fine cut)',
          'Xử lý âm thanh chuyên nghiệp: Lọc tạp âm hiện trường, cân bằng âm lượng (EQ, Compressor), phối nhạc nền (BGM) và SFX đắt giá',
          'Chỉnh màu (Color Correction & Grading): Khử ám màu, đồng bộ màu da tự nhiên và tạo phong cách màu thương hiệu',
          'Đồ họa chuyển động (Motion Graphics): Chèn Text title, Caption/Phụ đề tự động bắt mắt, icon minh họa giữ chân người xem'
        ]
      },
      {
        lessonTitle: 'BÀI 7: Đóng Gói Sản Phẩm Đa Nền Tảng & Vận Hành Team Media Tự Chủ',
        duration: '1 buổi',
        points: [
          'Quy chuẩn xuất file tối ưu: Tỷ lệ 9:16 (TikTok, Reels, Shorts), 16:9 (YouTube, Web), bitrate và profile màu chuẩn cho từng nền tảng',
          'Đóng gói tài sản truyền thông: Thiết kế ảnh bìa (Thumbnail) kích thích nhấp chuột (CTR), viết tiêu đề và mô tả chuẩn SEO video',
          'Quy trình phối hợp vận hành trong Media Team: Phân quyền, công cụ quản lý dự án (Notion/Trello), quy trình duyệt bài tinh gọn',
          'Nghiệm thu sản phẩm hoàn chỉnh: Học viên tự tay lên kế hoạch và hoàn thành 1 sản phẩm video truyền thông thực tế của chính mình'
        ]
      }
    ]
  },
  {
    id: 'build-studio-chuyen-nghiep-tai-nha',
    code: 'CRS.08',
    title: 'Build Studio Chuyên Nghiệp Tại Nhà',
    subtitle: 'Đào tạo kỹ thuật đo đạc không gian, xử lý âm học, sơ đồ ánh sáng & thẩm định thiết bị để tự build studio hoặc làm nghề setup dịch vụ',
    formatOffline: 'Offline 1-1 tại Studio Giảng viên & Khảo sát trực tiếp tại không gian phòng của học viên',
    formatOnline: 'Online 1:1 qua Google Meet/Zoom (Dành cho phần tư vấn nhu cầu, duyệt layout 2D & phân tích thiết bị)',
    feeNotice: 'Liên hệ tư vấn & báo phí qua SĐT: 0813.13.13.85',
    duration: '6 - 8 buổi (Cố vấn & Đào tạo thực chiến 1-1)',
    badge: 'Kỹ Thuật Không Gian & Studio Builder',
    bgImage: '/images/covers/thumb_course_8.png',
    bannerImage: '/images/covers/course_banner_8.png',
    thumbnailUrl: '/images/covers/thumb_course_8.png',
    lessons: [
      {
        lessonTitle: 'BÀI 1: Khảo Sát Nhu Cầu & Quy Hoạch Không Gian Phòng Tại Nhà',
        duration: '1 buổi',
        points: [
          'Bộ câu hỏi chẩn đoán nhu cầu: Xác định loại hình studio phù hợp (Livestream bán hàng, Podcast trò chuyện, Khóa học online, Talking-head YouTube, Quay sản phẩm)',
          'Phân tích hiện trạng phòng tại nhà: Diện tích (nhỏ <10m², vừa 15-25m², lớn >30m²), chiều cao trần, vị trí cửa sổ, nguồn sáng tự nhiên và tiếng ồn xung quanh',
          'Kỹ thuật đo đạc mặt bằng & Quy hoạch công năng: Phân khu vực ngồi/đứng, vị trí bàn làm việc, khoảng cách tiêu cự máy quay (tối thiểu 1.5m - 2.5m để có độ sâu trường ảnh đẹp)',
          'Vẽ sơ đồ bố trí mặt bằng (Floor Plan 2D) và phác thảo góc máy nhìn tổng thể'
        ]
      },
      {
        lessonTitle: 'BÀI 2: Xử Lý Âm Học Phòng Thu & Chống Ồn Chuyên Nghiệp Tại Gia',
        duration: '1 buổi',
        points: [
          'Bản chất âm thanh phòng kín: Hiện tượng sóng đứng (Standing Waves), tiếng vang dội (Flutter Echo) và rò rỉ tạp âm ngoại vi',
          'Phân biệt rõ Tiêu âm (Acoustic Treatment) vs Cách âm (Soundproofing): Tránh sai lầm dán mút xốp trứng tràn lan tốn kém mà vẫn bị vang ồn',
          'Kỹ thuật thi công tiêu âm đúng điểm vàng: Bố trí tấm tiêu âm vải nỉ, bẫy âm trầm (Bass Trap) ở các góc tường, thảm trải sàn và rèm cản âm cửa sổ',
          'Giải pháp xử lý cách âm phòng ở dân dụng: Xử lý khe cửa sổ, nẹp cao su cửa chính, kính hộp cách âm với chi phí tiết kiệm'
        ]
      },
      {
        lessonTitle: 'BÀI 3: Kỹ Thuật Thẩm Định & Lựa Chọn Thiết Bị Ghi Hình & Máy Tính',
        duration: '1-2 buổi',
        points: [
          'Kiến thức thẩm định thiết bị: Nhận biết thiết bị chuyên nghiệp thực thụ vs thiết bị quảng cáo thổi phồng; đọc hiểu thông số cảm biến Full-frame vs Crop, ngàm lens, cổng HDMI Clean, tản nhiệt chống nóng khi chạy lâu',
          'Lựa chọn máy ảnh & ống kính tối ưu cho không gian phòng: Chọn tiêu cự ống kính (16mm, 24mm, 35mm, 50mm) tương thích với diện tích phòng nhỏ để không bị bí góc',
          'Phụ kiện giá đỡ & cơ khí: Arm kẹp bàn chịu lực, chân máy củ dầu (fluid head), thanh treo trần giúp tiết kiệm diện tích mặt sàn phòng hẹp',
          'Cấu hình máy tính dựng & livestream: Lựa chọn CPU, Card màn hình (GPU), Capture Card 4K, giải pháp tản nhiệt giảm tiếng ồn quạt máy'
        ]
      },
      {
        lessonTitle: 'BÀI 4: Làm Chủ Hệ Thống Ánh Sáng Studio & Nhiệt Độ Màu Điện Ảnh',
        duration: '1 buổi',
        points: [
          'Các thông số cốt lõi của đèn chuyên nghiệp: Chỉ số hoàn màu (CRI > 96, TLCI > 97), độ rọi Lux, công suất Watt và khả năng điều khiển qua App/Bluetooth',
          'Thiết lập sơ đồ ánh sáng 3 điểm & 4 điểm chuẩn điện ảnh: Key Light (Softbox tổ ong tạo ánh sáng mềm), Fill Light (bù sáng vùng tối), Rim Light (tách phông) và Background Light (đèn hắt tường RGB tạo độ sâu)',
          'Kỹ thuật phối nhiệt độ màu (Kelvin): Cân bằng giữa ánh sáng trắng 5600K và ánh sáng vàng ấm 3200K để bối cảnh lên hình có chiều sâu nghệ thuật'
        ]
      },
      {
        lessonTitle: 'BÀI 5: Thiết Kế Bối Cảnh, Decor Thẩm Mỹ & Setup Hệ Thống Micro',
        duration: '1 buổi',
        points: [
          'Nghệ thuật decor góc quay tại nhà: Bố trí kệ sách, tranh treo tường, cây xanh, đèn led viền phong cách hiện đại',
          'Hệ thống âm thanh micro studio: So sánh Dynamic Mic vs Condenser Mic cho phòng tại nhà; cách chỉnh Gain trên Soundcard/Audio Interface để bắt trọn giọng ấm, không vỡ tiếng',
          'Quản lý dây dẫn (Cable Management): Kỹ thuật đi dây ngầm, nẹp dán tường, giấu dây nguồn, dây HDMI, dây micro gọn gàng, tăng độ bền và tính thẩm mỹ cao'
        ]
      },
      {
        lessonTitle: 'BÀI 6: Lập Dự Toán, Quy Trình Thi Công & Đóng Gói Dịch Vụ Build Studio Cho Khách Hàng',
        duration: '1 buổi',
        points: [
          'Lập Bảng kê thiết bị & vật tư (BOM) theo 3 phân khúc ngân sách: Tiết kiệm (15 - 30 triệu), Nâng cao (50 - 100 triệu), Chuyên nghiệp (150 triệu+)',
          'Quy trình thi công lắp đặt thực tế: Thứ tự lắp đèn trần → Bố trí bối cảnh → Đi dây điện → Đặt máy quay → Cân chỉnh màu sắc & âm thanh',
          'Lập biên bản kiểm tra & bàn giao kỹ thuật (Checklist bàn giao studio 1 nút bấm)',
          'Tư duy làm nghề chuyên gia: Cách tư vấn báo giá dịch vụ build studio cho cá nhân & doanh nghiệp, chính sách bảo hành và hỗ trợ kỹ thuật sau bàn giao',
          'Tổng kết & Thực hành tốt nghiệp: Học viên tự tay lên phương án thiết kế trọn gói 1 phòng studio hoàn chỉnh từ bản vẽ đến danh mục thiết bị thực tế'
        ]
      }
    ]
  }
];



