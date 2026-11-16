import sendEmail from "./../lib/email-send.ts"

(async () => {
  // TEST: Mailer
  const i = await sendEmail({
    subject: "Test Email to send",
    email: "test subject",
    content: "This is from the test mailer of Better Lucena City",
    auth: true
  })
  console.log(i)
})()
