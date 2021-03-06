const mongoose = require("mongoose")
const Class = require("../class/model")

const StudentSchema = new mongoose.Schema({
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
    studentId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    grade: [
        {
            structureId: mongoose.SchemaTypes.ObjectId,
            score: Number,
        },
    ],
})

const Student = mongoose.model("Students", StudentSchema)

StudentSchema.pre("save", async function (next) {
    const student = await Student.findOne({
        studentId: this.studentId,
        classId: this.classId,
    })
    if (student) {
        throw "StudentID have already registered in class"
    }
    next()
})

module.exports = Student
