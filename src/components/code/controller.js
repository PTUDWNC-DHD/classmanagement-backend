const crypto = require("crypto")
const { GetUserByEmail } = require("../user/controller")
const Code = require("./model")

const GetCode = async (email, code) => {
    const existCode = await Code.findOne({ email, code })
    if (!existCode) {
        throw "Code not exist"
    }
    return existCode
}

const CreateCode = async (email, type) => {
    const user = await GetUserByEmail(email)
    if (!user) {
        throw "This email hasn't been registered yet"
    }
    let code = ""
    for (let i = 0; i < 5; i++) {
        code = code + crypto.randomInt(10).toString()
    }
    const newCode = await Code.create({ code, email, type, expiredAt: new Date(Date.now() + 5 * 60 * 1000) })
    return newCode
}

const CheckCode = async (email, type, code) => {
    let existCodeList = await Code.find({ email, type })
    existCodeList = existCodeList.sort((first, second) => {
        if ((new Date(first.expiredAt).getTime()) >= (new Date(second.expiredAt).getTime())) {
            return -1
        }
        return 0
    })
    const existCode = existCodeList[0]
    if (!existCode) {
        return {
            result: false,
            message: "Please require code"
        }
    }
    if (existCode.code != code) {
        return {
            result: false,
            message: "Code wrong"
        }
    }
    if (existCode.isUsed == true) {
        return {
            result: false,
            message: "This code has been used"
        }
    }
    if ((new Date(existCode.expiredAt)).getTime() < Date.now()) {
        return {
            result: false,
            message: "This code was expired"
        }
    }
    existCode.isUsed = true
    await existCode.save()
    return {
        result: true
    }
}

module.exports = {
    GetCode,
    CreateCode,
    CheckCode, 
}
