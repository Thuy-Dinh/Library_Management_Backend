const Loan = require("../models/Loan");
const User = require("../models/Account");
const Book = require("../models/Book");
const { format } = require("date-fns");

exports.createLoan = async (userEmail, bookID, phone, address, countDay, frontImage, backImage, note) => {
    try {
        const nowUTC = new Date();
        const dayStart = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000); // Giờ Việt Nam (UTC+7)

        // Kiểm tra số ngày mượn hợp lệ
        const countDayInt = parseInt(countDay, 10);
        if (isNaN(countDayInt) || countDayInt <= 0) {
            throw new Error("Số ngày mượn không hợp lệ");
        }

        // Tính ngày kết thúc
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + countDayInt);

        // Lấy LoanID mới
        const lastLoan = await Loan.findOne().sort({ LoanID: -1 });
        const newLoanID = lastLoan ? lastLoan.LoanID + 1 : 1;

        // Tìm người dùng
        const user = await User.findOne({ Email: userEmail });
        const userID = user._id;

        // Cập nhật thông tin người dùng
        const userUpdate = await User.findByIdAndUpdate(
            { _id: userID },
            {
                Phone: phone,
                Address: address,
                FrontImage: frontImage[0].filename,  // Lưu tên file
                BackImage: backImage[0].filename     // Lưu tên file
            },
            { new: true }
        );

        if (!userUpdate) {
            throw new Error("Không tìm thấy người dùng để cập nhật");
        }

        // Cập nhật sách
        const bookUpdate = await Book.findByIdAndUpdate(
            { _id: bookID },
            { Availability: "Unavailable" },
            { new: true }
        );

        if (!bookUpdate) {
            throw new Error("Không tìm thấy sách để cập nhật");
        }

        // Tạo đơn mượn
        const loan = await Loan.create({
            LoanID: newLoanID,
            AccountID: userID,
            BookID: bookID,
            DayStart: dayStart,
            DayEnd: dayEnd,
            Note: note,
            State: "Yêu cầu mượn"
        });

        return loan;
    } catch (error) {
        console.error("Error in loanService.createLoan:", error.message);
        throw error;
    }
};

exports.getAllLoanSV = async (userEmail) => {
    try {
        const user = await User.findOne({ Email: userEmail });
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        const loans = await Loan.find({ AccountID: user._id });

        // Format DayStart và DayEnd
        const formattedLoans = loans.map((loan) => ({
            ...loan._doc, // Bảo toàn các trường khác
            DayStart: format(new Date(loan.DayStart), "dd/MM/yyyy"),
            DayEnd: format(new Date(loan.DayEnd), "dd/MM/yyyy"),
        }));

        return formattedLoans;
    } catch (err) {
        console.error("Lỗi trong loanService.getAllLoanSV: ", err.message);
        throw err;
    }
};

exports.getALoanSV = async (loanID) => {
    try {
        return Loan.findById({ _id: loanID });
    } catch (err) {
        console.error("Lỗi trong getALoanSV: ", err.message);
        throw err;
    }
};