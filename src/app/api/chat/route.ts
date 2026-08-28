import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase Client phía Server an toàn
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase Environment Variables on Server");
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

// In-memory rate limiter (Simple version for serverless)
// Note: In a real distributed edge environment, use Upstash Redis.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // Max 10 messages
const TIME_WINDOW = 60 * 1000; // per 1 minute


export async function POST(req: NextRequest) {
  try {
    // SECURITY 1: CORS & Origin Check (Strict hostname validation)
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    
    if (origin) {
      try {
        const originUrl = new URL(origin);
        const originHost = originUrl.hostname;
        if (
          originHost !== host && 
          originHost !== 'localhost' && 
          originHost !== 'hientraining.com' &&
          !originHost.endsWith('.hientraining.com') &&
          !originHost.endsWith('.vercel.app')
        ) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      } catch (e) {
        return NextResponse.json({ error: 'Invalid Origin' }, { status: 403 });
      }
    }

    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // SECURITY 2: Prompt Injection / Length limit
    if (message.length > 500) {
      return NextResponse.json({ reply: 'Tin nhắn của bạn quá dài. Vui lòng hỏi ngắn gọn hơn nhé! 😅' }, { status: 400 });
    }

    // Rate Limiting Logic
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const userRate = rateLimitMap.get(ip);
    
    if (userRate) {
      if (now > userRate.resetTime) {
        // Reset window
        rateLimitMap.set(ip, { count: 1, resetTime: now + TIME_WINDOW });
      } else {
        if (userRate.count >= RATE_LIMIT) {
          return NextResponse.json({ reply: 'Bạn đã nhắn tin quá nhanh. Vui lòng đợi 1 phút nữa nhé! 😅' }, { status: 429 });
        }
        userRate.count += 1;
        rateLimitMap.set(ip, userRate);
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + TIME_WINDOW });
    }

    // SECURITY 3: Prevent Memory Leak from Rate Limiter Map
    if (rateLimitMap.size > 500) {
      for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetTime) {
          rateLimitMap.delete(key);
        }
      }
    }

    // Khởi tạo Gemini (Lấy key từ Server Môi trường, bảo mật tuyệt đối)
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key is not configured on the server.' }, { status: 500 });
    }
    
    const ai = new GoogleGenAI({ apiKey });

    // Fetch toàn bộ dữ liệu thật của Web từ Supabase để dạy AI
    const { data: dbData } = await supabase.from('site_config').select('data').eq('id', 1).single();
    const siteData = dbData?.data || {};

    // Chuẩn bị Dữ liệu Ngữ Cảnh (Context)
    const courseInfo = siteData.courses ? siteData.courses.map((c:any) => `- Khóa học: ${c.title} (Giá: ${c.price === 0 ? 'Miễn phí' : c.price.toLocaleString('vi-VN') + ' VND'}). Phù hợp cho: ${c.subtitle}`).join('\n') : '';
    const serviceInfo = siteData.services ? siteData.services.map((s:any) => `- Dịch vụ: ${s.title}`).join('\n') : '';

    const systemInstruction = `
Bạn là "Trợ lý Ảo Xuân Hiến", người đại diện chính thức và độc quyền trên website của MC Nguyễn Hồng Xuân Hiến (Media & Training Studio).
Giọng điệu của bạn: Chuyên nghiệp, ấm áp, nhiệt tình, có tính thuyết phục cao (như một chuyên gia sale thực thụ), nhưng không quá vồn vã. Luôn xưng là "mình" hoặc "Trợ lý Xuân Hiến" và gọi khách hàng là "bạn".

Nhiệm vụ của bạn:
1. Tư vấn và giải đáp thắc mắc về các khóa học, dịch vụ của MC Xuân Hiến.
2. Thuyết phục khách hàng đăng ký học hoặc sử dụng dịch vụ bằng cách nhấn mạnh vào kinh nghiệm 12 năm MC truyền hình, Á quân TV Face, chuyên gia đào tạo 1 kèm 1 thực chiến của anh Hiến.
3. Nếu khách hàng hỏi những thứ KHÔNG LIÊN QUAN đến MC, Kỹ năng giao tiếp, Livestream, Khóa học (như thời tiết, toán học, chính trị, code...), TỪ CHỐI một cách lịch sự và khéo léo bẻ lái câu chuyện về các khóa học của Xuân Hiến. Tinh tế nhưng kiên quyết.

Dưới đây là thông tin thực tế về các Khóa học và Dịch vụ đang có:
DANH SÁCH KHÓA HỌC:
${courseInfo}

DANH SÁCH DỊCH VỤ:
${serviceInfo}

Hãy trả lời ngắn gọn (dưới 100 chữ), đi thẳng vào trọng tâm, có dùng emoji để thân thiện.
`;

    // Gọi Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: message,
      config: {
        systemInstruction,
      }
    });

    const reply = response.text || "Xin lỗi, mình đang gặp chút sự cố kết nối. Bạn vui lòng thử lại sau nhé!";

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
