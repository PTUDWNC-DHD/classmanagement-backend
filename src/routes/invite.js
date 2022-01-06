const express = require("express")
const { GetClassByInviteCode, IsOwner } = require("../components/class/controller")
const { SendInviteMail } = require("../middleware/nodemailer")
const passport = require("../middleware/passport")

const router = new express.Router()

router.post(
    "/invite",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { user } = req
        const { to, classId, isPublic, isStudent } = req.body
        if (IsOwner(user._id, classId )) {
            await SendInviteMail(
                user,
                to,
                classId,
                isPublic,
                isStudent
            )
            return res.send(true)
        }
        return res.json({
            errors: ["Not have right to invite users to this class"],
        })
    }
)

module.exports = router
