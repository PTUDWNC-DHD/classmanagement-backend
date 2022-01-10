const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
    },
    classId: {
        type: String,
        required: true,
    },
    structureId: {
        type: String,
        required: true,
    },
    currentGrade: {
        type: Number,
        required: true,
    },
    expectedGrade: {
        type: Number,
        required: true,
    },
    updatedGrade: {
        type: Number,
    },
    messages: [
        {
            userId: String,
            message: String,
            createAt: mongoose.SchemaTypes.Date,
        },
    ],
})

const Review = mongoose.model("reviews", ReviewSchema)

module.exports = Review
