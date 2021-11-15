const crypto = require("crypto")
const { GetParticipationsByUser } = require("../participation/controller")
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
    const invite = crypto.randomBytes(20).toString()
    const classroom = await Class.create({ name, ownerId, invite })
    return classroom
}

module.exports = {
    GetClass,
    GetClassesByUser,
    CreateClass,
}