const crypto = require("crypto")
const { GetUser } = require("../user/controller")
const { GetStudentsByStudentId } = require("../student/controller")
const { GetTeachersByUser, CreateTeacher } = require("../teacher/controller")
const Class = require("./model")

const GetClass = async (id) => {
    const classroom = await Class.findById(id)
    return classroom
}

const GetClassByInviteCode = async (code) => {
    const classroom = await Class.findOne({ invite: code })
    return classroom
}

const GetClassesByUser = async (userId) => {
    const user = await GetUser(userId)

    const students = await GetStudentsByStudentId(user.studentId)
    const teachers = await GetTeachersByUser(userId)
    
    classes1 = students?.map(async (p) => {
        const classroom = await GetClass(p.classId)
        return classroom
    })

    classes2 = teachers?.map(async (p) => {
        const classroom = await GetClass(p.classId)
        return classroom
    })
    classes1 = await Promise.all(classes1)
    classes2 = await Promise.all(classes2)
    return [...classes1, ...classes2]
}

const CreateClass = async ({ name, ownerId }) => {
    const invite = crypto.randomUUID()
    const classroom = await Class.create({ name, ownerId, invite })
    await CreateTeacher({
        classId: classroom._id,
        userId: ownerId,
    })
    return classroom
}

const UpdateClass = async (id, data) => {
    const classroom = await Class.findById(id)
    if (classroom.isEnded) {
        if (data.isEnded == false) {
            classroom.isEnded = false
            classroom.save()
            return classroom
        }
        throw "Class is ended, cannot update data"
    }
    const properties = Object.keys(classroom._doc)
    const [ _id, __v, ownerId, ...updateProperties ] = properties
    updateProperties.forEach(p => {
        if (p != 'ownerId' && data[p] != undefined) {
            if (p == 'invite') {
                classroom[p] = crypto.randomUUID()
            }
            else {
                classroom[p] = data[p]
            }
        }
    })
    classroom.save()
    return classroom
}

const IsOwner = async (userId, classId) => {
    const classroom = await GetClass(classId)
    return userId == classroom.ownerId
}

module.exports = {
    GetClass,
    GetClassByInviteCode,
    GetClassesByUser,
    CreateClass,
    UpdateClass,
    IsOwner,
}
