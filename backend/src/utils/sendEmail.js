import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendAdminInvite = async ({ toEmail, name, generatedEmail, generatedPassword }) => {
  await resend.emails.send({
    from: 'KP Dev Cell <onboarding@resend.dev>',
    to: toEmail,
    subject: 'You have been given admin access — KP Dev Cell',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hey ${name} 👋</h2>
        <p>You have been granted admin access to the KP Dev Cell website.</p>
        <p>Here are your login credentials:</p>
        <div style="background: #f4f4f4; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Login URL:</strong> your-website.com/admin</p>
          <p><strong>Email:</strong> ${generatedEmail}</p>
          <p><strong>Password:</strong> ${generatedPassword}</p>
        </div>
        <p>Please change your password after your first login.</p>
        <p>If you did not expect this email, ignore it.</p>
        <br/>
        <p>— KP Dev Cell Team</p>
      </div>
    `
  })
}

export default sendAdminInvite