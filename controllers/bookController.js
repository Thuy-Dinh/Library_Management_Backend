const bookService = require("../services/bookService");
const Book = require("../models/Book");
const CategoryModel = require("../models/Category");

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

        console.log(bookID);
        if (!bookID) {
            return res.status(400).json({ error: "ID không hợp lệ" });
        }
        const bookDetail = await bookService.bookDetailSV(bookID);
        console.log(bookDetail);

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
        const bookProposes = await bookService.proposeBookSV(bookID);

        if (!bookProposes) {
            return res.status(404).json({ message: `Không tìm thấy sách với ID ${bookID}`, status: "error" });
        }
        
        console.log(bookProposes);

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

// Hàm tạo mã BookCode
function generateBookCode(book) {
    const removeDiacritics = (str) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const getAcronym = (title) => {
      return removeDiacritics(title)
        .split(/\s+/)
        .map((word) => word[0]?.toUpperCase())
        .join("");
    };
    return `${getAcronym(book.Title)}${book.Publication_year}`;
}
  
exports.createBook = async (req, res) => {
    try {
      const {
        title,
        author,
        topic,
        subcategory,
        tag,
        publisher,
        publication_year,
        edition,
        summary,
        language,
        cover,
        area,
        shelf,
        slot,
        price,
      } = req.body;
  
      // Tìm Category ID
      let categoryID = null;
      if (topic) {
        const category = await CategoryModel.findOne({ Name: topic });
        if (!category) {
          return res
            .status(400)
            .json({ success: false, message: "Category không tồn tại" });
        }
        categoryID = category._id;
      }
      if (!categoryID) {
        return res
          .status(400)
          .json({ success: false, message: "Category không xác định" });
      }
  
      // Tạo BookID mới
      const lastBook = await Book.findOne().sort({ BookID: -1 }).exec();
      const newBookID = lastBook ? lastBook.BookID + 1 : 1;
  
      // Chuẩn bị dữ liệu lưu
      const bookData = {
        BookID: newBookID,
        Title: title,
        Author: author,
        Category: categoryID,
        Subcategory: subcategory,
        Tag: tag,
        Publisher: publisher,
        Publication_year: publication_year,
        Edition: edition,
        Summary: summary,
        Language: language,
        Cover: cover,
        Availability: "Available",
        Rating: 0, // sẽ cập nhật bên dưới
        CountBorrow: 0,
        Price: price,
        Location: {
          area: area || "",
          shelf: shelf || "",
          slot: slot || "",
        },
      };
  
      // Tạo BookCode và Rating ngẫu nhiên
      bookData.BookCode = generateBookCode(bookData);
      bookData.Rating = parseFloat(
        (Math.random() * (5 - 3) + 3).toFixed(1)
      ); // ví dụ: 3.7
  
      // Tạo sách trong DB
      const book = await bookService.createBookSV(bookData);
      if (!book) {
        return res
          .status(500)
          .json({ success: false, message: "Không thể tạo sách" });
      }
  
      return res.status(201).json({ success: true, data: book });
    } catch (error) {
      console.error("Error creating book:", error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi máy chủ" });
    }
};    

exports.editBook = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, 
            author, 
            subcategory, 
            tag,
            publisher, 
            publication_year, 
            edition, 
            summary, 
            language,
            state,
            cover,
            area,      // thêm mới
            shelf,     // thêm mới
            slot       // sửa từ "floor" → "slot" cho đúng schema
        } = req.body;

        const updatedBook = await bookService.editBookSV({
            id,
            title,
            author,
            subcategory,
            tag,
            publisher,
            publication_year,
            edition,
            summary,
            language,
            state,
            cover,
            location: { area, shelf, slot } // gộp vào Location
        });

        if (!updatedBook) {
            return res.status(500).json({ success: false, message: "Không thể chỉnh sửa sách" });
        }

        return res.status(200).json({ success: true, data: updatedBook });
    } catch (error) {
        console.error("Error editing book:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const { bookID } = req.params; // Lấy bookID từ URL

        const deletedBook = await bookService.deleteBookSV(bookID);

        if (!deletedBook) {
            return res.status(404).json({ success: false, message: "Sách không tồn tại" });
        }

        return res.status(200).json({ success: true, message: "Xóa sách thành công", data: deletedBook });
    } catch (error) {
        console.error("Error deleting book:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
};

exports.getAllTopic = async (req, res) => {
    try {
        // Lấy tất cả các chủ đề (topics)
        const allTopic = await bookService.getAllTopicSV();

        // Nếu không có topic nào
        if (!allTopic || allTopic.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        } else {
            // Duyệt qua các topic và lấy cover của sách đầu tiên trong mỗi topic
            const topicWithBooks = await Promise.all(allTopic.map(async (topic) => {
                // Giả sử mỗi topic có trường _id, tìm các sách với topic này
                const books = await Book.find({ Category: topic._id }).select('Cover'); // Lấy cover của sách

                // Nếu có sách, lấy cover của sách đầu tiên
                const cover = books.length > 0 ? books[0].Cover : null;

                return {
                    id: topic._id,
                    topic: topic.Name,  // Hoặc tên topic tùy vào cấu trúc của bạn
                    cover: cover        // Chỉ trả về cover của quyển sách đầu tiên
                };
            }));

            // Trả về thông tin topic và cover của sách đầu tiên
            return res.status(200).json({ success: true, data: topicWithBooks });
        }

    } catch (error) {
        console.error("Error fetching all topics:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.createTopic = async (req, res) => {
    const topic = req.body.topic;
    try {
        // Tạo topic mới bằng service
        const newTopic = await bookService.createTopicSV(topic);

        if (!newTopic) {
            return res.status(404).json({ success: false, message: "Không thể tạo chủ đề" });
        }

        return res.status(200).json({ success: true, data: newTopic });
    } catch (error) {
        console.error("Lỗi khi tạo chủ đề:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
};

exports.getCategory = async (req, res) => {
    const { id } = req.params;
    try {
      const category = await bookService.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy chuyên mục' });
      }
      res.json({ success: true, data: category });
    } catch (err) {
      console.error('Lỗi getCategory:', err);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

exports.searchByCategory = async (req, res) => {
    try {
        console.log(req.query);
        const topics = req.query.topics ? JSON.parse(req.query.topics) : [req.query.category || Object.keys(req.query)[0]];
        console.log("Topics received:", topics);

        if (!topics || topics.length === 0) {
            return res.status(400).json({ success: false, message: "No topics provided" });
        }

        const allBooks = await bookService.searchByCategorySV(topics);

        if (!allBooks || allBooks.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        } else {
            return res.status(200).json({ success: true, data: allBooks });
        }

    } catch (error) {
        console.error("Error fetching all topics:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.searchSuggestion = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword || keyword.trim() === '') {
            return res.status(400).json({ error: 'Keyword is required' });
        }

        const results = await bookService.searchSuggestionSV(keyword);
        console.log(results);

        return res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.searchResult = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword || keyword.trim() === '') {
            return res.status(400).json({ error: 'Keyword is required' });
        }

        const results = await bookService.searchResultSV(keyword);
        console.log(results);

        return res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.searchBookByOtherField = async (req, res) => {
    try {
        const inform = req.query;
        const books = await bookService.searchBookByOtherFieldSV(inform);
        return res.json(books);
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ message: 'Lỗi tìm kiếm sách', error });
    }
};

exports.getAllAreas = async (req, res) => {
    try {
      const areas = await bookService.getAllAreas();
      res.status(200).json({ areas });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi server khi lấy khu vực" });
    }
};

exports.recommendBooks = async (req, res) => {
    try {
      const { accountId } = req.params;
      const result = await bookService.getRecommendedBooks(accountId);
      res.json(result);
    } catch (error) {
      console.error('Recommend error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

exports.addReview = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { userId, rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating phải từ 1 đến 5' });
        }

        const book = await bookService.addBookReview(bookId, userId, rating, comment);
        res.status(200).json({ message: 'Đánh giá thành công', book });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};