const Attendant = require('../models/libraryAttendant');

const createAttendant = async (req, res) => {
    const name = req.body.name;

    if (!name) return res.status(400)
        .json({ message: "Missing name field"});

    try {
        const attendant = await Attendant.create({ name });
        return res.status(201)
        .json({
            message: "Library Attendant Created Successfully",
            libraryAttendant: attendant
        });
    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to Create Library attendant. Please try again" });
    }
}

const getAttendants = async (req, res) => {
    try {
        const attendants = await Attendant.find();
        if (!attendants) return res.status(404)
            .json({ message: "No Library attendant found" });
    
        return res.json({ attendants });

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to get Library attendants. Please try again" });
    }
}

module.exports = {
    createAttendant,
    getAttendants
}