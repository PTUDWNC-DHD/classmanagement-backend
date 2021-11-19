const express = require("express")
const { CreateClass, GetClass, UpdateClass } = require("../components/class/controller")
const Class = require("../components/class/model")

const router = new express.Router()

router.get("/", async (req, res) => {
    try {
        const classes = await Class.find()
        res.json(classes)
    } catch (error) {
        res.json({
            errors: [error.toString()],
        })
    }
})

router.post("/", async (req, res) => {
    const { name, ownerId } = req.body
    try {
        const classroom = await CreateClass({ name, ownerId })
        res.json(classroom)
    } catch (error) {
        res.json({
            errors: [error.toString()],
        })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const classroom = await GetClass(id)
        res.json(classroom)
    } catch (error) {
        res.json({
            errors: [error.toString()],
        })
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { name, isEnded } = req.body
        const classroom = await UpdateClass(id, { name, isEnded })
        res.json(classroom)
    } catch (error) {
        res.json({
            errors: [error.toString()],
        })
    }
})

module.exports = router
