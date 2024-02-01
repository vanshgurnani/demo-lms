const express = require('express');
const router = express.Router();
const Allot = require('../model/allotBook');
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
    res.send("Welcome to the LMS-allotBook API");
})


router.get('/getAllot', async (req,res)=>{
    try{
        const allot = await Allot.find({}).sort({studentId:1});
        res.json(allot);
    }
    catch(error){
        console.error('Error fetching:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/getAllot/:studentId', async (req,res)=>{
  const studentId = req.params.studentId;
  try{
      const allot = await Allot.findOne({ studentId });
      res.json(allot);
  }
  catch(error){
      console.error('Error fetching:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/getAllotByStudentId/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const allotments = await Allot.find({ studentId });

    res.json(allotments);
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getFilteredAllot', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Use MongoDB query to filter allotments based on date range
    const allotments = await Allot.find({
      borrowedDate: { $gte: startDate },
      expectedReturnDate: { $lte: endDate },
    });

    res.json(allotments);
  } catch (error) {
    console.error('Error fetching filtered allotments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/postAllotBook', async (req, res) => {
  try {
    const { studentId, studentName, studentRole, bookName, bookId, borrowedDate, expectedReturnDate, return_status } = req.body;

    // Check if the book is available
    const allottedBook = await Book.findOne({ name: bookName });

    console.log('Allotted Book:', allottedBook);

    if (!allottedBook || isNaN(allottedBook.quantity) || allottedBook.quantity <= 0) {
      console.log('Book not available for allotment');
      return res.status(400).json({ message: 'Book not available for allotment' });
    }

    // Update the return status of the allotted book
    const newAllotment = new Allot({
      studentId,
      studentName,
      studentRole,
      bookName,
      bookId,
      borrowedDate,
      expectedReturnDate,
      return_status,
    });

    // Update the available quantity of the allotted book in the Book model
    allottedBook.available = allottedBook.available - 1; // Decrease available quantity by 1
    allottedBook.quantity = allottedBook.quantity - 1;
    await allottedBook.save();

    // Save the new allotment
    await newAllotment.save();

    res.status(201).json({ message: 'Book allotted successfully', allotment: newAllotment });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.put('/updateAllot/:studentId', async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // Find the allotment by studentId
    const allot = await Allot.findOne({ studentId });

    if (!allot) {
      return res.status(404).json({ message: 'Allotment not found' });
    }

    // Update the return status with the new data
    allot.return_status = req.body.return_status;

    // Save the updated allotment
    await allot.save();

    // If the return status is true, increment the quantity of the book
    if (allot.return_status) {
      const book = await Book.findOne({ name: allot.bookName });

      if (book) {
        book.quantity += 1;
        book.available += 1;
        await book.save();
      }
    }

    res.json({ message: 'Return status updated successfully', allot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/getAllotNotReturned', async (req, res) => {
  try {
    const allotNotReturned = await Allot.find({ return_status: false });
    res.json(allotNotReturned);
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





module.exports = router;