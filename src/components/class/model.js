const mongoose = require("mongoose")
const User = require("../user/model")

const ClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ownerId: {
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
    invite: {
        type: String,
        required: true,
        unique: true,
    },
    isEnded: {
        type: Boolean,
        required: true,
        default: false,
    }
})

const Class = mongoose.model("classes", ClassSchema)

module.exports = Class
