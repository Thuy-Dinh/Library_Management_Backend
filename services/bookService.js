const BookModel = require("../models/Book");

exports.bookDetail = async(bookID) => {
    return await BookModel.findById({ _id: bookID });
}

exports.proposeBook = async (bookID) => {
    try {
        const book = await BookModel.findById({_id: bookID});
        
        if (!book) {
            throw new Error('Không tìm thấy sách với ID đã cho');
        }

        const sameTopicBooks = await BookModel.find({
            Topic: book.Topic,   
            _id: { $ne: bookID } // Loại trừ sách hiện tại
        });

        return sameTopicBooks;
    } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách sách đề xuất');
    }
};

exports.getAllBookSV = async () => {
    try {
        return await BookModel.find({});
    } catch (error) {
        console.error("Error in getAllBookSV:", error);
        throw error;
    }
};


