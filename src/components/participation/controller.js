const Participation = require("./model")

const GetParticipationsByClass = async (classId, isStudent) => {
    const participations = await Participation.find({
        classId,
        isStudent,
    })
    return participations
}

const GetParticipationsByUser = async (userId, isStudent = undefined) => {
    const data = { userId }
    isStudent != undefined && (data.isStudent = isStudent)

    const participations = await Participation.find(data)
    return participations
}

const CreateParticipation = async ({ classId, userId, isStudent }) => {
    const participation = await Participation.create({
        classId,
        userId,
        isStudent,
    })
    return participation
}

const DeleteParticipation = async ({ classId, userId, code }) => {
    if (userId) {
        await Participation.findOneAndDelete({ classId, userId })
        return true
    }
    await Participation.findOneAndDelete({ classId, code })
    return true
}

module.exports = {
    GetParticipationsByClass,
    GetParticipationsByUser,
    CreateParticipation,
    DeleteParticipation,
}
