const express = require("express")
const {
    IsOwner,
    GetClassByInviteCode,
} = require("../components/class/controller")
const { CreateStudent } = require("../components/student/controller")
const { CreateTeacher } = require("../components/teacher/controller")
const {
    GetInvitation,
    ConfirmInvitation,
} = require("../components/invitation/controller")
const passport = require("../middleware/passport")

const router = new express.Router()

router.post(
    "/:invitecode/public",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { user } = req
        const { invitecode } = req.params
        try {
            const classroom = await GetClassByInviteCode(invitecode)
            if (!classroom) {
                throw "Invitecode does not exist"
            }

            const student = await CreateStudent({
                classId: classroom._id,
                studentId: user._id,
                name: user.name,
            })
            return student
        } catch (error) {
            res.json({
                errors: [error.toString()],
            })
        }
    }
)

router.post(
    "/:invitecode/private",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { user } = req
        const { invitecode } = req.params
        try {
            const invitation = await GetInvitation(invitecode)
            if (!invitation) {
                throw "Invitecode does not exist"
            }

            if (invitation.isAccepted != undefined) {
                throw "Invitation has been confirmed"
            }

            if (invitation.isStudent) {
                const student = await CreateStudent({
                    classId: invitation.classId,
                    studentId: user._id,
                    name: user.name,
                })
                ConfirmInvitation(invitecode)
                return res.json(student)
            } else {
                const teacher = await CreateTeacher({
                    classId: invitation.classId,
                    userId: user._id,
                })
                ConfirmInvitation(invitecode)
                return res.json(teacher)
            }
        } catch (error) {
            res.json({
                errors: [error.toString()],
            })
        }
    }
)

router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { user } = req
        try {
            const { userId, classId, code } = req.body
            const isOwner = await IsOwner(user._id, classId)

            if (userId && userId != user._id && !isOwner) {
                throw "Not have right to remove other user from this class"
            }

            if (userId) {
                const result = await DeleteParticipation({
                    userId,
                    classId,
                    code,
                })
                return res.json(result)
            }
            const result = await DeleteParticipation({
                userId: user._id,
                classId,
            })
            return res.json(result)
        } catch (error) {
            res.json({
                errors: [error.toString()],
            })
        }
    }
)

module.exports = router
