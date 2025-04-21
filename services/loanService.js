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
            const bookCodes = Array.isArray(bookID)
                ? bookID.map((b) => (typeof b === "object" ? b.code : b))
                : [typeof bookID === "object" ? bookID.code : bookID];
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

function getLibrarySignature() {
    return `
        <p style="margin-top: 30px; font-size: 14px; color: #555;">
            —<br/>
            <strong>📚 Thư viện Trường BokStory</strong><br/>
            📧 Email: <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a><br/>
            ☎️ Hotline: 096 440 6858<br/>
            🌐 Truy cập website để biết thêm thông tin chi tiết.
        </p>
    `;
}

exports.acceptLoanSV = async (loanID, state) => {
    try {
        const loan = await Loan.findOne({ _id: loanID }).populate({
            path: "AccountID",
            select: "Email Name"
        }).populate({
            path: "BookID",
            select: "Title"
        });

        if (!loan) throw new Error("Loan không tồn tại");

        const userEmail = loan.AccountID.Email;
        const userName = loan.AccountID.Name;
        const bookTitles = Array.isArray(loan.BookID)
            ? loan.BookID.map(book => book.Title).join(", ")
            : loan.BookID.Title;

        let emailSubject = "";
        let emailContent = "";

        if (state === "Yêu cầu mượn") {
            loan.State = "Đang mượn";

            const oldDayStart = new Date(loan.DayStart);
            const oldDayEnd = new Date(loan.DayEnd);
            const diffTime = Math.abs(oldDayEnd - oldDayStart);
            const countDayBorrowed = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const nowUTC = new Date();
            loan.DayStart = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000);
            loan.DayEnd = new Date(loan.DayStart);
            loan.DayEnd.setDate(loan.DayEnd.getDate() + countDayBorrowed);

            const book = await Book.findOne({ _id: loan.BookID });
            book.Availability = "Unavailable";
            book.CountBorrow += 1;

            await loan.save();
            await book.save();

            emailSubject = "📘 Đơn mượn sách của bạn đã được duyệt!";
            emailContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #2c3e50;">Xin chào ${userName},</h2>
                    <p>🎉 Chúc mừng! Đơn mượn sách của bạn đã được <strong>duyệt thành công</strong>.</p>
                    <p><strong>Thông tin mượn sách:</strong></p>
                    <ul>
                        <li><strong>Tựa sách:</strong> ${bookTitles}</li>
                        <li><strong>Ngày bắt đầu:</strong> ${loan.DayStart.toLocaleDateString()}</li>
                        <li><strong>Ngày kết thúc:</strong> ${loan.DayEnd.toLocaleDateString()}</li>
                    </ul>
                    <p>📌 Vui lòng đến <strong>Thư viện Trường BokStory</strong> <u>trước 17h ngày ${loan.DayStart.toLocaleDateString()}</u> để nhận sách và hoàn tất thủ tục đặt cọc.</p>
                    <p>Nếu bạn không đến đúng hạn, đơn mượn có thể sẽ bị hủy tự động.</p>
                    <p>Chúc bạn đọc sách vui vẻ và học tập hiệu quả!</p>
                    <p style="margin-top: 20px;">Trân trọng,<br/>Ban quản lý Thư viện</p>
                    ${getLibrarySignature()}
                </div>
            `;
        } else if (state === "Từ chối") {
            loan.State = "Đã từ chối";

            const book = await Book.findOne({ _id: loan.BookID });
            book.Availability = "Available";

            await loan.save();
            await book.save();

            emailSubject = "📕 Đơn mượn sách đã bị từ chối";
            emailContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #c0392b;">Xin chào ${userName},</h2>
                    <p>Rất tiếc, đơn mượn sách của bạn với tiêu đề <strong>${bookTitles}</strong> đã bị từ chối.</p>
                    <p>📝 Nếu bạn có bất kỳ thắc mắc nào hoặc muốn biết lý do từ chối, vui lòng liên hệ với thư viện qua địa chỉ email <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.</p>
                    <p>Chúng tôi rất mong được hỗ trợ bạn trong những lần mượn tiếp theo.</p>
                    <p style="margin-top: 20px;">Thân ái,<br/>Ban quản lý Thư viện</p>
                    ${getLibrarySignature()}
                </div>
            `;
        } else if (state === "Đang mượn") {
            loan.State = "Đã trả";

            const nowUTC = new Date();
            loan.DayEnd = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000);

            const book = await Book.findOne({ _id: loan.BookID });
            book.Availability = "Available";

            await loan.save();
            await book.save();

            emailSubject = "✅ Đơn mượn sách đã hoàn tất";
            emailContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #27ae60;">Xin chào ${userName},</h2>
                    <p>🎉 Cảm ơn bạn đã trả lại sách đúng hạn. Đơn mượn sách của bạn với tiêu đề <strong>"${bookTitles}"</strong> đã được hoàn tất.</p>
                    <p>Chúng tôi hy vọng tài liệu đã hỗ trợ tốt cho nhu cầu học tập hoặc nghiên cứu của bạn.</p>
                    <p>📌 Đừng quên tiếp tục sử dụng các dịch vụ và nguồn tài liệu hữu ích khác từ Thư viện.</p>
                    <p style="margin-top: 20px;">Thân ái,<br/>Ban quản lý Thư viện</p>
                    ${getLibrarySignature()}
                </div>
            `;
        } else {
            throw new Error("Trạng thái không hợp lệ");
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `"Thư viện Trường BokStory" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: emailSubject,
            html: emailContent
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
