const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    LoanID: { type: Number, required: true },
    AccountID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Account', 
        required: true 
    },
    BookID: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book', 
        required: true 
    }],
    DayStart: Date,
    DayEnd: Date,
    Note: String,
    Method: String,
    Payment: String,
    State: String
});

module.exports = mongoose.model('Loan', LoanSchema);