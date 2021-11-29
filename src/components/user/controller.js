const User = require("./model")
const bcrypt = require("bcrypt")
const firebaseApp = require("../../middleware/firebase")
const {
    GetParticipationsByClass,
    GetParticipationsByUser,
    UpdateParticipation,
} = require("../participation/controller")
const { Promise } = require("mongoose")

const FilterUser = (user) => {
    delete user?.password
    return user
}

const GetUser = async (id) => {
    const user = await User.findById(id)
    return FilterUser(user)
}

const GetUsersByClass = async (classId, isStudent = true) => {
    const participations = await GetParticipationsByClass(classId, isStudent)
    let users = participations.forEach(async p => {
        return await User.findById(p.userId)
    })
    users = await Promise.all(users)
    users = users.map(user => FilterUser(user))
    return users
}

const CreateUser = async ({ username, password, email, name, contact, studentId, avatar }) => {
    let data = {}
    username && (data.username = username)
    email && (data.email = email)
    name && (data.name = name)
    contact && (data.contact = contact)
    studentId && (data.studentId = studentId)
    avatar && (data.avatar = avatar)

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

const Login = async (username, password) => {
    if (!username.endsWith("@gmail.com")) {
        const user = await User.findOne({ username })
        if (!user) {
            throw "User not exist"
        }
        const comparePass = bcrypt.compareSync(password, user.password)
        if (!comparePass) {
            throw "Wrong password"
        }
        return user
    } else {
        const idToken = password
        const decoded = await firebaseApp.auth().verifyIdToken(idToken)
        const fbUser = await firebaseApp.auth().getUser(decoded.uid)
        if (fbUser) {
            let user = await User.findOne({ email: fbUser.email })
            if (user) {
                return user
            }
            const data = {}
            data.email = fbUser.email
            data.name = fbUser.displayName
            fbUser.phoneNumber ? (data.contact = fbUser.phoneNumber) : null
            fbUser.photoURL ? (data.avatar = fbUser.photoURL) : null
            user = await CreateUser(data)
            return user
        }
        throw "Verify failed"
    }
}

module.exports = {
    GetUser,
    GetUsersByClass,
    CreateUser,
    UpdateUser,
    Login,
}
