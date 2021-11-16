const req = require("express/lib/request")
const mongoose = require("mongoose")
const User = require('../user/model')
const Class = require('../class/model')

const ParticipationSchema = new mongoose.Schema({
    classId: {
        type: String,
        validate: {
            validator: async function (value) {
                const classroom = await Class.findById(value)
                if (!classroom) {
                    throw new Error
                }
            },
            message: 'ClassId not exist'
        },
        required: true,
    },
    isStudent: {
        type: Boolean,
        required: true,
    },
    userId: {
        type: String,
        validate: {
            validator: async function (value) {
                const user = await User.findById(value)
                if (!user) {
                    throw new Error
                }
            },
            message: 'UserId not exist'
        },
        required: true,
    },
})

ParticipationSchema.pre("save", async function(next) {
    console.log(true);
    const participation = await Participation.findOne({ userId: this.userId, classId: this.classId })
    if (participation) {
        throw 'User have already been in class'
    }
    if (this.isStudent) {
        const user = await User.findById(this.userId)
        if (!user.code) {
            throw 'User is an invalid student'
        }
    }
    next()
})

const Participation = mongoose.model("participations", ParticipationSchema)

module.exports = Participation
