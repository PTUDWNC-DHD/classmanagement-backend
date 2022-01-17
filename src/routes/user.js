const express = require("express")
const { GetClassesByUser } = require("../components/class/controller")
const {
    CreateUser,
    GetUser,
    UpdateUser,
} = require("../components/user/controller")
const User = require("../components/user/model")
const passport = require("../middleware/passport")
const { CreateCode } = require("../components/code/controller")
const typeCodeEnum = require("../components/code/type-code-enum")
const { SendActiveCodeMail } = require("../middleware/nodemailer")
const jwt = require("jsonwebtoken")

const router = new express.Router()

router.get("/", async (req, res) => {
    try {
        const users = await User.find()
        return res.json(users)
    } catch (error) {
        res.json({
            errors: [error.toString()],
        })
    }
})

router.post("/", async (req, res) => {
    const { username, password, email, code, name } = req.body
    try {
        const user = await CreateUser({ username, password, email, code, name })
        const activecode = await CreateCode(email, typeCodeEnum.ACTIVE_ACCOUNT)
        await SendActiveCodeMail(email, activecode.code)
        return res.json(user)
    } catch (error) {
        let errors = []
        if (
            error
                .toString()
                .includes(
                    "MongoServerError: E11000 duplicate key error collection"
                )
        ) {
            if (error.toString().includes("username")) {
                errors = [...errors, "username has been use"]
            }
            if (error.toString().includes("email")) {
                errors = [...errors, "email has been use"]
            }
        }
        res.json({
            errors,
        })
    }
})

router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { user } = req
        return res.json(user)
    }
)

router.get(
    "/me/notifications",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const user = await GetUser(req.user._id)
        return res.json(user.notification)
    }
)

router.patch(
    "/me",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { user } = req
        const data = req.body
        try {
            const newuser = await UpdateUser(user._id, data)
            return res.json({
                user: newuser,
                token: jwt.sign(newuser.toJSON(), process.env.JWT_SECRET, {
                    expiresIn: "1h",
                }),
            })
        } catch (error) {
            res.json({
                errors: [error.toString()],
            })
        }
    }
)

router.get(
    "/me/classes",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { user } = req
        try {
            const classes = await GetClassesByUser(user._id)
            return res.json(classes)
        } catch (error) {
            res.json({
                errors: [error.toString()],
            })
        }
    }
)

router.get(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { id } = req.params
        try {
            const user = await GetUser(id)
            return res.json(user)
        } catch (error) {
            res.json({
                errors: [error.toString()],
            })
        }
    }
)

module.exports = router
