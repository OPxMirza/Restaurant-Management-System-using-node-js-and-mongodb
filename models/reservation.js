// models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    requests: { type: String },
    status: { type: String, default: 'Pending' }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
