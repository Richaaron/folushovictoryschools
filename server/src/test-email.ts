import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, '../.env') })

async function testConnection() {
  console.log('--- SMTP Connection Test ---')
  console.log(`Host: ${process.env.SMTP_HOST}`)
  console.log(`Port: ${process.env.SMTP_PORT}`)
  console.log(`User: ${process.env.SMTP_USER}`)
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    // Verify connection configuration
    await transporter.verify()
    console.log('✅ Success: SMTP connection verified!')
    
    // Optionally send a test email
    if (process.env.SMTP_USER && process.env.SMTP_FROM) {
      console.log('Sending test email...')
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_USER, // Send to self
        subject: 'SMTP Connection Test - Folusho Result System',
        text: 'If you are reading this, your SMTP connection is working perfectly!',
      })
      console.log(`✅ Success: Test email sent to ${process.env.SMTP_USER}`)
    }
  } catch (error) {
    console.error('❌ Error: SMTP connection failed')
    console.error(error)
  }
}

testConnection()
