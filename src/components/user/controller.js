const User = require("./model")
const bcrypt = require("bcrypt")
const { GetParticipationsByClass } = require("../participation/controller")

const GetUser = async (id) => {
    const user = await User.findById(id)
    return user
}

const GetUsersByClass = async (classId) => {
    const participations = await GetParticipationsByClass(classId)
    let users = participations.map(async (p) => {
        const user = await User.findById(p.userId)
        user.isStudent = p.isStudent
        return user
    })

    users = Promise.all(users)
    return users
}

const CreateUser = async ({ username, password, email, code, name }) => {
    let data = {}
    username && (data.username = username)
    email && (data.email = email)
    code && (data.code = code)
    name && (data.name = name)

    if (password) {
        const saltRounds = 10
        const hashPassword = bcrypt.hashSync(password, saltRounds)
        data.password = hashPassword
    }
    
    const user = await User.create(data)
    return user
}

const UpdateUser = async (id, data) => {
    let updatedData = {}
    Object.keys(data).forEach(p => {
        User.schema.paths[p] && (updatedData[p] = data[p])
    })

    const user = await User.findByIdAndUpdate( id, updatedData, { new: true })
    return user
}

const DeleteUser = async (id) => {
    await User.findByIdAndDelete(id)
    return true
}

module.exports = {
    GetUser,
    GetUsersByClass,
    CreateUser,
    UpdateUser,
    DeleteUser,
}
