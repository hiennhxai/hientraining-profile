import { NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6L0gVATSHZP-3ocYhbp2Pavki4P_HoSaAz7RZFn4yYL9vIJejFk51mI4yG3gMK1R1/exec';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, note, recaptchaToken } = body;

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

    // Prepare data for Google Apps Script
    const formData = new URLSearchParams();
    if (name) formData.append('name', name);
    if (phone) formData.append('phone', phone);
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
