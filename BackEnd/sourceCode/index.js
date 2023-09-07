const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path')
dotenv.config();
const app = express()
const authRoute = require('./routes/auth')
const uploadPhotosRoute = require('./routes/uploadPhotos')
const placeRoute = require('./routes/place')
const bookingsRoute = require('./routes/bookings')

app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json())
app.use(authRoute)
app.use(uploadPhotosRoute)
app.use(placeRoute)
app.use(bookingsRoute)
app.use('/uploads', express.static(path.normalize(__dirname + '/routes/uploads')))

//Print request to console
app.use((req, res, next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body)
    next()
})

//Handle 404
app.use((req, res, next) => {
    res.status(404).send('You are lost!')
})

const PORT = process.env.PORT || 44302
app.listen(PORT, () => console.info(`Server started on port ${PORT}!`))

