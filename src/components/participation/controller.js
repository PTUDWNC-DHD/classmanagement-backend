const Participation = require("./model")

const GetParticipationsByClass = (classId) => {
    const participations = await Participation.find({
        classId,
        isStudent: true,
    })
    return participations
}

const GetParticipationsByUser = (userId, isStudent = undefined) => {
    const data =
        { userId }(isStudent != undefined) && (data.isStudent = isStudent)

    const participations = await Participation.find(data)
    return participations
}

const CreateParticipation = async ({ classId, userId, isStudent }) => {
    let data = {}
    classId && (data.classId = classId)
    userId &&
        (data.userId = userId)(isStudent != undefined) &&
        (data.isStudent = isStudent)

    const participation = await Participation.create(data)
    return participation
}

const DeleteParticipation = async ({ classId, userId }) => {
    await Participation.findOneAndDelete({ classId, userId })
    return false
}
module.exports = {
    GetParticipationsByClass,
    GetParticipationsByUser,
    CreateParticipation,
    DeleteParticipation,
}
