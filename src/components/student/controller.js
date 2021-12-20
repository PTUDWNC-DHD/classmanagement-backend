const Class = require("../class/model")
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
    const existStudent = await Student.findOne({ classId, studentId })
    if (existStudent) {
        throw `${studentId} have already been in class`
    }
    const student = await Student.create({ classId, studentId, name })
    return student
}

const DeleteStudent = async ({ classId, studentId }) => {
    await Student.findOneAndDelete({ classId, studentId })
    return true
}

const AddGrade = async ({ studentId, classId, gradeId, score }) => {
    const student = await GetStudent({studentId, classId})
    if (!student) {
        throw "Student not exist"
    }
    const classroom = await Class.findById(classId)
    if (!classroom) {
        throw "Class not found"
    }
    if (classroom.gradeStructure && classroom.gradeStructure.length != 0) {
        classroom.gradeStructure.forEach(grade => {
            if (grade._id == gradeId && grade.isFinalized == true) {
                throw "This grade has been finalized"
            }
        })
    }
    let flag = false
    if (student.grade && student.grade.length != 0) {
        student.grade.some(g => {
            if (g.structureId == gradeId) {
                g.score = score
                flag = true
                return true
            }
        })
    }
    if (!flag) student.grade.push({ structureId: gradeId, score })
    student.save()
}

module.exports = {
    GetStudent,
    GetStudentsByClass,
    GetStudentsByStudentId,
    CreateStudent,
    DeleteStudent,
    AddGrade,
}
