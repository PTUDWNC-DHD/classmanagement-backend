const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        sparse: true,
        validate: {
            validator: function (value) {
                const re = /^[a-zA-Z0-9]*$/
                return re.test(value)
            },
            message: "Username only contains char and num",
        },
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        validate: {
            validator: function (value) {
                const re =
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return re.test(value.toLowerCase())
            },
            message: "Invalid email",
        },
    },
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
    },
    studentID: {
        type: String,
        unique: true,
        sparse: true,

    }
})

UserSchema.pre('save', function (next) {
    if (!this.username && !this.email) {
        throw 'User must has username or email'
    }
    else if (this.username && !this.password) {
        throw 'Must has password'
    }
})

const User = mongoose.model("users", UserSchema)

module.exports = User
