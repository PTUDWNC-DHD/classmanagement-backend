const userRoute = require('./user')
const classRoute = require('./class')
const participationRoute = require('./participation')

module.exports = (app) => {
    app.use('/api/user', userRoute)
    app.use('/api/class', classRoute)
    app.use('/api/join', participationRoute)
}