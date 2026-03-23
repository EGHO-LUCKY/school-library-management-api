const Book = require('../model/book');
const Author = require('../model/author');
const { Types } = require('mongoose');
const isbnValidate = require("isbn-validate");
const validateId = require('../utils/validateId');

const createBook = async (req, res) => {
    const { title, isbn, authors } = req.body;

    if (!title || !authors) return res.status(400)
        .json({message: "Missing fields"});

    // VALIDATES ISBN IF IT EXISTS
    if (isbn) {
        if (!isbnValidate(isbn)) return res.status(400)
            .json({message: "Invalid isbn number"});
    }

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

    const book = await Book.create({
        title,
        isbn,
        authors
    });

    return res.status(201).json({ message: "Book Created Successfully", book });
}

const getBooks = async (req, res) => {
    const books = await Book.find();

    res.json({ books });
}

const getBookById = async (req, res) => {
    const id = req.params.id;
    validateId(id, res);

    const book = await Book.findById(id);
    return res.json({ book });
}

const updateBookById = async (req, res) => {
    const id = req.params.id;
    validateId(id, res);

    const { title, isbn, authors } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (isbn !== undefined) update.isbn = isbn;
    if (authors !== undefined) update.authors = authors;

    const updatedBook = await Book.findByIdAndUpdate(
        id,
        update,
        { new: true } // returns a copy of the updated book
    );

    if (!updatedBook) return res.status(404).json({message: `Book with Id: ${id} not found`});

    res.json({ message: "Updated Successfully", Book: updatedBook });
}

const deleteBookById = async (req, res) => {
    const id = req.params.id;
    validateId(id, res);

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) return res.status(404).json({message: `Book with Id: ${id} not found`});

    res.json({ message: "Deleted Successfully", Book: deletedBook });
}

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBookById,
    deleteBookById
}