import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// In-memory store for rate limiting (reset when server restarts, but sufficient for short-window Vercel serverless functions)
const rateLimitMap = new Map<string, number[]>();

export async function POST(request: Request) {
  try {
    // 1. IP-based Rate Limiting (3 requests per 2 minutes)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown-ip';
    
    if (ip !== 'unknown-ip') {
      const now = Date.now();
      const windowMs = 2 * 60 * 1000; // 2 minutes
      const maxRequests = 3;

      const timestamps = rateLimitMap.get(ip) || [];
      const recentTimestamps = timestamps.filter(ts => now - ts < windowMs);
      
      if (recentTimestamps.length >= maxRequests) {
        return NextResponse.json(
          { error: 'Bạn thao tác quá nhanh. Hệ thống tạm thời chặn gửi Form. Vui lòng thử lại sau 2 phút.' },
          { status: 429 }
        );
      }
      
      recentTimestamps.push(now);
      rateLimitMap.set(ip, recentTimestamps);
    }

    // 2. Parse request body
    const body = await request.json();
    const { name, phone, email, service, note, recaptchaToken, bookingDate, bookingTime, meetingType, meetingLocation, isBookingUpdate } = body;

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    let emailErrorMsg = '';

    // Verify reCAPTCHA if secret key is configured and a token was provided
    if (secretKey && recaptchaToken) {
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
      const verifyResponse = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${recaptchaToken}`,
      });

      const verifyData = await verifyResponse.json();
      
      if (!verifyData.success || verifyData.score < 0.5) {
        console.warn('reCAPTCHA failed or low score:', verifyData);
        emailErrorMsg += '\n\n⚠️ <i>Hệ thống reCAPTCHA cảnh báo: Khách này có thể là Spam (Điểm số thấp hoặc Token không hợp lệ).</i>';
      }
    }

    // Send emails using Nodemailer if SMTP configured
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (smtpEmail && smtpPassword) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: smtpEmail,
            pass: smtpPassword,
          },
        });

        // 1. Send confirmation email to the client
        if (email) {
          await transporter.sendMail({
            from: `"Hiến Training" <${smtpEmail}>`,
            to: email,
            subject: 'Xác nhận Đăng ký Tư vấn / Khóa học - Hiến Training',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #ea580c;">Chào ${name || 'bạn'},</h2>
                <p>Cảm ơn bạn đã quan tâm và đăng ký tư vấn tại <strong>hientraining.com</strong>.</p>
                <p>Hệ thống đã ghi nhận thông tin của bạn như sau:</p>
                <ul>
                  <li><strong>Họ tên:</strong> ${name || 'Không có'}</li>
                  <li><strong>Số điện thoại:</strong> ${phone || 'Không có'}</li>
                  <li><strong>Dịch vụ quan tâm:</strong> ${service || 'Không có'}</li>
                  <li><strong>Ghi chú:</strong> ${note || 'Không có'}</li>
                </ul>
                <p>Đội ngũ Hiến Training sẽ liên hệ với bạn trong thời gian sớm nhất qua số điện thoại bạn đã cung cấp để trao đổi chi tiết.</p>
                <p>Trân trọng,<br/><strong>Hiến Training</strong></p>
              </div>
            `,
          });
        }

        // 2. Send notification email to Admin
        await transporter.sendMail({
          from: `"Hệ Thống Website" <${smtpEmail}>`,
          to: smtpEmail,
          subject: `[Web Lead Mới] Đăng ký: ${service}`,
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <h3>Có khách hàng mới đăng ký qua website</h3>
              <ul>
                <li><strong>Họ tên:</strong> ${name}</li>
                <li><strong>Số điện thoại:</strong> ${phone}</li>
                <li><strong>Email:</strong> ${email || 'Không cung cấp'}</li>
                <li><strong>Dịch vụ quan tâm:</strong> ${service}</li>
                <li><strong>Ghi chú:</strong> ${note}</li>
              </ul>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        emailErrorMsg = '\n\n⚠️ <i>Lỗi: Không thể gửi email cho khách (có thể do sai mật khẩu SMTP).</i>';
      }
    } else {
      emailErrorMsg = '\n\n⚠️ <i>Chưa cấu hình Email SMTP.</i>';
    }

    // 3. Send notification to Telegram Command Center
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
      let telegramMessage = '';
      if (isBookingUpdate) {
        telegramMessage = `🚨 <b>KHÁCH BỔ SUNG LỊCH HẸN!</b>\n\n` +
          `👤 <b>Khách hàng:</b> ${name || 'N/A'}\n` +
          `📱 <b>SĐT / Zalo:</b> ${phone || 'N/A'}\n` +
          `✉️ <b>Email:</b> ${email || 'N/A'}\n` +
          `📅 <b>Lịch hẹn:</b> ${bookingDate} lúc ${bookingTime}\n📍 <b>Hình thức:</b> ${meetingType} ${meetingType === 'Offline' ? '(' + meetingLocation + ')' : ''}`;
      } else {
        telegramMessage = `🚨 <b>CÓ KHÁCH ĐĂNG KÝ MỚI!</b>\n\n` +
          `👤 <b>Khách hàng:</b> ${name || 'N/A'}\n` +
          `📱 <b>SĐT / Zalo:</b> ${phone || 'N/A'}\n` +
          `✉️ <b>Email:</b> ${email || 'N/A'}\n` +
          `📚 <b>Dịch vụ quan tâm:</b> ${service || 'N/A'}\n` +
          `📝 <b>Ghi chú:</b> ${note || 'N/A'}` + emailErrorMsg;
      }

      try {
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        
        await fetch(telegramUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: telegramMessage,
            parse_mode: 'HTML',

            reply_markup: {
              inline_keyboard: [
                [
                  { text: '✅ Xác nhận tư vấn', callback_data: `approve_${phone}` },
                  { text: '❌ Bỏ qua', callback_data: `reject_${phone}` }
                ]
              ]
            }
          }),
        });
      } catch (teleError) {
        console.error('Telegram notification failed:', teleError);
      }
    }



    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
