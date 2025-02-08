const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendee', attendeeSchema);
