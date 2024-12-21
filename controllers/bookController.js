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

exports.createBook = async (req, res) => {
    try {
        const { title, author, topic, subcaterory, tag, publisher, publication_year, edition, summary, language, cover } = req.body;

        // Lấy BookID cao nhất từ cơ sở dữ liệu
        const lastBook = await Book.findOne().sort({ BookID: -1 }).exec();
        const newBookID = lastBook ? lastBook.BookID + 1 : 1; // Nếu không có sách nào, bắt đầu từ 1

        const bookData = {
            BookID: newBookID, // Gán BookID mới
            Title: title,
            Author: author,
            Topic: topic,
            Subcaterory: subcaterory,
            Tag: tag,
            Publisher: publisher,
            Publication_year: publication_year,
            Edition: edition,
            Summary: summary,
            Language: language,
            Cover: cover,
            Availability: 'Available', // Mặc định là 'Available'
            Rating: 5, // Mặc định là 5
            CountBorrow: 0 // Mặc định là 0
        };

        // Gọi hàm tạo sách trong bookService
        const book = await bookService.createBookSV(bookData);

        if (!book) {
            return res.status(200).json({ success: true, data: [] });
        } else {
            return res.status(200).json({ success: true, data: book });
        }
    } catch (error) {
        console.error("Error creating book:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getAllTopic = async (req, res) => {
    try {
        const allTopic = await bookService.getAllTopicSV();
        console.log(allTopic);

        if (!allTopic) {
            return res.status(200).json({ success: true, data: [] });
        } else {
            return res.status(200).json({ success: true, data: allTopic });
        }

    } catch (error) {
        console.error("Error fetching all topics:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};