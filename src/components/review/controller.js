const { GetClass } = require("../class/controller")
const { AddGrade, GetStudent } = require("../student/controller")
const { GetTeachersByClass } = require("../teacher/controller")
const { AddNotification, GetUserByStudentId, GetUser, AddNotificationByStudentId } = require("../user/controller")
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
            createAt: new Date(),
        }]
    })

    const classroom = await GetClass(classId)
    const teachers = await GetTeachersByClass(classId)
    const student = await GetStudent({classId, studentId})
    const processes = await teachers.map(async teacher => {
        return await AddNotification(teacher.userId, `${student.name} in class ${classroom.name} has requested a grade review`)
    })
    await Promise.all(processes)
    return newReview
}

const addMessageReview = async (structureId, studentId, userId, message) => {
    const review = await Review.findOne({ structureId, studentId })
    if (!review) {
        throw "Review not exist"
    }
    review.messages.push({ userId, message, createAt: new Date() })
    review.save()

    const classroom = await GetClass(review.classId)
    const student = await GetUserByStudentId(studentId)
    if (student._id != userId) {
        const teacher = await GetUser(userId)
        await AddNotification(student._id, `Teacher ${teacher.name} in class ${classroom.name} replies to your `)
    }
} 

const updateGradeReview = async (structureId, studentId, newGrade) => {
    const review = await Review.findOne({ structureId, studentId })
    if (!review) {
        throw "Review not exist"
    }
    await AddGrade({ studentId, classId: review.classId, gradeId: structureId, score: newGrade, specialSituation: true })
    const updatedReview = await Review.findOneAndUpdate({ structureId, studentId }, { updatedGrade: newGrade }, { new: true })

    const classroom = await GetClass(review.classId)
    await AddNotificationByStudentId(studentId, `Your grade in class ${classroom.name} is updated upon your request grade review`)

    return updatedReview
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