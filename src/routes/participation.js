const express = require('express')
const { CreateParticipation, DeleteParticipation } = require('../components/participation/controller')
const Participation = require('../components/participation/model')

const router = new express.Router()

router.get('/', async (req, res) => {
    try {
        const participations = await Participation.find()
        return res.json(participations)
    } catch (error) {
        res.json({
            errors: [
                error.toString(),
            ]
        })
    }
})

router.post('/', async (req, res) => {
    try {
        const { userId, classId, isStudent, name, code } = req.body
        const participation = await CreateParticipation({ userId, classId, isStudent, name, code })
        return res.json(participation)
    } catch (error) {
        res.json({
            errors: [
                error.toString(),
            ]
        })
    }
})

router.delete('/', async (req, res) => {
    try {
        const { userId, classId } = req.body
        const result = await DeleteParticipation({ userId, classId })
        return res.json(result)
    } catch (error) {
        res.json({
            errors: [
                error.toString(),
            ]
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const participation = await Participation.findById(id)
        return res.json(participation)
    } catch (error) {
        res.json({
            errors: [
                error.toString(),
            ]
        })
    }
})

module.exports = router