const userRoute = require('./user')
const classRoute = require('./class')
const participationRoute = require('./participation')
const loginRoute = require('./auth')

module.exports = (app) => {
    app.use('/api/login', loginRoute)
    app.use('/api/user', userRoute)
    app.use('/api/class', classRoute)
    app.use('/api/join', participationRoute)
}