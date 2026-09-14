const Booking = require("../models/booking");
const Expert = require("../models/expert");
const mongoose = require("mongoose");
const { isValidEmail, isValidPhone, isValidName, isValidDate, isValidTimeSlot, isValidNotes } = require("../utils/validate");

// Create a new booking
const createBooking = async (req, res) => {
    try{ 
        const {expert, name, email, phone, date, timeSlot, notes} = req.body;

        // Input validation
        if (!name || !isValidName(name)) {
            return res.status(400).json({ message: 'Name must be at least 2 characters long' });
        }
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: 'Valid email is required' });
        }
        if (!phone || !isValidPhone(phone)) {
            return res.status(400).json({ message: 'Phone number must be 10-15 digits' });
        }
        if (!date || !isValidDate(date)) {
            return res.status(400).json({ message: 'Valid date in YYYY-MM-DD format is required' });
        }
        if (!timeSlot || !isValidTimeSlot(timeSlot)) {
            return res.status(400).json({ message: 'Valid time slot in HH:MM format is required' });
        }
        if (!isValidNotes(notes)) {
            return res.status(400).json({ message: 'Notes must not exceed 500 characters' });
        }

        // Validate expert ID
        if(!mongoose.Types.ObjectId.isValid(expert)){
            return res.status(400).json({ message: 'Invalid expert ID' });
        }

        const expertExists = await Expert.findById(expert);
        //check if expert exists 
        if(!expertExists){
            return res.status(404).json({ message: 'Expert not found' });
        }
        //check if the selected time slot is available for the chosen date
        const dataEntry =  expertExists.availableSlots.find(slot => slot.date === date);
        if(!dataEntry || !dataEntry.slots.includes(timeSlot)){
            return res.status(400).json(
                { message: 'Selected time slot is not available for the chosen date.' }
            );
        }

        // Remove slot from expert BEFORE creating booking 
        await Expert.updateOne(
            {_id: expert,"availableSlots.date": date}, 
            { $pull: {"availableSlots.$.slots": timeSlot} }
        );

        //create and save the new booking
        const newBooking = new Booking({expert, name, email, phone, date, timeSlot, notes});
        const savedBooking = await newBooking.save();

        const io = req.app.get('io');
        io.emit('slotBooked',{
            expertId: expert,
            date,
            timeSlot
        });

        res.status(201).json(savedBooking);
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ message: 'This time slot is already booked for the selected expert.' });
        } else {
            res.status(500).json({ message: 'An error occurred while creating the booking.', error: error.message });
        }
    }
}

//update booking status by id
const updateBookingStatus = async (req, res) => {
    try {
        const allowedStatuses = ['pending', 'confirmed', 'completed'];

        const { id } = req.params;
        const { status } = req.body;
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                 message: `Invalid status.`
                });
        }
        const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating booking status.', error: error.message });
    }
}
// Get all bookings for a specific email
const getBookingsByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: 'Email query parameter is required' });
        }
        const bookings = await Booking.find({ email: email }).sort({ date: 1, timeSlot: 1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching bookings.', error: error.message });
    }
}

module.exports = {
    createBooking,
    updateBookingStatus,
    getBookingsByEmail
}