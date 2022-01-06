const express = require("express")
const passport = require("../middleware/passport")
const jwt = require("jsonwebtoken")
const { CreateCode, CheckCode } = require("../components/code/controller")
const typeCodeEnum = require("../components/code/type-code-enum")
const { SendResetPassCodeMail } = require("../middleware/nodemailer")
const { UpdateUser, GetUserByEmail } = require("../components/user/controller")
const User = require("../components/user/model")

const router = new express.Router()
router.post("/login", function (req, res, next) {
    passport.authenticate(
        "local",
        { session: false },
        function (err, user, info) {
            //console.log(err, user, info);
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.status(401).json({ message: info.message })
            }
            return res.json({
                user,
                token: jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
                    expiresIn: "1h",
                }),
            })
        }
    )(req, res, next)
})
// router.post(
//     "/login",
//     passport.authenticate("local", { session: false }),
//     function (req, res) {
//         return res.json({
//             user: req.user,
//             token: jwt.sign(req.user.toJSON(), process.env.JWT_SECRET, {
//                 expiresIn: "1h",
//             }),
//         })
//     }
// )

router.post("/forgotpassword", async function (req, res) {
    try {
        const { email } = req.body
        const code = await CreateCode(email, typeCodeEnum.RESET_PASSWORD)
        await SendResetPassCodeMail(email, code.code)
        return res.json({
            result: true,
        })
    } catch (error) {
        return res.status(400).json({
            result: false,
            errors: [error.toString()],
        })
    }
})

router.post("/active", async function (req, res) {
    try {
        const { email, code } = req.body
        const isChecked = await CheckCode(
            email,
            typeCodeEnum.ACTIVE_ACCOUNT,
            code
        )
        if (isChecked) {
            const user = await GetUserByEmail(email)
            await UpdateUser(user._id, { isActive: true })
        }
        return res.json({
            result: true,
        })
    } catch (error) {
        return res.status(400).json({
            result: false,
            errors: [error.toString()],
        })
    }
})

router.post("/checkresetpasswordcode", async function (req, res) {
    try {
        const { email, code } = req.body
        const isChecked = await CheckCode(
            email,
            typeCodeEnum.RESET_PASSWORD,
            code
        )
        if (isChecked) {
            const user = await User.findOne({ email })
            const token = jwt.sign(
                {
                    email: email,
                    password: user.password,
                },
                "dhdresetpassword",
                { expiresIn: "1h" }
            )
            return res.json({
                result: true,
                token,
            })
        }
    } catch (error) {
        return res.status(400).json({
            result: false,
            errors: [error.toString()],
        })
    }
})

router.post("/resetpassword", async function (req, res) {
    try {
        const { token, password } = req.body
        if (isChecked) {
            const decoded = jwt.verify(token, "dhdresetpassword")
            const user = await User.findOne({
                email: decoded.email,
                password: decoded.password,
            })
            if (!user) {
                throw "Token wrong"
            }
            await UpdateUser(user._id, { password })
            return res.json({
                result: true,
                token,
            })
        }
    } catch (error) {
        return res.status(400).json({
            result: false,
            errors: [error.toString()],
        })
    }
})

module.exports = router
