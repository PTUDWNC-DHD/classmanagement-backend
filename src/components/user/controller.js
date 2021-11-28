const User = require("./model")
const bcrypt = require("bcrypt")
const firebaseApp = require("../../middleware/firebase")
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

const GetUsersByClass = async (classId, isStudent = true) => {
    const participations = await GetParticipationsByClass(classId, isStudent)
    return participations
}

const CreateUser = async ({ username, password, email, name, contact, studentID, avatar }) => {
    let data = {}
    username && (data.username = username)
    email && (data.email = email)
    name && (data.name = name)
    contact && (data.contact = contact)
    studentID && (data.studentID = studentID)
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
    DeleteUser,
    Login,
}
