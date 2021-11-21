const User = require("./model")
const bcrypt = require("bcrypt")
const {
    GetParticipationsByClass,
    GetParticipationsByUser,
    UpdateParticipation,
} = require("../participation/controller")

const FilterUser = (user) => {
    delete user?.password
    return user
}

const GetUser = async (id) => {
    const user = await User.findById(id)
    return FilterUser(user)
}

const GetUsersByClass = async (classId) => {
    const participations = await GetParticipationsByClass(classId)
    let users = participations.map(async (p) => {
        const user = await User.findById(p.userId)
        user.isStudent = p.isStudent
        return FilterUser(user)
    })

    users = Promise.all(users)
    return users
}

const CreateUser = async ({ username, password, email, name }) => {
    let data = {}
    username && (data.username = username)
    email && (data.email = email)
    name && (data.name = name)

    if (password) {
        const saltRounds = 10
        const hashPassword = bcrypt.hashSync(password, saltRounds)
        data.password = hashPassword
    }

    const user = await User.create(data)
    return FilterUser(user)
}

const UpdateUser = async (id, data) => {
    let updatedData = {}
    Object.keys(data).forEach((p) => {
        User.schema.paths[p] && (updatedData[p] = data[p])
    })

    if (updatedData.password) {
        const saltRounds = 10
        const hashPassword = bcrypt.hashSync(updatedData.password, saltRounds)
        updatedData.password = hashPassword
    }

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true })
    return FilterUser(user)
}

const DeleteUser = async (id) => {
    const user = await User.findById(id)
    console.log(user)
    const participations = await GetParticipationsByUser(user._id)
    console.log(participations)
    const deleteProcess = participations.map(async (p) => {
        await UpdateParticipation(p._id, { userId: null })
    })
    await Promise.all(deleteProcess)
    await User.findByIdAndDelete(id)
    return true
}

const Login = async (username, password) => {
    if (!username.includes('@')) {
        const user = await User.findOne({ username })
        if (!user) {
            throw "User not exist"
        }
        const comparePass = bcrypt.compareSync(password, user.password)
        if (!comparePass) {
            throw "Wrong password"
        }
        return user
    }
    if (username.includes('@')) {
        const verify = bcrypt.compareSync(process.env.LOGIN_BY_MAIL_SECRET, password)
        if (!verify) {
            throw 'Verify error'
        }
        const user = await User.findOne({ email: username })
        if (!user) {
            throw "User not exist"
        }
        return user
    }
}

module.exports = {
    GetUser,
    GetUsersByClass,
    CreateUser,
    UpdateUser,
    DeleteUser,
    Login,
}
