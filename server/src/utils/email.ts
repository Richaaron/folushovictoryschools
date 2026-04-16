import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
})

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Folusho Victory Schools" <${process.env.SMTP_FROM || 'noreply@folusho.com'}>`,
      to,
      subject,
      text,
      html: html || text,
    })
    console.log('Message sent: %s', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const sendStudentRegistrationEmail = async (studentEmail: string, studentName: string, registrationNumber: string) => {
  const subject = 'Welcome to Folusho Victory Schools - Student Registration'
  const text = `Hello ${studentName}, your registration was successful. Your registration number is ${registrationNumber}.`
  const html = `
    <h1>Welcome to Folusho Victory Schools</h1>
    <p>Hello <strong>${studentName}</strong>,</p>
    <p>Your registration was successful. Below are your details:</p>
    <ul>
      <li><strong>Registration Number:</strong> ${registrationNumber}</li>
    </ul>
    <p>Best regards,<br/>Folusho Victory Schools Administration</p>
  `
  return sendEmail(studentEmail, subject, text, html)
}

export const sendResultPublishedEmail = async (parentEmail: string, studentName: string, term: string, academicYear: string) => {
  const subject = `Exam Results Published: ${studentName} - ${term} ${academicYear}`
  const text = `Hello, the results for ${studentName} for ${term} ${academicYear} have been published. Please log in to the portal to view them.`
  const html = `
    <h1>Exam Results Published</h1>
    <p>Hello,</p>
    <p>The results for <strong>${studentName}</strong> for <strong>${term} ${academicYear}</strong> have been published.</p>
    <p>Please log in to the parent portal to view the detailed report sheet.</p>
    <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">Login to Portal</a></p>
    <p>Best regards,<br/>Folusho Victory Schools Administration</p>
  `
  return sendEmail(parentEmail, subject, text, html)
}
