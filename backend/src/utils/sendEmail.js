import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

const sendAdminInvite = async ({ toEmail, name, generatedEmail, generatedPassword }) => {
  const mailOptions = {
    from: `"KP Dev Cell" <${process.env.GMAIL_USER}>`,
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
  }

  await transporter.sendMail(mailOptions)
}

export default sendAdminInvite