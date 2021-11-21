const express = require("express")
const passport = require("../middleware/passport")
const jwt = require("jsonwebtoken")

const router = new express.Router()

router.post(
    "/",
    passport.authenticate("local", { session: false }),
    function (req, res) {
        return res.json({
            user: req.user,
            token: jwt.sign(req.user.toJSON(), process.env.JWT_SECRET, {
                expiresIn: "1h",
            }),
        })
    }
)

module.exports = router
