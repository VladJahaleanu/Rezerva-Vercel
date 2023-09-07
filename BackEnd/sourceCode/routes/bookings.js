const UserModel = require('../models/user.model')
const PlaceModel = require('../models/place.model')
const express = require('express')
const jwt = require('jsonwebtoken')
const path = require('path')
const BookingModel = require('../models/booking.model')
const nodemailer = require('nodemailer')
const date = require('date-and-time')
const mongoose = require('mongoose')
const router = express.Router()


//Create booking
router.post('/bookings', async (req, res) => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_CONNECT);
    
    const token = req.headers.token;

    const {placeId, checkInDate, checkOutDate, price, noGuests} = req.body;

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, {}, async (err, userData) => {
            if (err) throw err;

            try {
                const userDocument = await UserModel.findById(userData._id);

                const clientName = userDocument.firstName + ' ' + userDocument.lastName;
                const clientEmail = userDocument.email;
                const booking = new BookingModel({
                    placeId, checkInDate, 
                    checkOutDate, price, 
                    clientName, clientEmail,
                    noGuests, userId: userData._id
                });

                //send mail
                const placeDocument = await PlaceModel.findById(placeId);
                const placeName = placeDocument.title;

                const clientObj = {
                    name: clientName,
                    email: clientEmail,
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    placeName: placeName,
                    price: price
                }

                sendMail(clientObj);

                const savedBooking = await booking.save();
                res.json(savedBooking);
            } catch (err) {
                res.status(400).json(err);
            }
            
        })
    }
})

//GET a user's bookings
router.get('/bookings', async (req, res) => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_CONNECT);
    
    const token = req.headers.token;

    try {
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, {}, async (err, userData) => {
                const bookings = await BookingModel.find({ userId: userData._id })
                                                   .populate('placeId');

                res.json(bookings);
            })
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

//used to fetch unavailable dates for a specific location
router.post('/unavailable-dates', async (req, res) => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_CONNECT);
    
    const { placeId } = req.body;

    try {
        const unavailableDates = await BookingModel.find({ placeId: placeId }, { checkInDate: 1, checkOutDate: 1, _id: 0});
        res.json(unavailableDates);
    } catch (err) {
        res.status(400).json(err);
    }
})

router.delete('/bookings/:id', async (req, res) => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_CONNECT);

    const {id} = req.params;

    try {
        const deletedBooking = await BookingModel.deleteOne({ _id: id});
        res.json(deletedBooking);
    } catch (err) {
        res.status(400).json(err);
    }
})

const sendMail = (clientObject) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'rezerva.licenta@gmail.com',
          pass: `${process.env.EMAIL_PASS}`
        }
      });

      const formattedCheckIn = date.format(new Date(clientObject.checkIn), 'DD-MM-YYYY');
      const formattedCheckOut = date.format(new Date(clientObject.checkOut), 'DD-MM-YYYY');
      
      var mailOptions = {
        from: 'rezerva.licenta@gmail.com',
        to: `${clientObject.email}`,
        subject: 'Confirmation of your booking',
        text: `Hello, ${clientObject.name}!\n\nYour booking at ${clientObject.placeName}, from ${formattedCheckIn} to ${formattedCheckOut} is confirmed!\nEnjoy your stay!`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      
}

module.exports = router