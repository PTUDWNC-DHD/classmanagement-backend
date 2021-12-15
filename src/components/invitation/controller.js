const crypto = require("crypto")
const Invitation = require("./model")


const GetInvitation = async (code) => {
    const invitation = await Invitation.findOne({ code })
    return invitation
}

const CreateInvitation = async ({ classId, email, isStudent }) => {
    const code = crypto.randomUUID()
    const invitation = await Invitation.create({ code, classId, email, isStudent })
    return invitation
}

const ConfirmInvitation = async (code) => {
    const invitation = await Invitation.findOne({ code })
    if (invitation.isAccepted) {
        throw "Invitation has been confirmed before"
    }
    invitation.isAccepted = true
    invitation.save()
}

module.exports = {
    GetInvitation,
    CreateInvitation,
    ConfirmInvitation,
}
