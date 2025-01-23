const mongoose = require('mongoose');
const BookModel = require("../models/Book");
const CategoryModel = require("../models/Category");

exports.bookDetailSV = async(bookID) => {
    const book = await BookModel.findById({ _id: bookID });
    console.log(book);
    return book;
}

exports.proposeBookSV = async (bookID) => {
    try {
        // Tìm sách theo ID
        const book = await BookModel.findById({ _id: bookID }).populate('Category');
        if (!book) {
            throw new Error('Không tìm thấy sách với ID đã cho');
        }

        // Tìm các sách cùng Category nhưng loại trừ sách hiện tại
        const sameCategoryBooks = await BookModel.find({
            Category: book.Category._id, // Sử dụng CategoryID để so sánh
            _id: { $ne: bookID } // Loại trừ sách hiện tại
        }).populate('Category'); // Thêm thông tin chi tiết về Category nếu cần

        return sameCategoryBooks;
    } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách sách đề xuất');
    }
};

exports.getAllBookSV = async () => {
    try {
        // Sử dụng populate để lấy thông tin Category thông qua CategoryID
        return await BookModel.find({}).populate('Category');
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

        // Cập nhật số lượng sách trong Category
        await CategoryModel.findByIdAndUpdate(
            bookData.Category,  // Sử dụng Category ID đã được chuyển thành ObjectId
            { $inc: { Quantity: 1 } },
            { new: true } // Trả về đối tượng cập nhật
        );

        // Trả về sách đã được populate với Category
        const populatedBook = await BookModel.findById(savedBook._id).populate('Category');
        return populatedBook;
    } catch (error) {
        console.error("Error saving book:", error);
        throw new Error("Error saving book");
    }
};

exports.editBookSV = async ({
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
    cover
}) => {
    console.log(id,
        title,
        author,
        subcategory,
        tag,
        publisher,
        publication_year,
        edition,
        summary,
        language);
    try {
        const updatedBook = await BookModel.findByIdAndUpdate(
            id, // ID sách
            {
                Title: title, 
                Author: author, 
                Subcategory: subcategory, 
                Tag: tag,
                Publisher: publisher, 
                Publication_year: publication_year, 
                Edition: edition, 
                Summary: summary, 
                Language: language,
                Cover: cover
            },
            { new: true } // Trả về tài liệu sau khi cập nhật
        );

        console.log(updatedBook);
        return updatedBook;
    } catch (error) {
        console.error("Error updating book:", error);
        throw new Error("Error updating book");
    }
};

exports.deleteBookSV = async (bookID) => {
    try {
        // Tìm và xóa sách bằng ID
        const deletedBook = await BookModel.findOneAndDelete({ _id: bookID });

        if (deletedBook) {
            // Giảm số lượng sách trong Category
            await CategoryModel.findByIdAndUpdate(
                deletedBook.Category, // ID của category liên quan
                { $inc: { Quantity: -1 } } // Giảm Quantity đi 1
            );
        }

        return deletedBook; // Trả về sách đã xóa (hoặc null nếu không tìm thấy)
    } catch (error) {
        console.error("Error deleting book:", error);
        throw new Error("Error deleting book");
    }
};

exports.getAllTopicSV = async () => {
    try {
        return await CategoryModel.find({});
    } catch (error) {
        console.error("Error in getAllTopicSV:", error);
        throw error;
    }
};

exports.createTopicSV = async (topicData) => {
    try {
        // Tạo một Category mới
        const newCategory = new CategoryModel({
            Name: topicData.topic,
            Quantity: 0, // Số lượng mặc định là 0
        });

        // Lưu Category mới vào cơ sở dữ liệu
        const savedCategory = await newCategory.save();

        return savedCategory;
    } catch (error) {
        console.error("Lỗi khi lưu chủ đề:", error);
        throw new Error("Lỗi khi lưu chủ đề");
    }
};


exports.searchByCategorySV = async (topics) => {
    try {
        // Xử lý danh sách topics được truyền vào
        const categoryObjects = await CategoryModel.find({ Name: { $in: topics.map(t => new RegExp(t, 'i')) } });
        if (!categoryObjects || categoryObjects.length === 0) {
            console.log("No categories found with the given topics.");
            return [];
        }

        // Lấy danh sách _id của các category tìm được
        const categoryIds = categoryObjects.map(category => category._id);

        // Tìm sách thuộc một trong các category tìm được
        const books = await BookModel.find({ Category: { $in: categoryIds } });
        return books;
    } catch (error) {
        console.error("Error in searchByCategorySV:", error);
        throw error;
    }
};

exports.searchSuggestionSV = async (keyword) => {
    try {
        const suggestions = await BookModel.find()
            .populate({
                path: 'Category',
                select: 'Name', // Chỉ lấy trường Name trong Category
            })
            .limit(10)
            .exec();

        // Lọc kết quả sau khi populate
        const filteredSuggestions = suggestions.filter((book) => {
            const titleMatch = book.Title?.toLowerCase().includes(keyword.toLowerCase());
            const authorMatch = book.Author?.toLowerCase().includes(keyword.toLowerCase());
            const categoryMatch = book.Category?.Name?.toLowerCase().includes(keyword.toLowerCase());

            return titleMatch || authorMatch || categoryMatch;
        });

        return filteredSuggestions.map((book) => ({
            Title: book.Title,
            Author: book.Author,
            Category: book.Category?.Name || null,
        }));
    } catch (error) {
        console.error("Error in searchSuggestionSV:", error);
        throw error;
    }
};

exports.searchResultSV = async (keyword) => {
    try {
        const suggestions = await BookModel.find()
            .populate({
                path: 'Category',
                select: 'Name', // Chỉ lấy trường Name trong Category
            })
            .limit(10)
            .exec();

        // Lọc kết quả sau khi populate
        const filteredSuggestions = suggestions.filter((book) => {
            const titleMatch = book.Title?.toLowerCase().includes(keyword.toLowerCase());
            const authorMatch = book.Author?.toLowerCase().includes(keyword.toLowerCase());
            const categoryMatch = book.Category?.Name?.toLowerCase().includes(keyword.toLowerCase());
            const subcategoryMatch = book.Subcategory?.toLowerCase().includes(keyword.toLowerCase());
            const tagMatch = book.Tag?.toLowerCase().includes(keyword.toLowerCase());

            return titleMatch || authorMatch || categoryMatch || subcategoryMatch || tagMatch;
        });

        return filteredSuggestions.map((book) => ({
            ...book.toObject(), // Trả về tất cả thông tin của tài liệu
        }));
    } catch (error) {
        console.error("Error in searchSuggestionSV:", error);
        throw error;
    }
};