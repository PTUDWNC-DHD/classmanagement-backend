const express = require("express")
const { IsOwner } = require("../components/class/controller")
const {
    CreateParticipation,
    DeleteParticipation,
} = require("../components/participation/controller")
const Participation = require("../components/participation/model")
const passport = require("../middleware/passport")

const router = new express.Router()

router.get("/", async (req, res) => {
    try {
        const participations = await Participation.find()
        return res.json(participations)
    } catch (error) {
        res.json({
            errors: [error.toString()],
        })
    }
})

router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { user } = req
        try {
            const { userId, name, classId, isStudent, code } = req.body
            const isOwner = await IsOwner(user._id, classId)
            
            if (userId && userId != user._id && !isOwner) {
                throw "Not have right to add other user to this class"
            }

            let participation
            if (userId) {
                participation = await CreateParticipation({
                    userId,
                    classId,
                    isStudent,
                    name,
                    code,
                })
                return res.json(participation)
            }
            if (!isOwner) {
                participation = await CreateParticipation({
                    userId: user._id,
                    classId,
                    isStudent,
                    name: user.name,
                    code,
                })
                return res.json(participation)
            }
            participation = await CreateParticipation({
                classId,
                isStudent,
                name,
                code,
            })
            return res.json(participation)
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

router.get(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { id } = req.params
            const participation = await Participation.findOne(id)
            return res.json(participation)
        } catch (error) {
            res.json({
                errors: [error.toString()],
            })
        }
    }
)

module.exports = router
