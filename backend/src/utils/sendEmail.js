import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendAdminInvite = async ({ toEmail, name, generatedEmail, generatedPassword }) => {
  await resend.emails.send({
    from: 'KP Dev Cell <onboarding@resend.dev>',
    to: toEmail,
    subject: '🔐 Admin Access Granted — KP Dev Cell',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin:0; padding:0; background-color:#0D1117; font-family: 'Segoe UI', Arial, sans-serif;">

          <div style="max-width:520px; margin:40px auto; background-color:#161B26; border-radius:16px; overflow:hidden; border:1px solid #232B3A;">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0D1117 0%, #161B26 100%); padding:36px 40px 28px; border-bottom:1px solid #232B3A; text-align:center;">
              <div style="display:inline-block; background:rgba(20,184,166,0.1); border:1px solid rgba(20,184,166,0.3); border-radius:10px; padding:8px 18px; margin-bottom:20px;">
                <span style="color:#14B8A6; font-size:11px; letter-spacing:0.15em; font-family:monospace;">KP DEV CELL</span>
              </div>
              <div style="width:56px; height:56px; background:rgba(20,184,166,0.1); border:2px solid rgba(20,184,166,0.4); border-radius:50%; margin:0 auto 16px; display:flex; align-items:center; justify-content:center;">
                <span style="font-size:24px;">🔐</span>
              </div>
              <h1 style="margin:0; color:#E8EAED; font-size:22px; font-weight:700; letter-spacing:-0.02em;">Admin Access Granted</h1>
              <p style="margin:10px 0 0; color:#7E8590; font-size:13px;">You now have full admin privileges</p>
            </div>

            <!-- Body -->
            <div style="padding:32px 40px;">
              <p style="margin:0 0 20px; color:#B0B8C4; font-size:14px; line-height:1.7;">
                Hey <strong style="color:#E8EAED;">${name}</strong> 👋,
              </p>
              <p style="margin:0 0 28px; color:#7E8590; font-size:14px; line-height:1.7;">
                You've been granted admin access to the <span style="color:#14B8A6;">KP Dev Cell</span> website. Use the credentials below to log in and manage members, events, and announcements.
              </p>

              <!-- Credentials box -->
              <div style="background:#0D1117; border:1px solid #232B3A; border-radius:12px; overflow:hidden; margin-bottom:28px;">
                <div style="padding:12px 18px; border-bottom:1px solid #232B3A; display:flex; align-items:center; gap:8px;">
                  <div style="width:8px; height:8px; border-radius:50%; background:#FF5F57;"></div>
                  <div style="width:8px; height:8px; border-radius:50%; background:#FEBC2E;"></div>
                  <div style="width:8px; height:8px; border-radius:50%; background:#28C840;"></div>
                  <span style="margin-left:8px; color:#4B5563; font-size:11px; font-family:monospace;">credentials.env</span>
                </div>
                <div style="padding:20px 18px; font-family:monospace; font-size:13px; line-height:2.2;">
                  <div>
                    <span style="color:#4B5563;">LOGIN_URL</span>
                    <span style="color:#6B7280;"> = </span>
                    <a href="https://kp-devcell.vercel.app/login" style="color:#14B8A6; text-decoration:none;">kp-devcell.vercel.app/login</a>
                  </div>
                  <div>
                    <span style="color:#4B5563;">EMAIL</span>
                    <span style="color:#6B7280;"> = </span>
                    <span style="color:#E8EAED;">${generatedEmail}</span>
                  </div>
                  <div>
                    <span style="color:#4B5563;">PASSWORD</span>
                    <span style="color:#6B7280;"> = </span>
                    <span style="color:#8B5CF6;">${generatedPassword}</span>
                  </div>
                </div>
              </div>

              <!-- CTA button -->
              <div style="text-align:center; margin-bottom:28px;">
                <a href="https://kp-devcell.vercel.app/login"
                  style="display:inline-block; background:linear-gradient(135deg, #14B8A6, #0d9488); color:#0D1117; text-decoration:none; font-weight:700; font-size:13px; padding:13px 32px; border-radius:8px; letter-spacing:0.04em;">
                  → Login to Dashboard
                </a>
              </div>

              <!-- Warning note -->
              <div style="background:rgba(139,92,246,0.08); border:1px solid rgba(139,92,246,0.2); border-radius:10px; padding:14px 18px; margin-bottom:8px;">
                <p style="margin:0; color:#A78BFA; font-size:12px; line-height:1.6;">
                  ⚠️ &nbsp;Please change your password after your first login. Keep these credentials private and do not share them.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding:20px 40px 28px; border-top:1px solid #232B3A; text-align:center;">
              <p style="margin:0 0 6px; color:#374151; font-size:11px; font-family:monospace; letter-spacing:0.08em;">
                KP DEV CELL — ADMIN SYSTEM
              </p>
              <p style="margin:0; color:#1f2937; font-size:11px;">
                If you did not expect this email, please ignore it.
              </p>
            </div>

          </div>
        </body>
      </html>
    `
  })
}

export default sendAdminInvite