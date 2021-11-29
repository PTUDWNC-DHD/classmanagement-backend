const express = require("express")
const {
    CreateClass,
    GetClass,
    UpdateClass,
    IsOwner,
} = require("../components/class/controller")
const Class = require("../components/class/model")
const { GetUsersByClass } = require("../components/user/controller")
const passport = require("../middleware/passport")

const router = new express.Router()

router.get("/", async (req, res) => {
    try {
        const classes = await Class.find()
        return res.json(classes)
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
        const { name } = req.body
        try {
            const classroom = await CreateClass({ name, ownerId: user._id })
            return res.json(classroom)
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
            const classroom = await GetClass(id)
            if (!classroom) {
                throw "Class not exist"
            }
            return res.json(classroom)
        } catch (error) {
            res.json({
                errors: [error.toString()],
            })
        }
    }
)

router.patch(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { user } = req
        try {
            const { id } = req.params
            const isOwner = await IsOwner(user._id, id)

            if (!isOwner) {
                throw "Not have right to modify this class"
            }

            const { name, isEnded } = req.body
            const classroom = await UpdateClass(id, { name, isEnded })
            return res.json(classroom)
        } catch (error) {
            res.json({
                errors: [error.toString()],
            })
        }
    }
)

router.get(
    "/:id/users",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { id } = req.params
            let students = await GetUsersByClass(id, true)
            let teachers = await GetUsersByClass(id, false)
            students = students.map((student) => {
                const { isStudent, __v, ...other } = student._doc
                return other
            })
            teachers = teachers.map((teacher) => {
                const { isStudent, __v, ...other } = teacher._doc
                return other
            })
            return res.json({
                students,
                teachers,
            })
        } catch (error) {
            res.json({
                errors: [error.toString()],
            })
        }
    }
)

module.exports = router
