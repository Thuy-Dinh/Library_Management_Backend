const bookService = require("../services/bookService");
const Book = require("../models/Book");

exports.bookFavorite = async (req, res) => {
    try {
        // Lấy ra tối đa 30 quyển sách có Rating cao nhất
        const topBooks = await Book.find()
          .sort({ Rating: -1 }) // Sắp xếp giảm dần theo Rating
          .limit(15);           // Giới hạn tối đa 30 quyển
    
        // Trả về dữ liệu dưới dạng JSON
        res.status(200).json({ success: true, data: topBooks });
    } catch (error) {
    console.error("Error fetching top-rated books:", error);
    res.status(500).json({ success: false, message: "Server error" });
    }
}

exports.bookLastest = async (req, res) => {
    try {
        // Lấy ra tối đa 30 quyển sách được thêm vào gần đây nhất
        const latestBooks = await Book.find()
          .sort({ _id: -1 }) // Sắp xếp giảm dần theo `_id` để lấy tài liệu mới nhất
          .limit(15);         // Giới hạn tối đa 30 quyển
    
        // Trả về dữ liệu dưới dạng JSON
        res.status(200).json({ success: true, data: latestBooks });
    } catch (error) {
    console.error("Error fetching latest books:", error);
    res.status(500).json({ success: false, message: "Server error" });
    }
}

exports.bookDetail = async (req, res) => {
    try {
        const bookID = req.params.id;

        if (!bookID) {
            return res.status(400).json({ error: "ID không hợp lệ" });
        }
        const bookDetail = await bookService.bookDetail(bookID);

        if (!bookDetail) {
            return res.status(404).json({ message: `Không tìm thấy sách với ID ${bookID}`, status: "error" });
        }

        return res.status(200).json({ bookDetail });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
}

exports.proposeBook = async (req, res) => {
    try {
        const bookID = req.params.id;

        if (!bookID) {
            return res.status(400).json({ error: "ID không hợp lệ" });
        }
        const bookProposes = await bookService.proposeBook(bookID);

        if (!bookProposes) {
            return res.status(404).json({ message: `Không tìm thấy sách với ID ${bookID}`, status: "error" });
        }

        return res.status(200).json({ bookProposes });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
}

exports.getAllBook = async (req, res) => {
    try {
        const allBook = await bookService.getAllBookSV();

        if (!allBook) {
            return res.status(200).json({ success: true, data: [] });
        } else {
            return res.status(200).json({ success: true, data: allBook });
        }

    } catch (error) {
        console.error("Error fetching all books:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};