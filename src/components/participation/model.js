const req = require("express/lib/request")
const mongoose = require("mongoose")
const User = require('../user/model')

const ParticipationSchema = new mongoose.Schema({
    classId: {
        type: String,
        required: true,
    },
    isStudent: {
        type: Boolean,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
})

ParticipationSchema.pre("save", async (next) => {
    const user = await User.findById(this.userId)
    if (!user) {
        throw 'User not exist'
    }
    next()
})

const Participation = mongoose.model("participations", ParticipationSchema)

module.exports = Participation
