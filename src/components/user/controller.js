const User = require("./model")
const bcrypt = require("bcrypt")
const { GetParticipationsByClass } = require("../participation/controller")

const CreateUser = async ({ username, password, email, code }) => {
    let data = {}
    username && (data.username = username)
    email && (data.email = email)
    code && (data.code = code)

    if (password) {
        const saltRounds = 10
        const hashPassword = bcrypt.hashSync(password, saltRounds)
        data.password = hashPassword
    }

    const user = await User.create(data)
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

module.exports = {
    CreateUser,
    GetUsersByClass,
}
