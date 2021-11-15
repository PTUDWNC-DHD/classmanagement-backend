const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
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
    },
    code: {
        type: String,
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

    if (this.code) {
        const user = await User.findOne({ code: this.code })
        if (user) {
            throw 'Student code has been used'
        }
    }

    if (this.email) {
        const user = await User.findOne({ email: this.email })
        if (user) {
            throw 'Email has been used'
        }
    }

    if (this.username) {
        const user = await User.findOne({ username: this.username })
        if (user) {
            throw 'Username has been used'
        }
    }

    next()
})

UserSchema.pre('findOneAndUpdate', async function(next) {
    const updateData = this._update
    if (updateData.code) {
        const user = await User.findOne({ code: updateData.code })
        if (user) {
            throw 'Student code has been used'
        }
    }

    if (updateData.email) {
        const user = await User.findOne({ email: updateData.email })
        if (user) {
            throw 'Email has been used'
        }
    }

    if (updateData.username) {
        const user = await User.findOne({ username: updateData.username })
        if (user) {
            throw 'Username has been used'
        }
    }
    next()
})

const User = mongoose.model("users", UserSchema)

module.exports = User
