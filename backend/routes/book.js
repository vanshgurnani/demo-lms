const express = require('express');
const router = express.Router();
const Book = require('../model/book');

const cors = require('cors');


router.use(cors({
  origin: ['http://localhost:3000',
  'https://demo-lms-36b7.vercel.app',
  'https://lms.ptcnanveejdaund.in'

], // Specify the allowed origin
  methods: ['GET', 'DELETE','PUT','POST']
  // You can include other options as needed
}));


router.get('/',async (req,res)=>{
    res.send("Welcome to the LMS-Book API");
})

router.get('/getBook',async (req,res)=>{
    try{
        const book = await Book.find({}).sort({reg_no:1});
    
        res.json(book);
    }
    catch(error){
        console.error('Error fetching:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


router.post('/postBook', async (req, res) => {
    try {

      const { name, reg_no, price, quantity } = req.body;
  
      
      const newBook = new Book({
        name,
        reg_no,
        price,
        quantity,
        available: quantity
      });
  
      
      const savedBook = await newBook.save();
  
      res.status(201).json(savedBook);
    } catch(error){
        console.error('Error fetching:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/deleteBook/:reg_no', async (req, res) => {
    try {
      const bookRegNo = req.params.reg_no;
      const deletedBook = await Book.deleteOne({ reg_no: bookRegNo });
      
      if (deletedBook) {
        res.json({ message: 'Book deleted successfully', deletedBook });
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // router.get('/getBook/:reg_no',async(req,res)=>{
  //   const bookRegNo = req.params.reg_no;
  //   const book = await Book.findOne({reg_no: bookRegNo});
  //   res.json(book);
  //   alert('Found');
  // })

  router.put('/updateBook/:reg_no', async (req, res) => {
    const regNo = req.params.reg_no;
  
    try {
      // Find the book by registration number
      const book = await Book.findOne({ reg_no: regNo });
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      // Update the book with the new data
      book.name = req.body.name || book.name;
      book.price = req.body.price || book.price;
      book.quantity = req.body.quantity || book.quantity;
  
      // Save the updated book
      await book.save();
  
      res.json({ message: 'Book updated successfully', book });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.get('/getBookByName/:name',async (req,res)=>{
    try{
        const Name = req.params.name;
        const book = await Book.findOne({ name: Name });
        res.json(book);
    }
    catch(error){
        console.error('Error fetching:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

 
  
  router.get('/getBook/:reg_no',async (req,res)=>{
    try{
        const regNo = req.params.reg_no;
        const book = await Book.findOne({ reg_no: regNo });
        res.json(book);
    }
    catch(error){
        console.error('Error fetching:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/validateReg/:reg_no', async (req, res) => {
  try {
    const bookId = req.params.reg_no;
    const book = await Book.findOne({ reg_no: bookId });

    // If a student is found, the ID is taken; otherwise, it's available
    const isIdTaken = !!book;

    res.json({ isIdTaken });
  } catch (error) {
    console.error('Error validating book ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/validateName/:name',async (req,res)=>{
  try{
      const Name = req.params.name;
      const book = await Book.findOne({ name: Name });

      const isIdTaken = !!book;


      res.json({ isIdTaken });
  }
  catch(error){
      console.error('Error fetching:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
})




module.exports = router;