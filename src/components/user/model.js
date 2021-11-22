const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        validate: {
            validator: function (value) {
                const re = /^[a-zA-Z0-9]*$/
                return re.test(value)
            },
            message: "Username only contains char and num",
        },
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function (value) {
                const re =
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return re.test(value.toLowerCase())
            },
            message: "Invalid email",
        },
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
})

const User = mongoose.model("users", UserSchema)

module.exports = User
