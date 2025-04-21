const Loan = require("../models/Loan");
const User = require("../models/Account");
const Book = require("../models/Book");
const { format } = require("date-fns");
const nodemailer = require("nodemailer");

// exports.createLoan = async (userEmail, bookID, phone, address, countDay, frontImage, backImage, note) => {
//     try {
//         const nowUTC = new Date();
//         const dayStart = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000); // Giờ Việt Nam (UTC+7)

//         // Kiểm tra số ngày mượn hợp lệ
//         const countDayInt = parseInt(countDay, 10);
//         if (isNaN(countDayInt) || countDayInt <= 0) {
//             throw new Error("Số ngày mượn không hợp lệ");
//         }

//         // Tính ngày kết thúc
//         const dayEnd = new Date(dayStart);
//         dayEnd.setDate(dayEnd.getDate() + countDayInt);

//         // Lấy LoanID mới
//         const lastLoan = await Loan.findOne().sort({ LoanID: -1 });
//         const newLoanID = lastLoan ? lastLoan.LoanID + 1 : 1;

//         // Tìm người dùng
//         const user = await User.findOne({ Email: userEmail });
//         const userID = user._id;

//         // Cập nhật thông tin người dùng
//         const userUpdate = await User.findByIdAndUpdate(
//             { _id: userID },
//             {
//                 Phone: phone,
//                 Address: address,
//                 FrontImage: frontImage[0].filename,  // Lưu tên file
//                 BackImage: backImage[0].filename     // Lưu tên file
//             },
//             { new: true }
//         );

//         if (!userUpdate) {
//             throw new Error("Không tìm thấy người dùng để cập nhật");
//         }

//         // Cập nhật sách
//         const bookUpdate = await Book.findByIdAndUpdate(
//             { _id: bookID },
//             { Availability: "Unavailable" },
//             { new: true }
//         );

//         if (!bookUpdate) {
//             throw new Error("Không tìm thấy sách để cập nhật");
//         }

//         // Tạo đơn mượn
//         const loan = await Loan.create({
//             LoanID: newLoanID,
//             AccountID: userID,
//             BookID: bookID,
//             DayStart: dayStart,
//             DayEnd: dayEnd,
//             Note: note,
//             State: "Yêu cầu mượn"
//         });

//         return loan;
//     } catch (error) {
//         console.error("Error in loanService.createLoan:", error.message);
//         throw error;
//     }
// };

const generateLoanCode = () => {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');  // Lấy ngày theo định dạng YYYYMMDD
    const randomPart = Math.floor(Math.random() * 10000); // Tạo một số ngẫu nhiên từ 0 đến 9999
    return `${datePart}-${randomPart}`;  // Kết hợp ngày với số ngẫu nhiên để tạo LoanCode
};

exports.createLoan = async (code, bookID, countDay, note, method, payment) => {
    try {
        const nowUTC = new Date();
        const dayStart = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000); // Giờ Việt Nam (UTC+7)

        // Lấy LoanID mới
        const lastLoan = await Loan.findOne().sort({ LoanID: -1 });
        const newLoanID = lastLoan ? lastLoan.LoanID + 1 : 1;

        // Tìm người dùng
        const user = await User.findOne({ LbCode: code });
        if (!user) {
            return { errCode: 1, message: "Không tìm thấy người dùng" };
        }

        // Kiểm tra nếu tài khoản bị hạn chế
        if (user.State === "Limited") {
            return { errCode: 2, message: "Tài khoản của bạn đã bị hạn chế, không thể mượn sách." };
        }

        const userID = user._id;

        if (method === "Mượn về nhà") {
            const countDayInt = parseInt(countDay, 10);
            if (isNaN(countDayInt) || countDayInt <= 0) {
                return { errCode: 3, message: "Số ngày mượn không hợp lệ" };
            }

            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + countDayInt);

            const bookUpdate = await Book.findByIdAndUpdate(
                bookID,
                { Availability: "Unavailable" },
                { new: true }
            );

            if (!bookUpdate) {
                return { errCode: 4, message: "Không tìm thấy sách để cập nhật" };
            }

            const loan = await Loan.create({
                LoanID: newLoanID,
                LoanCode: generateLoanCode(),
                AccountID: userID,
                BookID: [bookID], 
                DayStart: dayStart,
                DayEnd: dayEnd,
                Method: "Mượn về nhà",
                Payment: payment,
                Note: note,
                State: "Yêu cầu mượn"
            });

            return { errCode: 0, message: "Tạo đơn thành công", loan };
        } else if (method === "Mượn tại chỗ") {
            const bookCodes = Array.isArray(bookID) ? bookID : [bookID];

            const books = await Book.find({ BookCode: { $in: bookCodes } }, "_id");

            if (!books || books.length === 0) {
                return { errCode: 5, message: "Không tìm thấy sách với mã BookCode đã cho" };
            }

            const bookList = books.map(book => book._id);

            const loan = await Loan.create({
                LoanID: newLoanID,
                LoanCode: generateLoanCode(),
                AccountID: userID,
                BookID: bookList, 
                DayStart: dayStart,
                DayEnd: dayStart,
                Method: "Mượn tại chỗ",
                Payment: "Miễn phí",
                Note: note || "",
                State: "Đang mượn"
            });

            return { errCode: 0, message: "Tạo đơn thành công", loan };
        } else {
            return { errCode: 6, message: "Hình thức mượn không hợp lệ" };
        }
    } catch (error) {
        console.error("Error in loanService.createLoan:", error.message);
        return { errCode: 500, message: "Lỗi hệ thống" };
    }
};

