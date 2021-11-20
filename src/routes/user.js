const express = require("express")
const { GetClassesByUser } = require("../components/class/controller")
const {
    CreateUser,
    GetUser,
    UpdateUser,
    DeleteUser,
} = require("../components/user/controller")
const User = require("../components/user/model")
const passport = require("../middleware/passport")

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
        return res.json(user)
    } catch (error) {
        res.json({
            errors: [error.toString()],
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

router.patch(
    "/me",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { user } = req
        const data = req.body
        try {
            const newuser = await UpdateUser(user._id, data)
            return res.json(newuser)
        } catch (error) {
            res.json({
                errors: [error.toString()],
            })
        }
    }
)

router.delete(
    "/me",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { user } = req
        try {
            const result = await DeleteUser(user._id)
            return res.json(result)
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

module.exports = router
