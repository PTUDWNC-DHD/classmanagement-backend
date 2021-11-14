const mongoose = require("mongoose")

const ParticipationSchema = new mongoose.Schema({
    classId: {
        type: String,
        required: true,
    },
    code: {
        type: String,
    },
    isStudent: {
        type: Boolean,
        required: true,
    },
    userId: {
        type: String,
    }
})

ParticipationSchema.pre('save', (next) => {
    if (this.code || this.userId) {
        return next()
    }
    throw 'Must contain student code or userId'
})

const Participation = mongoose.model("participations", ParticipationSchema)

module.exports = Participation