exports.getAllLoanSV = async (userEmail) => { 
    try {
        const user = await User.findOne({ Email: userEmail });
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        const role = user.Role;

        if (role == "user") {
            const loans = await Loan.find({ AccountID: user._id })
                .sort({ LoanID: -1 });

            // Đảm bảo trả về ngày theo định dạng ISO string
            const formattedLoans = loans.map((loan) => ({
                ...loan._doc, // Bảo toàn các trường khác
                DayStart: loan.DayStart.toISOString(),  // Định dạng dưới dạng ISO string
                DayEnd: loan.DayEnd.toISOString(),     // Định dạng dưới dạng ISO string
            }));

            return formattedLoans;
        } else if (role == "admin") {
            const loans = await Loan.find({})
                .sort({ LoanID: -1 });

            // Đảm bảo trả về ngày theo định dạng ISO string
            const formattedLoans = loans.map((loan) => ({
                ...loan._doc, // Bảo toàn các trường khác
                DayStart: loan.DayStart.toISOString(),  // Định dạng dưới dạng ISO string
                DayEnd: loan.DayEnd.toISOString(),     // Định dạng dưới dạng ISO string
            }));

            return formattedLoans;
        }    
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

exports.acceptLoanSV = async (loanID, state) => {
    try {
        // Tìm Loan và liên kết với Account thông qua AccountID
        const loan = await Loan.findOne({ _id: loanID }).populate({
            path: "AccountID", // Liên kết với Account
            select: "Email Name" // Chỉ lấy trường Email và Name từ Account
        }).populate({
            path: "BookID", // Liên kết với Book
            select: "Title" // Chỉ lấy tiêu đề sách
        });

        if (!loan) {
            throw new Error("Loan không tồn tại");
        }

        const userEmail = loan.AccountID.Email; // Lấy email từ Account
        const userName = loan.AccountID.Name; // Lấy tên người dùng từ Account
        const bookTitles = Array.isArray(loan.BookID) 
            ? loan.BookID.map(book => book.Title).join(", ") 
            : loan.BookID.Title;

        if (!userEmail) {
            throw new Error("Không tìm thấy email người dùng");
        }

        let emailSubject = "";
        let emailContent = "";

        if (state === "Yêu cầu mượn") {
            loan.State = "Đang mượn";

            const oldDayStart = new Date(loan.DayStart);
            const oldDayEnd = new Date(loan.DayEnd);

            if (!oldDayStart || !oldDayEnd || isNaN(oldDayStart) || isNaN(oldDayEnd)) {
                throw new Error("Ngày bắt đầu hoặc kết thúc không hợp lệ");
            }

            const diffTime = Math.abs(oldDayEnd - oldDayStart);
            const countDayBorrowed = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const nowUTC = new Date();
            loan.DayStart = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000); // UTC+7
            loan.DayEnd = new Date(loan.DayStart);
            loan.DayEnd.setDate(loan.DayEnd.getDate() + countDayBorrowed);

            const book = await Book.findOne({ _id: loan.BookID });
            book.Availability = "Unavailable";
            book.CountBorrow += 1;

            await loan.save();
            await book.save();

            emailSubject = "Đơn mượn sách của bạn đã được duyệt!";
            emailContent = `
                Chào ${userName},
                Đơn mượn sách của bạn với tiêu đề "${bookTitles}" đã được duyệt.
                Ngày bắt đầu: ${loan.DayStart.toLocaleDateString()}.
                Ngày kết thúc: ${loan.DayEnd.toLocaleDateString()}.
                Vui lòng đến thư viện trước ngày ${loan.DayStart.toLocaleDateString()} để nhận sách và đóng tiền cọc.
                Chúc bạn đọc sách vui vẻ!
            `;
        } else if (state === "Từ chối") {
            loan.State = "Đã từ chối";

            const book = await Book.findOne({ _id: loan.BookID });
            book.Availability = "Available";

            await loan.save();
            await book.save();

            emailSubject = "Đơn mượn sách của bạn đã bị từ chối";
            emailContent = `
                Chào ${userName},
                Rất tiếc, đơn mượn sách của bạn với tiêu đề "${bookTitles}" đã bị từ chối.
                Vui lòng liên hệ quản lý thư viện qua email ${process.env.EMAIL_USER} nếu bạn có bất kỳ thắc mắc nào.
                Xin cảm ơn!
            `;
        } else if (state === "Đang mượn") {
            loan.State = "Đã trả";

            const nowUTC = new Date();
            loan.DayEnd = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000);

            const book = await Book.findOne({ _id: loan.BookID });
            book.Availability = "Available";

            await loan.save();
            await book.save();

            emailSubject = "Đơn mượn sách của bạn đã hoàn tất";
            emailContent = `
                Chào ${userName},
                Đơn mượn sách của bạn với tiêu đề "${bookTitles}" đã hoàn tất.
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
            `;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.GMAIL_APP_PASSWORD  
            }
        });
        
        await transporter.sendMail({
            to: userEmail,
            subject: emailSubject,
            text: emailContent
        });

        return loan;
    } catch (err) {
        console.error("Lỗi trong loanService.acceptLoanSV: ", err.message);
        throw err;
    }
};

exports.updateLoanById = async(id, { DayStart, DayEnd, State, Note, Payment, Method }) => {
    const loan = await Loan.findById(id);
    if (!loan) {
      const err = new Error('Không tìm thấy đơn mượn');
      err.statusCode = 404;
      throw err;
    }
  
    // Cập nhật các trường
    loan.DayStart = DayStart;
    loan.DayEnd   = DayEnd;
    loan.State    = State;
    loan.Note     = Note ?? loan.Note;
    loan.Payment  = Payment;
    loan.Method   = Method;
  
    await loan.save();
    return loan;
  }
