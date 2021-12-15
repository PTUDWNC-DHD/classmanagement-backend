const mongoose = require("mongoose")

const InvitationSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    classId: {
        type: String,
        validate: {
            validator: async function (value) {
                const classroom = await Class.findById(value)
                if (!classroom) {
                    throw new Error()
                }
            },
            message: "ClassId not exist",
        },
        required: true,
    },
    email: {
        type: String,
        validate: {
            validator: function (value) {
                const re =
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return re.test(value.toLowerCase())
            },
            message: "Invalid email",
        },
        required: true,
    },
    isStudent: {
        type: Boolean,
        required: true,
        default: true,
    },
    isAccepted: {
        type: Boolean,
        require: false,
    }
})

const Invitation = mongoose.model("invitations", InvitationSchema)

module.exports = Invitation
