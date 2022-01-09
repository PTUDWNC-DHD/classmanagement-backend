const express = require("express")
const passport = require("passport")
const {
    getReview,
    createReview,
    addMessageReview,
    updateGradeReview,
    deleteReview,
} = require("../components/review/controller")
const { GetTeacher } = require("../components/teacher/controller")

const router = new express.Router()

router.get(
    "/:classId/:structureId/:studentId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const user = req.user
        const { classId, structureId, studentId } = req.params
        if (user.studentId != studentId) {
            const teacher = await GetTeacher(classId, user._id)
            if (!teacher) {
                throw "Not in role"
            }
        }

        try {
            const review = await getReview(structureId, studentId)
            if (!review) {
                throw "Review not exist"
            }
            return res.json(review)
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
)

router.get(
    "/:classId/:structureId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const user = req.user
        const { classId, structureId, studentId } = req.params
        const teacher = await GetTeacher(classId, user._id)
        if (!teacher) {
            throw "Not in role"
        }

        try {
            const review = await getReview(structureId, studentId)
            if (!review) {
                throw "Review not exist"
            }
            return res.json(review)
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
)

router.get(
    "/:classId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const user = req.user
        const { classId, structureId, studentId } = req.params
        const teacher = await GetTeacher(classId, user._id)
        if (!teacher) {
            throw "Not in role"
        }

        try {
            const review = await getReview(structureId, studentId)
            if (!review) {
                throw "Review not exist"
            }
            return res.json(review)
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
)

router.post(
    "/:classId/:structureId/:studentId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const user = req.user
        const { classId, structureId, studentId } = req.params
        if (user.studentId != studentId) {
            const teacher = await GetTeacher(classId, user._id)
            if (!teacher) {
                throw "Not in role"
            }
        }

        const { currentGrade, expectedGrade, message } = req.body
        try {
            const review = await createReview(
                user._id,
                classId,
                structureId,
                studentId,
                currentGrade,
                expectedGrade,
                message
            )
            return res.json(review)
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
)

router.patch(
    "/:classId/:structureId/:studentId/sendmessage",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const user = req.user
        const { classId, structureId, studentId } = req.params
        if (user.studentId != studentId) {
            const teacher = await GetTeacher(classId, user._id)
            if (!teacher) {
                throw "Not in role"
            }
        }

        const { message } = req.body
        try {
            await addMessageReview(structureId, studentId, user._id, message)
            return res.send(true)
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
)

router.patch(
    "/:classId/:structureId/:studentId/updategrade",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const user = req.user
        const { classId, structureId, studentId } = req.params
        const teacher = await GetTeacher(classId, user._id)
        if (!teacher) {
            throw "Not in role"
        }

        const { grade } = req.body
        try {
            await updateGradeReview(structureId, studentId, grade)
            return res.send(true)
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
)

router.delete(
    "/:classId/:structureId/:studentId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const user = req.user
        const { classId, structureId, studentId } = req.params
        if (user.studentId != studentId) {
            const teacher = await GetTeacher(classId, user._id)
            if (!teacher) {
                throw "Not in role"
            }
        }

        try {
            await deleteReview(structureId, studentId)
            return res.send(true)
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
)

module.exports = router
