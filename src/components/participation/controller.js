const Participation = require("./model")

const GetParticipationsByClass = async (classId) => {
    const participations = await Participation.find({
        classId,
        isStudent: true,
    })
    return participations
}

const GetParticipationsByUser = async (userId, isStudent = undefined) => {
    const data =
        { userId }(isStudent != undefined) && (data.isStudent = isStudent)

    const participations = await Participation.find(data)
    return participations
}

const CreateParticipation = async ({ classId, userId, isStudent }) => {
    const participation = await Participation.create({
        userId,
        classId,
        isStudent,
    })
    return participation
}

const DeleteParticipation = async ({ classId, userId }) => {
    await Participation.findOneAndDelete({ classId, userId })
    return true
}

module.exports = {
    GetParticipationsByClass,
    GetParticipationsByUser,
    CreateParticipation,
    DeleteParticipation,
}
