const express = require("express");
const router = express.Router();
const books = require("../models/books");
const multer = require("multer");
const fs = require("fs");

//image upload
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "./uploads");   
     },
    
        filename:function(req,file,cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    },
});
var upload = multer({
    storage:storage,
}).single("image");

// Insert a book into database route
router.post("/add", upload,(req,res) => {
    const book = new books({
        title: req.body.title,
        authorname: req.body.author,
        genre: req.body.genre,
        body: req.body.body,
        Image:req.file.filename,

    });
    book.save((err) => {
        if(err){
            res.json({message: err.message, type: 'danger'});
        } else{
            req.session.message = {
                type:"success",
                message:"Book added successfully!"
            };
            res.redirect("./index");
        }
    })
});


//get all book route
router.get("/index",(req,res) => {
    books.find().exec((err, books) => {
        if(err){
            res.json({ message: err.message });
        } else {
            res.render('index', {
                title:'Home Page',
            books:books,            })
        }
    })
})



router.get("/add",(req,res) => {
    res.render("add_books", { title : "Add Books"});
});
//Edit a book route
router.get('/edit/:id', (req,res) =>{
    let id = req.params.id;
    books.findById(id, (err, books) =>{
        if(err){
            res.redirect("/index");
        } else {
            if(books == null){
                res.redirect("/index");
            } else {
                res.render('edit_books', {
                    title:'Edit Books',
                    books:books, 

                });
            }
        }
    });
});


//update book route
router.post('/update/:id', upload,(req,res) => {
    let id = req.params.id;
   let new_image = "";

   if(req.file){
       new_image = req.file.filename;
       try{
           fs.unlinkSync("./uploads/"+ req.body.old_image);
       }catch(err){
           console.log(err);
       }
    } else {
        new_image = req.body.old_image;
    }
    books.findByIdAndUpdate(id, {
        title: req.body.title,
        authorname: req.body.author,
        genre: req.body.genre,
        body: req.body.body,
        Image:new_image,
    } , (err ,result) =>{
        if(err){
            res.json({ message: err.message, type:'danger'});
        } else {
            req.session.message = {
                type :"success",
                message: "Book updated successfully!",
            };
            res.redirect("/index");
        }
    }
    );
});


//Delete book route
router.get('/delete/:id', (req,res) => {
    let id = req.params.id; 
    books.findByIdAndRemove(id, (err, result) => {
        if(result.Image != ''){
            try{
                fs.unlinkSync('./uploads/'+ result.Image);
            } catch(err){
                console.log(err);
            }
        }
        if(err){
            res.json({ message: err.message});
        } else{
            req.session.message ={
                type : 'info',
                message: 'book deleted successfully!'
            } ;
            res.redirect("/index");
        }
        
       
    });

});

module.exports = router;