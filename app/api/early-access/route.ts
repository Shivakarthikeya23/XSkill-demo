import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Check if email already exists
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

    // Insert email into Supabase
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

    // Send thank-you email using Resend
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Welcome <welcome@xskill.com>",
        to: normalizedEmail,
        subject: 'Welcome to XSkill Early Access! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #f97316; font-size: 32px; margin: 0;">XSkill</h1>
                <p style="color: #14b8a6; font-size: 18px; margin: 5px 0;">Exchange Skills, Not Money</p>
              </div>
              
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #f0fdfa 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
                <h2 style="color: #1f2937; margin-top: 0;">Thank You for Joining! 🎉</h2>
                <p style="color: #4b5563; font-size: 16px;">
                  We're thrilled to have you on board! You've successfully signed up for early access to XSkill.
                </p>
                <p style="color: #4b5563; font-size: 16px;">
                  We'll notify you as soon as we launch. Get ready to exchange skills and build your community!
                </p>
              </div>
              
              <div style="background: #ffffff; border: 2px solid #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #1f2937; margin-top: 0;">What's Next?</h3>
                <ul style="color: #4b5563; padding-left: 20px;">
                  <li>We'll send you updates about our launch</li>
                  <li>You'll be among the first to access XSkill</li>
                  <li>Start thinking about what skills you'd like to teach or learn!</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  XSkill - Exchange Skills, Not Money<br>
                  <a href="mailto:hello@xskill.com" style="color: #f97316; text-decoration: none;">hello@xskill.com</a>
                </p>
              </div>
            </body>
          </html>
        `,
      })
    } catch (emailError) {
      console.error('Resend email error:', emailError)
      // Don't fail the request if email fails, just log it
      // The signup was successful in Supabase
    }

    console.log('New Early Access Signup saved:', normalizedEmail)

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully signed up for early access! Check your email for confirmation.',
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

