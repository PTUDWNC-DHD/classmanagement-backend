const Student = require("./model")

const GetStudent = async ({ classId, studentId }) => {
    const student = await Student.findOne({ classId, studentId })
    return student
}

const GetStudentsByClass = async (classId) => {
    const students = await Student.find({ classId })
    return students
}

const GetStudentsByStudentId = async (studentId) => {
    const students = await Student.find({ studentId })
    return students
}

const CreateStudent = async ({ classId, studentId, name }) => {
    const Student = await Student.create({ classId, studentId, name })
    return Student
}

const DeleteStudent = async ({ classId, studentId }) => {
    await Student.findOneAndDelete({ classId, studentId })
    return true
}

module.exports = {
    GetStudent,
    GetStudentsByClass,
    GetStudentsByStudentId,
    CreateStudent,
    DeleteStudent,
}
