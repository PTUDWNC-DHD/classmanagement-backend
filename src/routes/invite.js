const express = require("express")
const { GetClassByInviteCode } = require("../components/class/controller")
const sendmail = require("../middleware/nodemailer")
const passport = require("../middleware/passport")

const router = new express.Router()

router.post(
    "/invite",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { user } = req
        const { to, invitecode } = req.body
        const classroom = await GetClassByInviteCode(invitecode)
        if (classroom.ownerId == user._id) {
            await sendmail(
                user,
                to,
                `${process.env.CLIENT_ADDRESS}classrooms/invitation/${invitecode}`
            )
            return res.send(true)
        }
        return res.json({
            errors: ["Not have right to invite users to this class"],
        })
    }
)

module.exports = router
