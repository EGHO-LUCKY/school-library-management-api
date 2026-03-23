const Author = require('../model/author');
const { Types } = require('mongoose');
const validateId = require('../utils/validateId');

const createAuthor = async (req, res) => {
    const { name, bio } = req.body;
    if ( !name ) return res.status(400).json({message: "Missing Name field"});

    const author = { name, bio }
    
    await Author.create(author);

    res.status(201).json({message: "Author Created Successfully", author: author});
}

const getAuthors = async (req, res) => {
    const authors = await Author.find();
    res.json({ authors });
}

const getAuthorById = async (req, res) => {
    const id = req.params.id;
    validateId(id, res);

    const author = await Author.findOne({ _id: id });
    if ( !author ) return res.status(404).json({message: `Author with Id: ${id} not found`});

    res.json({ author });
}

const updateAuthorById = async (req, res) => {
    const id = req.params.id;
    validateId(id, res);

    const { name, bio } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (bio !== undefined) update.bio = bio;

    const updatedAuthor = await Author.findByIdAndUpdate(
        id,
        update,                // update fields
        { new: true }          // return updated Author
    );
    
    if ( !updatedAuthor ) return res.status(404).json({message: `Author with Id: ${id} not found`});
    
    res.json({ message: "Updated Successfully", Author: updatedAuthor });
}

const deleteAuthorById = async (req, res) => {
    const id = req.params.id;
    validateId(id, res);

    const deletedAuthor = await Author.findByIdAndDelete(id);

    if ( !deletedAuthor ) return res.status(404).json({message: `Author with Id: ${id} not found`});

    return res.json({message: "Author Deleted Successfully", deletedAuthor });
}

module.exports = {
    createAuthor,
    getAuthors,
    getAuthorById,
    updateAuthorById,
    deleteAuthorById
}