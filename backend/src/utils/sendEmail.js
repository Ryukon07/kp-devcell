import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  logger: true,
  debug: true
})

// This runs when backend starts
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP verify failed:', error.message)
    console.error('❌ Full error:', JSON.stringify(error, null, 2))
  } else {
    console.log('✅ SMTP ready to send emails')
  }
})

const sendAdminInvite = async ({ toEmail, name, generatedEmail, generatedPassword }) => {
  console.log('📧 Attempting to send email to:', toEmail)
  console.log('📧 GMAIL_USER is:', process.env.GMAIL_USER)
  console.log('📧 GMAIL_PASS is set:', !!process.env.GMAIL_PASS)

  const result = await transporter.sendMail({
    from: `"KP Dev Cell" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: '🔐 Admin Access Granted — KP Dev Cell',
    html: `<p>Test email — credentials will go here</p>`
  })

  console.log('✅ Email sent:', result.messageId)
}

export default sendAdminInvite