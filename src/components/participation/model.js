const req = require("express/lib/request")
const mongoose = require("mongoose")
const User = require("../user/model")
const Class = require("../class/model")

const ParticipationSchema = new mongoose.Schema({
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
                    throw new Error()
                }
            },
            message: "UserId not exist",
        },
    },
    code: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
})

ParticipationSchema.pre("save", async function (next) {
    if (this.userId && this.classId) {
        const participation = await Participation.findOne({
            userId: this.userId,
            classId: this.classId,
        })
        if (participation) {
            throw "User have already been in class"
        }
    }
    if (this.code && this.classId) {
        const participation = await Participation.findOne({
            code: this.code,
            classId: this.classId,
        })
        if (participation) {
            throw "Student code have already been used by other user"
        }
    }
    if (this.isStudent && !this.code) {
        throw "Student must have student code"
    }
    if (!this.userId && !this.code) {
        throw "Paticipation must have userId or student code"
    }
    next()
})

ParticipationSchema.pre('findByIdAndUpdate', async function (next) {
    if (this.code && this.classId) {
        const participation = await Participation.findOne({
            code: this.code,
            classId: this.classId,
        })
        if (participation.userId) {
            throw "Student code have already been used by other user"
        }
        next()
    }
})

const Participation = mongoose.model("participations", ParticipationSchema)

module.exports = Participation
