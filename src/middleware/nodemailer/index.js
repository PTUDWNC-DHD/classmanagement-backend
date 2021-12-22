"use strict"
const nodemailer = require("nodemailer")
const { GetClass } = require("../../components/class/controller")
const { CreateInvitation } = require("../../components/invitation/controller")

// async..await is not allowed in global scope, must use a wrapper
async function SendInviteMail(fromUser, toEmail, classId, isPublic, isStudent) {
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.SENDMAIL_USERNAME, // generated ethereal user
            pass: process.env.SENDMAIL_PASSWORD, // generated ethereal password
        },
    })

    // Create link invite
    let link = `${process.env.CLIENT_ADDRESS}classrooms/invitation/`
    if (isPublic) {
        const classroom = await GetClass(classId)
        const publicLink = link + `${classroom.invite}/public`

        // send mail with defined transport object
        await transporter.sendMail({
            from: '"DHD Class Management APP 👻" <dhd.classmanagerment@gmail.com>', // sender address
            to: toEmail.join(' '), // list of receivers
            subject: "An invitation to new class", // Subject line
            text: `Hello, ${fromUser.name}<${fromUser.email}> has invited you to join his class
        Please go to link below to accept join class:
        ${publicLink}`, // plain text body
            html: `Hello, <strong>${fromUser.name}</strong><${fromUser.email}> has invited you to join his class<br>
        Please go to link below to accept join class:<br>
        <link>${publicLink}</link>`, // html body
        })
    } else {
        const process = toEmail.map(async (email) => {
            const invitation = await CreateInvitation({
                classId,
                email,
                isStudent,
            })
            const privateLink = link + `${invitation.code}/private`

            // send mail with defined transport object
            await transporter.sendMail({
                from: '"DHD Class Management APP 👻" <dhd.classmanagerment@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "An invitation to new class", // Subject line
                text: `Hello, ${fromUser.name}<${fromUser.email}> has invited you to join his class
            Please go to link below to accept join class:
            ${privateLink}`, // plain text body
                html: `Hello, <strong>${fromUser.name}</strong><${fromUser.email}> has invited you to join his class<br>
            Please go to link below to accept join class:<br>
            <link>${privateLink}</link>`, // html body
            })
        })

        await Promise.all(process)
    }
}

module.exports = SendInviteMail
