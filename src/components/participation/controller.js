const Participation = require("./model")

const GetParticipationsByClass = async (classId) => {
    const participations = await Participation.find({
        classId,
    })
    return participations
}

const GetParticipationsByUser = async (userId, isStudent = undefined) => {
    const data = { userId }
    isStudent != undefined && (data.isStudent = isStudent)

    const participations = await Participation.find(data)
    return participations
}

const CreateParticipation = async ({
    classId,
    userId,
    code,
    name,
    isStudent,
}) => {
    const participation = await Participation.create({
        userId,
        code,
        name,
        classId,
        isStudent,
    })
    return participation
}

const UpdateParticipation = async (id, data) => {
    let updatedData = {}
    Object.keys(data).forEach((p) => {
        Participation.schema.paths[p] && (updatedData[p] = data[p])
    })

    const participation = await Participation.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
    )
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
    UpdateParticipation,
    DeleteParticipation,
}
