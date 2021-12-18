const express = require("express")
const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({ storage: storage }).single("filecsv")
const {
    CreateClass,
    GetClass,
    UpdateClass,
    IsOwner,
    AddGrade,
} = require("../components/class/controller")
const Class = require("../components/class/model")
const { GetUsersByClass } = require("../components/user/controller")
const passport = require("../middleware/passport")
const readCSV = require("../middleware/read-csv")

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

            const { name, isEnded, invite, gradeStructure } = req.body
            const classroom = await UpdateClass(id, { name, isEnded, invite, gradeStructure })
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
                const { __v, ...other } = student._doc
                return other
            })
            teachers = teachers.map((teacher) => {
                const { __v, ...other } = teacher._doc
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

router.post(
    "/:id/:gradeId/addgrade",
    upload,
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { id, gradeId } = req.params
        const importFile = req.file
        try {
            if (!importFile) {
                throw "Please import file"
            }
            const data = await readCSV(importFile)
            const processes = data.map(async grade => {
                return await AddGrade({ ...grade, classId: id, gradeId })
            });
            await Promise.all(processes)
            return res.send()
        } catch (error) {
            res.json({
                errors: [error.toString()],
            })
        }
    }
)

module.exports = router
