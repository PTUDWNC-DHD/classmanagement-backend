const Teacher = require("./model")

const GetTeacher = async ({ classId, userId }) => {
    const teacher = await Teacher.findOne({ classId, userId })
    return teacher
}

const GetTeachersByClass = async (classId) => {
    const teachers = await Teacher.find({ classId })
    return teachers
}

const GetTeachersByUser = async (userId) => {
    const teachers = await Teacher.find({ userId })
    return teachers
}

const CreateTeacher = async ({ classId, userId }) => {
    try {
        const teacher = await Teacher.create({ classId, userId })
        return teacher
        
    } catch (error) {
        console.log(error);
    }
}

const DeleteTeacher = async ({ classId, userId }) => {
    await Teacher.findOneAndDelete({ classId, userId })
    return true
}

module.exports = {
    GetTeacher,
    GetTeachersByClass,
    GetTeachersByUser,
    CreateTeacher,
    DeleteTeacher,
}
