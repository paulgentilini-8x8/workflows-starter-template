import { Resend } from "resend"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Email service is not configured. Please set RESEND_API_KEY." },
        { status: 500 }
      )
    }
    
    const resend = new Resend(apiKey)
    const { name, email, phone, company, contactPref } = await request.json()

    if (!name || !email || !company || !contactPref) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      )
    }

    const toEmail = process.env.CONTACT_EMAIL || "delivered@resend.dev"

    const { data, error } = await resend.emails.send({
      from: "AI Studio <onboarding@resend.dev>",
      to: [toEmail],
      replyTo: email,
      subject: `New AI Studio Consulting Request from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #111827; color: #e8edf5; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0d1b2e 0%, #131f35 100%); padding: 30px; border-bottom: 1px solid #2a3a52;">
            <h1 style="color: #00c6ff; margin: 0 0 8px 0; font-size: 22px; font-weight: 600;">
              New Consulting Request
            </h1>
            <p style="color: #8a9ab8; margin: 0; font-size: 14px;">AI Studio Professional Services</p>
          </div>
          <div style="padding: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #2a3a52; color: #8a9ab8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; width: 140px;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #2a3a52; color: #e8edf5; font-size: 15px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #2a3a52; color: #8a9ab8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #2a3a52; color: #e8edf5; font-size: 15px;"><a href="mailto:${email}" style="color: #00c6ff; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #2a3a52; color: #8a9ab8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #2a3a52; color: #e8edf5; font-size: 15px;">${phone || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #2a3a52; color: #8a9ab8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Company</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #2a3a52; color: #e8edf5; font-size: 15px;">${company}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #8a9ab8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Contact Preference</td>
                <td style="padding: 12px 0; color: #e8edf5; font-size: 15px;">${contactPref}</td>
              </tr>
            </table>
          </div>
        </div>
      `,
    })

    if (error) {
      let errorMessage = "Failed to send email. Please try again later."
      if (error.message?.includes("verify a domain") || error.message?.includes("can only send")) {
        errorMessage = "Email sending restricted. On Resend free tier, you can only send to your verified email. Please verify a domain at resend.com/domains."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
