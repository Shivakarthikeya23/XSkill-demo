import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // CHECK IF EMAIL ALREADY EXISTS
    const { data: existing } = await supabase
      .from('early_signups')
      .select('email')
      .eq('email', normalizedEmail)
      .single()

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered' },
        { status: 400 }
      )
    }

    // INSERT EMAIL INTO SUPABASE
    const { data, error } = await supabase
      .from('early_signups')
      .insert([
        {
          email: normalizedEmail,
          created_at: new Date().toISOString(),
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save email. Please try again.' },
        { status: 500 }
      )
    }

    // 🔥 SEND EMAIL USING NODEMAILER
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })

      await transporter.sendMail({
        from: `"XSkill" <${process.env.EMAIL_USER}>`,
        to: normalizedEmail,
        subject: "Welcome to XSkill Early Access! 🎉",
        html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial; line-height: 1.6; color: #333;">
              <div style="text-align: center; margin-bottom: 30px;">
                <img 
    src="https://x-skill-demo.vercel.app/logo.png"
    alt="XSkill Logo"
    style="width: 120px; height: auto; margin-bottom: 8px;"
  />
  <p style="color: #14b8a6; font-size: 18px; margin: 5px 0;">Exchange Skills, Not Money</p>
</div>


              <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin-top: 20px;">
                <h2>Thank You for Joining! 🎉</h2>
                <p>You've successfully signed up for early access to XSkill!</p>
                <p>We'll notify you as soon as we launch. Get ready to exchange skills and build your community!</p>
              </div>

              <h3 style="margin-top: 30px;">What's Next?</h3>
              <ul>
                <li>You’ll get launch updates</li>
                <li>You’ll be among the first to join XSkill</li>
                <li>Start thinking about what skills you want to teach or learn!</li>
              </ul>

              <p style="text-align:center; margin-top:30px; color:#6b7280;">
                XSkill Team<br/>
                <a href="mailto:hello@xskill.com" style="color:#f97316;">hello@xskill.com</a>
              </p>
            </body>
          </html>
        `,
      })

      console.log("Email sent to:", normalizedEmail)

    } catch (emailError) {
      console.error("Nodemailer error:", emailError)
      // Don't fail the user — signup is already saved
    }

    console.log("New Early Access Signup saved:", normalizedEmail)

    return NextResponse.json({
      success: true,
      message: 'Successfully signed up! Check your email for confirmation.',
      data
    })
  } catch (error) {
    console.error('Early access signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
