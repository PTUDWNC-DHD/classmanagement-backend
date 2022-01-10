const express = require("express")
const passport = require("../middleware/passport")
const {
    getReview,
    createReview,
    addMessageReview,
    updateGradeReview,
    deleteReview,
    getReviewsByGradeStructure,
    getReviewsByClass,
} = require("../components/review/controller")
const { GetTeacher } = require("../components/teacher/controller")

const router = new express.Router()

router.get(
    "/:classId/:structureId/:studentId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const user = req.user
        const { classId, structureId, studentId } = req.params
        try {
            if (user.studentId != studentId) {
                const teacher = await GetTeacher({classId, userId: user._id})
                if (!teacher) {
                    throw "Not in role"
                }
            }
    
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
        const { classId, structureId } = req.params
        try {
            console.log(true);
            const teacher = await GetTeacher({classId, userId: user._id})
            console.log(true);
            if (!teacher) {
                throw "Not in role"
            }
            console.log(true);
            const review = await getReviewsByGradeStructure(structureId)
            console.log(true);
            if (!review) {
                throw "Review not exist"
            }
            console.log(true);
            return res.json(review)
        } catch (error) {
            console.log(error);

            return res.status(400).json({ error })
        }
    }
)

router.get(
    "/:classId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const user = req.user
        const { classId } = req.params
        try {
            const teacher = await GetTeacher({classId, userId: user._id})
            if (!teacher) {
                throw "Not in role"
            }
    
            const review = await getReviewsByClass(classId)
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
        const { currentGrade, expectedGrade, message } = req.body
        try {
            if (user.studentId != studentId) {
                const teacher = await GetTeacher({classId, userId: user._id})
                if (!teacher) {
                    throw "Not in role"
                }
            }
    
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
        const { message } = req.body
        console.log(user.studentId, studentId, message);
        try {
            if (user.studentId != studentId) {
                const teacher = await GetTeacher({classId, userId: user._id})
                if (!teacher) {
                    throw "Not in role"
                }
            }
    
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
        const { grade } = req.body
        try {
            const teacher = await GetTeacher({classId, userId: user._id})
            if (!teacher) {
                throw "Not in role"
            }
    
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
        try {
        if (user.studentId != studentId) {
            const teacher = await GetTeacher({classId, userId: user._id})
            if (!teacher) {
                throw "Not in role"
            }
        }

            await deleteReview(structureId, studentId)
            return res.send(true)
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
)

module.exports = router
