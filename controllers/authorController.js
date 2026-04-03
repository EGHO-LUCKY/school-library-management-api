const Author = require('../models/author');

const createAuthor = async (req, res) => {
    const { name, bio } = req.body;
    if ( !name ) return res.status(400).json({message: "Missing Name field"});

    const author = { name, bio }
    
    try {
        await Author.create(author);
    
        return res.status(201).json({message: "Author Created Successfully", author: author});

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to create Author. Please try again" });
    }
}

const getAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        if (!authors) return res.status(404)
            .json({ message: "No Author available." });

        return res.json({ authors });

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to get Authors. Please try again." });
    }
}

const getAuthorById = async (req, res) => {
    const id = req.params.id;

    try {
        const author = await Author.findById(id);
        if (!author) return res.status(404).json({message: `Author with Id: ${id} not found`});
    
        res.json({ author });

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to retrieve Author, Please try again."});
    }
}

const updateAuthorById = async (req, res) => {
    const id = req.params.id;

    const { name, bio } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (bio !== undefined) update.bio = bio;

    try {
        const updatedAuthor = await Author.findByIdAndUpdate(
            id,
            update,                // update fields
            { returnDocument: 'after' }          // return updated Author
        );
        
        if ( !updatedAuthor ) return res.status(404).json({message: `Author with Id: ${id} not found`});
        
        res.json({ message: "Updated Successfully", Author: updatedAuthor });

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to retrieve Author. Please try again." });
    }
}

const deleteAuthorById = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedAuthor = await Author.findByIdAndDelete(id);
        if (!deletedAuthor) return res.status(404).json({message: `Author with Id: ${id} not found`});
    
        return res.json({message: "Author Deleted Successfully", deletedAuthor });

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to delete Author. Please try again." });
    }
}

module.exports = {
    createAuthor,
    getAuthors,
    getAuthorById,
    updateAuthorById,
    deleteAuthorById
}