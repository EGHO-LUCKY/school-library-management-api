const { Types } = require('mongoose');


const isValidId = (id) => {
        if (!Types.ObjectId.isValid(id)) return false
        return true
}

const validateId = (req, res, next) => {
        const id = req.params.id;
        if (!isValidId(id)) return res.status(400).json({message: `Invalid ID: ${id}`});
        next();
}

const isValidDate = (dateString) => {
        if (typeof dateString !== 'string') return false;
        
        // Enforce strict format YYYY-MM-DD
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;
        
        const date = new Date(dateString);
        
        // Check if it's a valid date
        if (isNaN(date.getTime())) return false;

        return true;
}

const validateDate = (req, res, next) => {
        const dateString = req.body.returnDate;
        if (!isValidDate(dateString)) return res.status(400)
                .json({ message: "Invalid Date string. Follow this format 'YYYY-MM-DD'"});
        
        const date = new Date(dateString);
        
        // Ensure no auto-correction (e.g., Feb 30 → March 1)
        const [year, month, day] = dateString.split('-').map(Number);
        if (!(
                date.getUTCFullYear() === year &&
                date.getUTCMonth() + 1 === month &&
                date.getUTCDate() === day
        )) return res.status.json({ message: "Invalid Date string. Follow this format 'YYYY-MM-DD'"});
        
        next();
}

const validateISBN = (isbn) => {
        // Remove hyphens and spaces
        const clean = isbn.replace(/[-\s]/g, '');

        // ISBN-10 validation
        if (/^\d{9}[\dX]$/.test(clean)) {
                // let sum = 0;

                // for (let i = 0; i < 10; i++) {
                //         let digit = clean[i] === 'X' ? 10 : Number(clean[i]);
                //         sum += digit * (i + 1);
                // }
                
                
                // if (sum % 11 === 0) return clean;
                return clean
        }

        // ISBN-13 validation
        if (/^\d{13}$/.test(clean)) {
                // let sum = 0;
                
                // for (let i = 0; i < 12; i++) {
                //         let digit = Number(clean[i]);
                //         sum += (i % 2 === 0) ? digit : digit * 3;
                // }
                
                // let checkDigit = (10 - (sum % 10)) % 10;
                // if (checkDigit === Number(clean[12])) return clean;
                return clean
        }

        return false;
}


  module.exports = {
          isValidId,
          validateId,
          validateDate,
          validateISBN
}