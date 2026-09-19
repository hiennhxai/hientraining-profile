import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6L0gVATSHZP-3ocYhbp2Pavki4P_HoSaAz7RZFn4yYL9vIJejFk51mI4yG3gMK1R1/exec';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, service, note, recaptchaToken, bookingDate, bookingTime, meetingType, meetingLocation } = body;

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

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
        return NextResponse.json(
          { error: 'Spam detected. reCAPTCHA verification failed.' },
          { status: 400 }
        );
      }
    }

    // Send emails using Nodemailer if SMTP configured
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (smtpEmail && smtpPassword) {
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
    }

    // 3. Send notification to Telegram Command Center
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
      const telegramMessage = `🚨 <b>CÓ KHÁCH ĐĂNG KÝ MỚI!</b>\n\n` +
        `👤 <b>Khách hàng:</b> ${name || 'N/A'}\n` +
        `📱 <b>SĐT / Zalo:</b> ${phone || 'N/A'}\n` +
        `✉️ <b>Email:</b> ${email || 'N/A'}\n` +
        `📚 <b>Dịch vụ quan tâm:</b> ${service || 'N/A'}\n` +
        `📝 <b>Ghi chú:</b> ${note || 'N/A'}` +
        (bookingDate ? `\n\n📅 <b>Lịch hẹn:</b> ${bookingDate} lúc ${bookingTime}\n📍 <b>Hình thức:</b> ${meetingType} ${meetingType === 'Offline' ? '(' + meetingLocation + ')' : ''}` : '');

    // Create Google Calendar event if date is selected
    let eventId = '';
    if (bookingDate && bookingTime && process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      try {
        const auth = new JWT({
          email: process.env.GOOGLE_CLIENT_EMAIL,
          key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          scopes: ['https://www.googleapis.com/auth/calendar'],
        });
        const calendar = google.calendar({ version: 'v3', auth });
        
        // Parse the provided local date and time into an ISO string (assuming Vietnam time UTC+7)
        const startDateTime = new Date(`${bookingDate}T${bookingTime}:00+07:00`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Default 1 hour
        
        const eventBody: any = {
          summary: `[CHỜ XÁC NHẬN] Tư vấn - ${name}`,
          description: `Khách hàng: ${name}\nSĐT: ${phone}\nEmail: ${email || 'N/A'}\nDịch vụ: ${service}\nGhi chú: ${note}\nHình thức: ${meetingType}`,
          start: { dateTime: startDateTime.toISOString() },
          end: { dateTime: endDateTime.toISOString() },
          attendees: email ? [{ email }] : [],
          location: meetingType === 'Offline' ? (meetingLocation || 'Tại Studio') : undefined,
        };

        if (meetingType === 'Online') {
          eventBody.conferenceData = {
            createRequest: { 
              requestId: `${Date.now()}_${phone.replace(/\\D/g, '')}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' } 
            }
          };
        }

        const res = await calendar.events.insert({
          calendarId: 'xuanhien.info@gmail.com', // Must share calendar with the service account
          requestBody: eventBody,
          conferenceDataVersion: 1
        });
        
        eventId = res.data.id || '';
      } catch (err) {
        console.error('Google Calendar Error:', err);
      }
    }

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
                { text: '✅ Xác nhận tư vấn', callback_data: eventId ? `approve_${eventId}` : `approve_${phone}` },
                { text: '❌ Bỏ qua', callback_data: eventId ? `reject_${eventId}` : `reject_${phone}` }
              ]
            ]
          }
        }),
      });
    }

    // Prepare data for Google Apps Script
    const formData = new URLSearchParams();
    if (name) formData.append('name', name);
    if (phone) formData.append('phone', phone);
    if (email) formData.append('email', email);
    if (service) formData.append('service', service);
    if (note) formData.append('note', note);

    // Forward to Google Apps Script
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
