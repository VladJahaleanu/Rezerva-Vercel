const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    owner: {
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User',
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    photos: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    perks: {
        type: [String],
    },
    extraInfo: {
        type: String,
        default: 'No extra information!'
    },
    checkIn: {
        type: Number,
        required: true
    },
    checkOut: {
        type: Number,
        required: true
    },
    maxGuests: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: 'other'
    }
});

module.exports = mongoose.model('Place', placeSchema)