const express = require("express")
const { GetClassesByUser } = require("../components/class/controller")
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
        return res.json(user)
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
        if (!user) {
            throw 'User not exist'
        }
        return res.json(user)
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
        return res.json(user)
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
        return res.json(result)
    } catch (error) {
        res.json({
            errors: [error.toString()],
        })
    }
})

router.get('/:id/classes', async (req, res) => {
    const { id } = req.params
    try {
        const classes = await GetClassesByUser(id)
        return res.json(classes)
    } catch (error) {
        res.json({
            errors: [error.toString()],
        })
    }
})
module.exports = router
