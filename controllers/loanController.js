const loanService = require("../services/loanService");

// exports.createLoan = async (req, res) => {
//     try {
//         // Debug dữ liệu nhận được
//         console.log("Body:", req.body);
//         console.log("Files:", req.files);

//         const { userEmail, bookID, phone, address, countDay, note } = req.body;
//         const frontImage = req.files['frontImage'];
//         const backImage = req.files['backImage'];

//         // Kiểm tra xem có thiếu trường nào không
//         if (!userEmail || !bookID || !phone || !address || !countDay || !frontImage || !backImage) {
//             return res.status(400).json({ error: "Các trường dữ liệu bị thiếu" });
//         }

//         // Gọi service xử lý logic
//         const loan = await loanService.createLoan(
//             userEmail,
//             bookID,
//             phone,
//             address,
//             countDay,
//             frontImage,
//             backImage,
//             note
//         );

//         return res.status(200).json({ message: "Tạo đơn thành công", loan });
//     } catch (err) {
//         console.error("Lỗi trong createLoan:", err.message);
//         return res.status(500).json({ error: err.message });
//     }
// };

exports.createLoan = async (req, res) => {
    try {
        const { code, bookID, countDay, note, method, payment } = req.body;

        if (!code || !bookID || !countDay || !method || !payment) {
            return res.status(400).json({ errCode: 1, message: "Các trường dữ liệu bị thiếu" });
        }

        const response = await loanService.createLoan(code, bookID, countDay, note, method, payment);

        return res.status(200).json(response);
    } catch (err) {
        console.error("Lỗi trong createLoan:", err.message);
        return res.status(500).json({ errCode: 500, message: "Lỗi hệ thống" });
    }
};

exports.getAllLoan = async (req, res) => {
    try {
        const { email } = req.body; // Lấy email từ req.body

        // Kiểm tra email có tồn tại hay không
        if (!email) {
            return res.status(400).json({ error: "Trường email là bắt buộc" });
        }

        // Gọi service để lấy thông tin các khoản vay
        const allLoan = await loanService.getAllLoanSV(email);

        return res.status(200).json({ allLoan });
    } catch (err) {
        console.error("Lỗi trong getAllLoan: ", err.message);
        return res.status(500).json({ error: "Đã xảy ra lỗi trong hệ thống" });
    }
};

exports.getALoan = async (req, res) => {
    try {
        const loanID  = req.params.id; 

        if (!loanID) {
            return res.status(400).json({ error: "Trường loanID là bắt buộc" });
        }

        const loanDetail = await loanService.getALoanSV(loanID);

        return res.status(200).json({ loanDetail });
    } catch (err) {
        console.error("Lỗi trong getALoan: ", err.message);
        return res.status(500).json({ error: "Đã xảy ra lỗi trong hệ thống" });
    }
};

exports.acceptLoan = async (req, res) => {
    try {
        const { loanID, state }  = req.body; 

        if (!loanID || !state) {
            return res.status(400).json({ error: "Trường loanID là bắt buộc" });
        }

        const loan = await loanService.acceptLoanSV(loanID, state);

        return res.status(200).json({ loan });
    } catch (err) {
        console.error("Lỗi trong acceptLoan: ", err.message);
        return res.status(500).json({ error: "Đã xảy ra lỗi trong hệ thống" });
    }
}

exports.updateLoan = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
  
    try {
      const updated = await loanService.updateLoanById(id, payload);
      res.status(200).json({
        message: 'Cập nhật đơn mượn thành công!',
        loan: updated
      });
    } catch (err) {
      // Nếu service ném lỗi có statusCode, trả về lỗi thích hợp
      const status = err.statusCode || 500;
      res.status(status).json({ message: err.message });
    }
  };
