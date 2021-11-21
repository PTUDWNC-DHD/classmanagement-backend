const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt

const { Login } = require("../../components/user/controller")

passport.use(
    new LocalStrategy({ session: false }, async function (
        username,
        password,
        done
    ) {
        try {
            const user = await Login(username, password)
            return done(null, user)
        } catch (error) {
            return done(null, false, { message: error })
        }
    })
)

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
        return done(null, jwt_payload)
    })
)

module.exports = passport
