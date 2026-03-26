const Book = require('../models/book');
const Author = require('../models/author');
const Student = require('../models/student');
const Attendant = require('../models/libraryAttendant');
const { Types } = require('mongoose');
const ISBN = require("isbn3");
const validate = require('../middleware/validate');

const createBook = async (req, res) => {
    const { title, isbn, authors } = req.body;

    if (!title || !isbn || !authors) return res.status(400)
        .json({message: "Missing fields"});

    // VALIDATE ISBN
    if (!ISBN.parse(isbn)) return res.status(400)
        .json({message: "Invalid isbn number"});

    // AUTHORS VALIDATION
    if (!Array.isArray(authors)) return res.status(400)
        .json({message: "Authors must be an array"});

    if (authors.length === 0) return res.status(400)
        .json({message: "Authors must be a non empty array"});

    if (!authors.every(Id => Types.ObjectId.isValid(Id))) return res.status(400)
        .json({message: "One or More invalid Author Id"});

    const count = await Author.countDocuments({
        _id: { $in: authors }
    });

    if (count !== authors.length) return res.status(404)
        .json({ message: "One or more authors not found" });

    try {
        const existingBook = await Book.findOne({isbn});
        if (existingBook) return res.status(400)
            .json({ message: `Book with ISBN: ${isbn} already exist.` });

        const book = await Book.create({
            title,
            isbn,
            authors
        });
    
        return res.status(201).json({ message: "Book Created Successfully", book });

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to create book. Please try again" });
    }
}

const getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('authors').populate('borrowedBy').populate('issuedBy');
        res.json({ books });

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to retrieve Books. Please try again." })
    }
}

const getBookById = async (req, res) => {
    const id = req.params.id;

    try {
        const book = await Book.findById(id).populate('authors').populate('borrowedBy').populate('issuedBy');
        if(!book) return res.status(404)
            .json({ message: `Book with ID: ${id} Not Found.`});
    
        return res.json({ book });

    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to retrieve Book. Please try again." })
    }
}

const updateBookById = async (req, res) => {
    const id = req.params.id;

    const { title, isbn, authors } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (isbn !== undefined) update.isbn = isbn;
    if (authors !== undefined) update.authors = authors;

    try {
        const updatedBook = await Book.findByIdAndUpdate(
            id,
            update,
            { returnDocument: 'after' } // returns a copy of the updated book
        ).populate('authors').populate('borrowedBy').populate('issuedBy');
    
        if (!updatedBook) return res.status(404)
            .json({message: `Book with Id: ${id} not found`});
    
        return res.json({ message: "Updated Successfully", Book: updatedBook });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to update Book. Please try again." });
    }

}

const deleteBookById = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) return res.status(404).json({message: `Book with Id: ${id} not found`});
    
        res.json({ message: "Deleted Successfully", Book: deletedBook });

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to delete book. Please try again"});
    }
}

const borrowBook = async (req, res) => {
    const { studentId, attendantId, returnDate } = req.body;
    if (!studentId || !attendantId ) return res.status(400)
        .json({ message: "Missing Field(s)"});

    if (!validate.isValidId(studentId)) return res.status(400)
        .json({ message: `Invalid Student ID: ${studentId}`});

    if (!validate.isValidId(attendantId)) return res.status(400)
        .json({ message: `Invalid Attendant ID: ${attendantId}`});

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404)
            .json({ message: `Student with ID: ${studentId} not found.`})

        const attendant = await Attendant.findById(attendantId);
        if (!attendant) return res.status(404)
            .json({ message: `Attendant with ID: ${attendantId} not found.`});

        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404)
            .json({ message: `Book with ID: ${id} Not Found.`});

        if (book.status === "OUT") return res.json({ message: "Book has been borrowed"});

        book.borrowedBy = studentId;
        book.issuedBy = attendantId;
        book.returnDate = new Date(returnDate);
        book.status = "OUT";

        await book.save();
        return res.json({ message: "Borrowed Successfully", book });
        
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ 
            message: "Unable to borrow book. Please try again"
        });
    }
}

const returnBook = async (req, res) => {
    try {
        const id = req.params.id;
        
        const book = await Book.findById(id);
        if (!book) return res.status(404)
            .json({ message: `Book with ID: ${id} not found.`});

        if (book.status === "IN") return res.status(400)
            .json({ message: "Book is currently in the library" });

        book.borrowedBy = null;
        book.issuedBy = null;
        book.returnDate = null;
        book.status = "IN";

        book.save();
        return res.json({ 
            message: "Book returned successfully",
            book
        })

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to return book. Please try again" });
    }
}

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBookById,
    deleteBookById,
    borrowBook,
    returnBook
}