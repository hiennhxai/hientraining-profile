import { Language } from '../types';

export const translations: Record<Language, Record<string, string>> = {
  vi: {
    nav_home: "Trang chủ",
    nav_about: "Về tôi",
    nav_courses: "Khóa học",
    nav_services: "Dịch vụ",
    nav_projects: "Dự án & Showcase",
    nav_blog: "Kiến thức",
    nav_contact: "Đăng ký tư vấn",
    nav_cta: "Tư vấn 0813.13.13.85",
    
    hero_sys: "SYS.ONLINE — ĐÀO TẠO KỸ NĂNG CÁ NHÂN & LIVESTREAM STUDIO",
    hero_h1a: "ĐÀO TẠO KỸ NĂNG CÁ NHÂN",
    hero_h1b: "TUYỆT VỜI CHO BẠN",
    hero_sub: "Tôi là <strong>Nguyễn Hồng Xuân Hiến</strong> — Chuyên gia Đào Tạo Kỹ Năng Cá Nhân, Mentor đồng hành & Producer Livestream chuyên nghiệp với <strong>10+ năm kinh nghiệm MC truyền hình</strong> và <strong>8+ năm tư vấn setup studio livestream</strong>.",
    hero_btn1: "Đăng ký khóa học",
    hero_btn2: "Xem chi tiết dịch vụ",
    
    s1: "Năm MC Truyền Hình",
    s2: "Năm Setup Livestream",
    s3: "Đài TV Đã Từng Dẫn",
    s4: "Khóa Học Thực Chiến",
    s5: "Học Viên & Đơn Vị Đồng Hành",

    a_tag: "VỀ TÔI",
    a_title: "Về Tôi — Nguyễn Hồng Xuân Hiến",
    a_p1: "Xin chào bạn! Tôi là <strong>Nguyễn Hồng Xuân Hiến</strong>, một người luôn mong muốn <strong>chia sẻ và truyền cảm hứng</strong>. Với 10+ năm kinh nghiệm trong ngành truyền hình & sản xuất truyền thông, tôi đồng hành trực tiếp giúp từng học viên làm chủ kỹ năng cá nhân, thần thái lên hình và tự tin tỏa sáng.",
    a_p2: "Là một người có xu hướng <strong>hướng nội</strong>, tôi luôn yêu thích việc lắng nghe và quan sát. Sự quan sát kỹ lưỡng này giúp tôi nhận ra nhiều khía cạnh thú vị trong cuộc sống, từ những điều giản dị nhất đến những thách thức lớn lao. Đó chính là lý do tôi có thể <strong>thấu hiểu nhu cầu của cá nhân và doanh nghiệp</strong>, từ đó đưa ra những giải pháp phù hợp và hiệu quả.",
    a_p3: "Tôi còn là một người <strong>yêu thích đọc sách tâm lý</strong>. Những trang sách đó giúp tôi có khả năng thấu hiểu và cảm thông sâu sắc. Tôi đã đồng hành cùng nhiều cá nhân và doanh nghiệp trong các dự án quan trọng, chứng kiến những sự thay đổi tích cực từ nỗ lực không ngừng.",
    
    p1h: "Thấu hiểu & Cảm thông sâu sắc",
    p1p: "Tôi đọc nhiều sách tâm lý, luôn đặt mình vào vị trí học viên để giúp bạn vượt qua nỗi sợ hãi, băn khoăn và định hình phong cách cá nhân.",
    p2h: "Đào tạo Thực chiến",
    p2p: "Không giảng lý thuyết suông. Cầm tay chỉ việc từ kỹ thuật ánh sáng, thiết bị, tiếng nói, kịch bản cho đến thần thái lên hình.",
    p3h: "Kinh nghiệm thực chiến 10+ năm",
    p3p: "Á quân TV Face 2017, MC Chuyện Trưa 12 Giờ, dẫn trực tiếp trên 14 đài truyền hình & sản xuất livestream cho các brand hàng đầu.",

    a_achievements_title: "THÀNH TỰU & KINH NGHIỆM THỰC CHIẾN",
    a_m1_desc: "MC Trực tiếp \"Giai điệu Phương Nam\" (14 đài truyền hình Miền Nam)",
    a_m2_desc: "Top 12 Người dẫn chương trình Truyền hình toàn quốc",
    a_m3_desc: "Á quân TV Face — Gương Mặt Truyền Hình",
    a_m4_desc: "MC chính \"Chuyện trưa 12 giờ\" & TVO Báo Tuổi Trẻ",
    a_m5_desc: "8+ Năm Producer Setup Studio & Sản xuất Livestream Brand",
    a_mentor_quote: "✦ Định hướng Mentor: Đồng hành cho Sinh viên, Chủ doanh nghiệp & Đơn vị truyền hình/media bứt phá tiềm năng.",

    cs_title: "CÁC KHÓA HỌC ĐÀO TẠO CHUYÊN SÂU",
    cs_sub: "Đào tạo cá nhân hóa theo định hướng và mục tiêu riêng của từng học viên",

    sv_title: "DỊCH VỤ & GIẢI PHÁP NỔI BẬT",
    sv_sub: "Đồng hành từ A → Z cho cá nhân và doanh nghiệp trên nền tảng số",
    sv1h: "Tư Vấn & Setup Studio Livestream",
    sv1p: "Tư vấn cấu hình máy tính, góc máy camera 4K, sơ đồ 3 đèn studio và hệ thống âm thanh chống nhiễu.",
    sv2h: "Vận Hành & Điều Phối Live Multi-Cam",
    sv2p: "Chuyển cảnh mượt mà với OBS/VMix, tích hợp khung graphics thương hiệu, overlay sản phẩm và khiển âm thanh.",
    sv3h: "Sản Xuất Livestream Bán Hàng Brand",
    sv3p: "Tối ưu phiên live bán hàng TikTok Shop, Shopee Live với kịch bản chốt đơn kỷ lục và điều phối phòng live.",
    sv4h: "Đào Tạo Voice Talent & Lồng Tiếng Quảng Cáo",
    sv4p: "Huấn luyện kỹ thuật đọc TVC, viral video, kiểm soát tốc độ, khẩu hình và làm chủ chất giọng tròn vang.",
    sv5h: "Đào Tạo Kỹ Năng MC & Thuyết Trình Sân Khấu",
    sv5p: "Xây dựng sự tự tin, thần thái trước camera, ngôn ngữ cơ thể và kỹ năng làm chủ mọi sự kiện trực tiếp.",

    pd_title: "DỰ ÁN & SẢN PHẨM ĐÃ THỰC HIỆN",
    pd_sub: "Minh chứng thực tế cho năng lực và sự chuyên nghiệp trong sản xuất Livestream & Video",

    bl_title: "GÓC KIẾN THỨC & KINH NGHIỆM THỰC CHIẾN",
    bl_sub2: "Bài viết chia sẻ kiến thức về Livestream, Setup Studio, Giọng nói và Kỹ năng dẫn chương trình.",
    bl_all: "Tất cả bài viết →",

    cat_kienthuc: "Kiến thức",
    cat_livestream: "Livestream",
    cat_mc: "Kỹ năng MC",
    cat_audio: "Giọng nói & Thu âm",
    cat_lighting: "Ánh sáng Studio",
    cat_setup: "Setup Kỹ thuật",

    ct_tag: "Bạn đã sẵn sàng bứt phá?",
    ct_title: "Hãy để tôi đồng hành cùng bạn trên hành trình này",
    ct_sub: "Dù bạn là sinh viên tìm kiếm hướng đi, chủ doanh nghiệp muốn tối ưu livestream bán hàng, hay cá nhân muốn làm chủ giọng nói và phong thái trước đám đông.",
    ct_b1: "Đăng ký tư vấn ngay",

    ft_tag: "Nguyễn Hồng Xuân Hiến — Specialist Skill Trainer & Mentor",
    ft_parent: "Hotline/Zalo: <b>0813.13.13.85</b> · Email: <b>admin@xuanhien.info</b>",

    reader_back: "Quay lại danh sách",
    reader_cta: "Bạn có câu hỏi hoặc cần tư vấn sâu hơn? Liên hệ trực tiếp với Nguyễn Hồng Xuân Hiến.",
    reader_context_label: "BỐI CẢNH BÀI VIẾT"
  },
  en: {
    nav_home: "Home",
    nav_about: "My Story",
    nav_courses: "1-1 Courses",
    nav_services: "Services",
    nav_projects: "Projects & Portfolio",
    nav_blog: "Knowledge",
    nav_contact: "Contact & Register",
    nav_cta: "Call 0813.13.13.85",
    
    hero_sys: "SYS.ONLINE — PERSONAL SKILL TRAINING & LIVESTREAM STUDIO",
    hero_h1a: "EXCELLENT PERSONAL SKILL",
    hero_h1b: "TRAINING FOR YOU",
    hero_sub: "I am <strong>Nguyen Hong Xuan Hien</strong> — Specialist Trainer, Mentor & Professional Livestream Producer with <strong>10+ years of TV hosting experience</strong> and <strong>8+ years of livestream studio setup consultancy</strong>.",
    hero_btn1: "Register 1-1 Course",
    hero_btn2: "Explore Services",
    
    s1: "Years TV Host / MC",
    s2: "Years Livestream Producer",
    s3: "TV Channels Hosted",
    s4: "1-1 Practical Courses",
    s5: "Students & Enterprise Partners",

    a_tag: "MY STORY",
    a_title: "Nguyen Hong Xuan Hien's Journey & Mission",
    a_p1: "Hello! I am <strong>Nguyen Hong Xuan Hien</strong>, driven by a lifelong mission to <strong>share and inspire</strong>. With 10+ years of media and television experience, I dedicate myself to serving as a <strong>skill specialist and 1-on-1 mentor</strong>.",
    a_p2: "As an <strong>introverted observer</strong>, I love listening carefully to understand individual and enterprise needs, tailoring precise solutions that deliver real-world transformation.",
    a_p3: "I am also a passionate reader of <strong>psychology literature</strong>, enabling deep empathy and active listening. I have coached numerous individuals and companies to achieve significant personal and brand milestones.",
    
    p1h: "Deep Empathy & Listening",
    p1p: "I study psychology books and put myself in the student's shoes to help overcome camera anxiety and build authentic confidence.",
    p2h: "Hands-on 1-1 Mentorship",
    p2p: "No abstract theories. Direct hands-on coaching covering lighting, camera gear, voice control, scripts, and stage presence.",
    p3h: "10+ Years Proven Track Record",
    p3p: "TV Face 1st Runner-up 2017, host of 'Chuyen Trua 12 Gio', live host across 14 TV stations & producer for top commercial brands.",

    a_achievements_title: "ACHIEVEMENTS & PRACTICAL EXPERIENCE",
    a_m1_desc: "Live MC for 'Giai Dieu Phuong Nam' (14 Southern TV Channels)",
    a_m2_desc: "Top 12 National TV Presenter Contestant",
    a_m3_desc: "1st Runner-up TV Face — The National TV Presenter",
    a_m4_desc: "Main MC 'Chuyen Trua 12 Gio' & Tuoi Tre TV",
    a_m5_desc: "8+ Years Studio Setup Producer & Brand Livestream Production",
    a_mentor_quote: "✦ Mentoring Focus: 1-on-1 guidance for Students, Business Owners & Media Teams to unlock their full potential.",

    cs_title: "INTENSIVE 1-ON-1 COURSES",
    cs_sub: "Personalized training tailored to your specific goals and schedule",

    sv_title: "FEATURED SERVICES & SOLUTIONS",
    sv_sub: "End-to-end guidance from A to Z for individuals and companies",

    pd_title: "SHOWCASE & PORTFOLIO",
    pd_sub: "Proven execution across Livestream production, Social Media & Brand Videos",

    bl_title: "KNOWLEDGE & PRACTICAL INSIGHTS",
    bl_sub2: "Articles and guides on Livestreaming, Studio Lighting, Audio & Public Speaking.",
    bl_all: "View all articles →",

    cat_kienthuc: "Knowledge",
    cat_livestream: "Livestream",
    cat_mc: "MC Skills",
    cat_audio: "Voice & Audio",
    cat_lighting: "Studio Lighting",
    cat_setup: "Technical Setup",

    ct_tag: "Ready to Transform?",
    ct_title: "Let me guide you on your journey",
    ct_sub: "Whether you are a student, business owner, content creator, or aspiring MC, let's unlock your full potential together.",
    ct_b1: "Book Free Consultation",

    ft_tag: "Nguyen Hong Xuan Hien — Specialist Skill Trainer & Mentor",
    ft_parent: "Hotline/Zalo: <b>0813.13.13.85</b> · Email: <b>admin@xuanhien.info</b>",

    reader_back: "Back to list",
    reader_cta: "Have questions or need personal coaching? Reach out to Nguyen Hong Xuan Hien directly.",
    reader_context_label: "CONTEXT"
  }
};
