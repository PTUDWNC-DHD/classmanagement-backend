"use strict"
const nodemailer = require("nodemailer")

// async..await is not allowed in global scope, must use a wrapper
async function SendInviteMail(fromUser, toEmail, link) {
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.SENDMAIL_USERNAME, // generated ethereal user
            pass: process.env.SENDMAIL_PASSWORD, // generated ethereal password
        },
    })

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"DHD Class Management APP 👻" <dhd.classmanagerment@gmail.com>', // sender address
        to: toEmail.join(), // list of receivers
        subject: "An invitation to new class", // Subject line
        text: `Hello, ${fromUser.name}<${fromUser.email}> has invited you to join his class
        Please go to link below to accept join class:
        ${link}`, // plain text body
        html: `Hello, <strong>${fromUser.name}</strong><${fromUser.email}> has invited you to join his class<br>
        Please go to link below to accept join class:<br>
        <link>${link}</link>`, // html body
    })
}

module.exports = SendInviteMail
