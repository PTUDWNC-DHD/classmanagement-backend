const { AddGrade } = require("../student/controller")
const Review = require("./model")

const getReview = async (structureId, studentId) => {
    return await Review.findOne({ structureId, studentId })
}

const getReviewsByClass = async (classId) => {
    return await Review.find({ classId })
}

const getReviewsByGradeStructure = async (structureId) => {
    return await Review.find({ structureId })
}

const createReview = async (userId, classId, structureId, studentId, currentGrade, expectedGrade, initialMsg) => {
    const review = await Review.findOne({ studentId, structureId })
    if (review) {
        throw "Request already exist"
    }

    const newReview = await Review.create({
        studentId,
        classId,
        structureId,
        currentGrade,
        expectedGrade,
        messages: [{
            userId,
            message: initialMsg,
        }]
    })
    return newReview
}

const addMessageReview = async (structureId, studentId, userId, message) => {
    const review = await Review.findOne({ structureId, studentId })
    if (!review) {
        throw "Review not exist"
    }
    review.messages.push({ userId, message })
    review.save()
} 

const updateGradeReview = async (structureId, studentId, newGrade) => {
    const review = await Review.findOne({ structureId, studentId })
    if (!review) {
        throw "Review not exist"
    }
    await AddGrade({ studentId, classId: review.classId, gradeId: structureId, score: newGrade })
    return await Review.findOneAndUpdate({ structureId, studentId }, { updatedGrade: newGrade }, { new: true })
}

const deleteReview = async (structureId, studentId) => {
    await Review.findOneAndDelete({ structureId, studentId })
}

module.exports = {
    getReview,
    getReviewsByClass,
    getReviewsByGradeStructure,
    createReview,
    addMessageReview,
    updateGradeReview,
    deleteReview,
}