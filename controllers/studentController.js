const Student = require('../models/student');
const validator = require('validator');

const createStudent = async (req, res) => {
    const { name, email } = req.body;  

    if (!name || !email) return res.status(400)
        .json({message: "Missing field(s)"});

    if (!validator.isEmail(email)) return res.status(400)
        .json({message: "Invalid Email"});

    try {
        const existingStudent = await Student.find({ email });
        if (existingStudent) return res.status(400)
            .json({ message: "Email already exist."});
        
        const student = await Student.create({
            name,
            email
        });

        return res.status(201).json({
            message: "Student Created successfully",
            student
        });
        
    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to create student. Please try again" });
    }
}

const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        if (!students) return res.status(404)
            .json({ message: "No Student found."});

        res.json({ students });

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to retrieve Students record. Please try again" });
    }
}

const getStudentById = async (req, res) => {
    const id = req.params.id

    try {
        const student = await Student.findById(id);
    
        if (!student) return res.status(404)
            .json({message: `Student with ID: ${id} not found`});
    
        return res.json({ student });

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to retrieve Student record. Please try again" });
    }
}

module.exports = {
    createStudent,
    getStudents,
    getStudentById
}