
const mongoose = require("mongoose");
//var bookSchema = mongoose.Schema;
const BookSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    authorname: {
        type:String,
        required:true,
    },
    genre: {
        type:String,
        required:true,
    },
    body: {
        type:String,
        required:true,
    },
    Image: {
        type:String,
        required:true,
    },
    created: {
        type:Date,
        required:true,
        default:Date.now,
    },
});
module.exports = mongoose.model("book",BookSchema);
// module.exports = mongoose.model("Book", BookSchema);