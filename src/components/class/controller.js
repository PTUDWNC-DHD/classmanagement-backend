const crypto = require("crypto")
const {
    GetParticipationsByUser,
    CreateParticipation,
} = require("../participation/controller")
const Class = require("./model")

const GetClass = async (id) => {
    const classroom = await Class.findById(id)
    return classroom
}

const GetClassesByUser = async (userId, isStudent = undefined) => {
    const participations = await GetParticipationsByUser(userId, isStudent)

    let classes = participations.map(async (p) => {
        const classroom = await Class.findById(p.classId)
        return classroom
    })

    classes = Promise.all(classes)
    return classes
}

const CreateClass = async ({ name, ownerId }) => {
    const invite = crypto.randomUUID()
    const classroom = await Class.create({ name, ownerId, invite })
    await CreateParticipation({
        classId: classroom._id,
        userId: ownerId,
        name: ownerId.name,
        isStudent: false,
    })
    return classroom
}

const UpdateClass = async (id, data) => {
    const classroom = await GetClass(id)
    if (classroom.isEnded) {
        if (data.isEnded == false) {
            classroom.isEnded = false
            classroom.save()
            return classroom
        }
        throw "Class is ended, cannot update data"
    }
    if (data.isEnded) {
        classroom.isEnded = data.isEnded
        classroom.save()
    }
    if (data.name) {
        classroom.name = data.name
        classroom.save()
    }
    return classroom
}

module.exports = {
    GetClass,
    GetClassesByUser,
    CreateClass,
    UpdateClass,
}
