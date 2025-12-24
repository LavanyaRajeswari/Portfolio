import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const emailCache = new Map();

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'All fields required' }, { status: 400 });
    }

    const cacheKey = `contact:${email.toLowerCase()}`;
    const lastSent = emailCache.get(cacheKey);
    
    if (lastSent && (Date.now() - lastSent) < 24 * 60 * 60 * 1000) {
      return NextResponse.json(
        { message: 'Only 1 email per day allowed per address' }, 
        { status: 429 }
      );
    }

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL],
      reply_to: email,
      subject: `New message from ${name}`,
      html: `
        <h2>New Mail From Portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    emailCache.set(cacheKey, Date.now());
    
    return NextResponse.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}
