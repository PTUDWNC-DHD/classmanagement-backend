const mongoose = require("mongoose")

const CodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
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
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    expiredAt: {
        type: mongoose.SchemaTypes.Date,
        default: new Date(Date.now() + 5 * 60 * 1000),
    }
})

const Code = mongoose.model("codes", CodeSchema)

module.exports = Code
