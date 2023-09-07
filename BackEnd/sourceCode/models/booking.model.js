const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    placeId: {type:mongoose.Schema.Types.ObjectId, 
            ref:'Place',
            required: true},
    userId: {type:mongoose.Schema.Types.ObjectId, 
            ref:'User',
            required: true},
    clientName: {
        type: String,
        required: true
    },
    clientEmail: {
        type: String,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    noGuests: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Booking', bookingSchema)