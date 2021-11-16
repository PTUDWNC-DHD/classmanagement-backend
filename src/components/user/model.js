const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        validate: {
            validator: function (value) {
                const re =
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return re.test(value.toLowerCase())
            },
            message: "Invalid email",
        },
        unique: true,
        sparse: true,
    },
    code: {
        type: String,
        unique: true,
        sparse: true,
    },
    name: {
        type: String,
        required: true,
    }
})

UserSchema.pre('save', async function(next) {
    if (!this.code && !this.email) {
        throw 'User must have code or email'
    }
    if (this.email && !(this.username && this.password)) {
        throw 'User must have both username and password'
    }

    next()
})

const User = mongoose.model("users", UserSchema)

module.exports = User
