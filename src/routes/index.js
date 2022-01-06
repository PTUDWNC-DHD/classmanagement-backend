const userRoute = require('./user')
const classRoute = require('./class')
const participationRoute = require('./participation')
const authRoute = require('./auth')
const inviteRoute = require('./invite')

module.exports = (app) => {
    app.use('/api/auth', authRoute)
    app.use('/api/user', userRoute)
    app.use('/api/class', classRoute)
    app.use('/api/join', participationRoute)
    app.use('/api/invite', inviteRoute)
}