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
})

const Class = mongoose.model("classes", ClassSchema)

module.exports = Class
