const express = require("express")
const { CreateUser, GetUser, UpdateUser, DeleteUser } = require("../components/user/controller")
const User = require("../components/user/model")

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
        res.json(user)
    } catch (error) {
        res.json({
            errors: [error.toString()],
        })
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    try {
        const user = await GetUser(id)
        res.json(user)
    } catch (error) {
        res.json({
            errors: [error.toString()],
        })
    }
})

router.patch("/:id", async (req, res) => {
    const { id } = req.params
    const data = req.body
    try {
        const user = await UpdateUser(id, data)
        res.json(user)
    } catch (error) {
        res.json({
            errors: [error.toString()],
        })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
    try {
        const result = await DeleteUser(id)
        res.json(result)
    } catch (error) {
        res.json({
            errors: [error.toString()],
        })
    }
})
module.exports = router
