const Event = require("../models/Event");

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addEvent = async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const event = new Event({ title, date, description });
    await event.save();
    res.status(201).json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
