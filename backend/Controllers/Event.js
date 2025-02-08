const express = require('express');
const Event = require('../Models/EventModel');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
const mongoose=require('mongoose')
// CREATE Event
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description, dateTime, location, category, image } = req.body;

        const event = new Event({
            title,
            description,
            dateTime,
            location,
            category,
            createdBy: req.user.id,
            image
        });

        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// READ All Events
router.get('/', async (req, res) => {
    const query = req.query.keyword
    ? {category: { $regex: req.query.keyword, $options: 'i' }}
    : {};
    try {
        const events = await Event.find(query).populate('createdBy', 'name email');
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// READ Single Event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
        if (!event) return res.status(404).json({ message: "Event not found" });

        res.json(event);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE Event (Only Owner Can Update)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this event" });
        }

        const { title, description, dateTime, location, category, image } = req.body;
        event.title = title || event.title;
        event.description = description || event.description;
        event.dateTime = dateTime || event.dateTime;
        event.location = location || event.location;
        event.category = category || event.category;
        event.image = image || event.image;

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE Event (Only Owner Can Delete)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this event" });
        }

        await event.deleteOne();
        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});



router.post('/:id/attend', authenticateToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.attendees.includes(req.user.id)) {
            return res.json({ message: "You are already attending this event" });
        }

        event.attendees.push(new mongoose.Types.ObjectId(req.user.id));
        await event.save();

        res.json({ message: "Attendee added successfully", event });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

//Remove an attendee from an event
router.delete('/:id/attend', authenticateToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        event.attendees = event.attendees.filter(attendee => attendee.toString() !== req.user.id);
        await event.save();

        res.json({ message: "You have left the event", event });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

//  Get all attendees for an event
router.get('/:id/attendees', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('attendees', 'name email');
        if (!event) return res.status(404).json({ message: "Event not found" });

        res.json({ attendees: event.attendees });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Middleware to Verify Token
function authenticateToken(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1]; 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded); 
        req.user = decoded; 
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        res.status(400).json({ message: "Invalid Token" });
    }
}



module.exports = router;
