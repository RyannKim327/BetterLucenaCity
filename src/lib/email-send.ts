import nodemailer from "nodemailer"
// import { Resend } from "resend"

interface props {
  subject: string,
  email: string,
  content: string
  auth?: boolean
}

export default async function sendEmail({
  subject,
  email,
  content,
  // auth
}: props) {
  // if (auth) {
  // TODO: Authentication based emails

  // TODO: Email setup
  const transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NEXT_EMAIL,
      pass: process.env.NEXT_EMAIL_PASSWORD
    }
  })

  // TODO: Email Execution
  const info = await transporter.sendMail({
    from: process.env.NEXT_EMAIL,
    to: email,
    subject: subject,
    text: content
  })
  return info
  // }

  // TODO: Notification based email
  // const resend = new Resend(process.env.NEXT_RESEND_API)
  // return resend.emails.send({
  //   from: "onboarding@resend.dev",
  //   to: email,
  //   text: content,
  //   subject: subject
  // })
}
