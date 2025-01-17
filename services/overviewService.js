const BookModel = require("../models/Book");
const LoanModel = require("../models/Loan");

exports.getTotalBook = async() => {
    const bookCount = await BookModel.countDocuments({});
    return bookCount;
}

exports.getAvailableBook = async() => {
    const bookCount = await BookModel.countDocuments({Availability: "Available"});
    return bookCount;
}

exports.getTopBooksByBorrowCount = async () => {
    const topBooks = await BookModel.find({})
        .sort({ CountBorrow: -1 }) 
        .limit(5); 
    return topBooks;
};

exports.getCountBorrowedByTime = async (day, month, year) => {
    const matchConditions = {};

    if (year !== null) {
        matchConditions["$expr"] = { $eq: [{ $year: "$DayStart" }, year] };
    }
    if (month !== null) {
        matchConditions["$expr"] = {
            $and: [
                matchConditions["$expr"] || {},
                { $eq: [{ $month: "$DayStart" }, month] }
            ],
        };
    }
    if (day !== null) {
        matchConditions["$expr"] = {
            $and: [
                matchConditions["$expr"] || {},
                { $eq: [{ $dayOfMonth: "$DayStart" }, day] }
            ],
        };
    }

    return LoanModel.aggregate([
        { $match: matchConditions },
        { $count: "countBorrowedBooks" }
    ]);
};