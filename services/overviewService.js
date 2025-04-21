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

exports.getBorrowedBooksByMonth = async (year) => {
    const start = new Date(year, 0, 1);  // Ngày bắt đầu năm
    const end = new Date(year + 1, 0, 1);  // Ngày bắt đầu năm sau
  
    try {
      const agg = await LoanModel.aggregate([
        { $match: { DayStart: { $gte: start, $lt: end } } },
        {
          $group: {
            _id: { month: { $month: '$DayStart' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.month': 1 } }
      ]);
  
      // Khởi tạo mảng 12 tháng
      const months = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
      const counts = Array(12).fill(0);
      agg.forEach(item => {
        counts[item._id.month - 1] = item.count;
      });
  
      return { months, counts };
    } catch (err) {
      throw new Error('Error fetching borrowed books data: ' + err.message);
    }
};

exports.countDamagedBooks = async () => {
    try {
      // Nếu có thêm trạng thái "Lost", có thể dùng: { $in: ['Torned','Lost'] }
      const count = await BookModel.countDocuments({ Availability: 'Torned' });
      return count;
    } catch (err) {
      throw new Error('Error counting damaged books: ' + err.message);
    }
};