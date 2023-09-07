const UserModel = require('../models/user.model')
const PlaceModel = require('../models/place.model')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../validation')
const download = require('image-downloader')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const mongoose = require('mongoose')
const router = express.Router()


//POST save accommodation to db
router.post('/api/accommodations', async (req, res) => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_CONNECT);

    const token = req.headers.token;

    var {
        title, address, addedPhotos, 
        description, perks, extraInfo, 
        checkIn, checkOut, maxGuests, price,
        category
    } = req.body;

    if (extraInfo === '') {
        extraInfo = 'No extra information!'
    }
    if (category === '') {
        category = 'other'
    }

    const place = new PlaceModel ({
        title, address, photos:addedPhotos, 
        description, perks, extraInfo, 
        checkIn, checkOut, maxGuests, price,
        category
    });

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, {}, async (err, userData) => {
            if (err) throw err;
            const {userName} = await UserModel.findOne({ _id: userData._id });
            place.owner = userData._id;
            place.ownerName = userName;
            try {
                console.log(place);
                const savedPlace = await place.save();
                res.json(savedPlace);
            } catch (err) {
                res.status(400).json(err);
            }
        })
    }
})

//GET all places(to show initially on homepage)
router.get('/api/accommodations', async (req, res) => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_CONNECT);

    try {
        var places;
        if (req.query.category) {
            places = await PlaceModel.find( {category: req.query.category} );
        } else {
            places = await PlaceModel.find();
        }
        res.json(places);
    } catch(err) {
        res.json(err);
    }
})

//GET a user's added places
router.get('/api/user-accommodations', async (req, res) => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_CONNECT);

    const token = req.headers.token;

    try {
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, {}, async (err, userData) => {

                const places = await PlaceModel.find({ owner: userData._id });
                res.json(places);
            })
        }
    } catch (err) {
        res.status(400).json(err);
    }
    

})


//GET place by ID
router.get('/api/accommodations/:id', async (req, res) => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_CONNECT);

    const {id} = req.params;

    const place = await PlaceModel.findById(id);

    res.json(place);
})


//EDIT place by ID
router.put('/api/accommodations/:id', async (req, res) => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_CONNECT);

    const {id} = req.params;

    const token = req.headers.token;

    const {
        title, address, addedPhotos, 
        description, perks, extraInfo, 
        checkIn, checkOut, maxGuests, price,
        category
    } = req.body;

    const updatedPlace = {
        title, address, photos:addedPhotos, 
        description, perks, extraInfo, 
        checkIn, checkOut, maxGuests, price,
        category
    };

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, {}, async (err, userData) => {
            if (err) throw err;

            try {
                const placeDocument = await PlaceModel.findByIdAndUpdate(id, updatedPlace);
                res.json(placeDocument);
            } catch (err) {
                res.status(400).json(err);
            }
            
        })
    }

})

module.exports = router