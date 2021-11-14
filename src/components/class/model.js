const mongoose = require("mongoose")

const ClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    invite: {
        type: String,
        required: true,
        unique: true,
    },
})

const Class = mongoose.model("classes", ClassSchema)

module.exports = Class
