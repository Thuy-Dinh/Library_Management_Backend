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

exports.createBookSV = async (bookData) => {
    try {
        // Tạo sách mới với dữ liệu đã bao gồm các giá trị mặc định
        const newBook = new BookModel(bookData);

        // Lưu sách vào cơ sở dữ liệu
        const savedBook = await newBook.save();
        return savedBook;
    } catch (error) {
        console.error("Error saving book:", error);
        throw new Error("Error saving book");
    }
};

exports.getAllTopicSV = async () => {
    try {
        const topics = await BookModel.aggregate([
            { $group: { _id: "$Topic" } }, // Nhóm theo trường `Topic`
            { $project: { _id: 0, Topic: "$_id" } } // Chỉ lấy giá trị `Topic`
        ]);
        return topics.map(item => item.Topic); // Trả về mảng các `Topic`
    } catch (error) {
        console.error("Error in getAllTopicSV:", error);
        throw error;
    }
};

