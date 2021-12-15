const mongoose = require("mongoose")
const User = require("../user/model")
const Class = require("../class/model")

const TeacherSchema = new mongoose.Schema({
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
        required: true,
    },
})

const Teacher = mongoose.model("Teachers", TeacherSchema)

TeacherSchema.pre("save", async function (next) {
    const Teacher = await Teacher.findOne({
        userId: this.userId,
        classId: this.classId,
    })
    if (Teacher) {
        throw "User have already registered as teacher in class"
    }
    next()
})
module.exports = Teacher
