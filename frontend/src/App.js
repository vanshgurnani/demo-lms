import "./App.css";
import "./Components/Login.css";
import "./Components/Navbar.css";
import Dashboard from "./Components/BookEdit";
import { useState, useEffect } from "react";
import axios from "axios";
import React, { useMemo, useRef } from "react";
import { MaterialReactTable } from "material-react-table";
import satyamev from "./satyamev.png"
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  MenuItem,
  Menu
} from "@mui/material";
import { Dialog } from "@mui/material";
import logoLogin from "./login_logo1.png";
import logo from "./Police_logo.png";
import CategorySearch from "./Components/CategorySearch";
import Papa from 'papaparse';


function App() {

  const [tab, setTab] = useState("home");
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [allotList, setAllotList] = useState([]);
  const [allotBooksList, setAllotBooksList] = useState([]);
  const [searchAllotId, setSearchAllotId] = useState("");
  const [allotStudentName, setAllotStudentName] = useState("");
  const [addStudentError, setAddStudentError] = useState("");
  const [addBookError, setAddBookError] = useState("");
  const [studentSubmit, setStudentSubmit] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openStudent, setOpenStudent] = React.useState(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [loginState, setLoginState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

 
  useEffect(() => {
    if (!loginState) {
      setTab("login");
      let user = localStorage.getItem("user");
      if (user) {
        setTab("home");
      }
    }
  }, []);

  var ifBookExists = false;
  var mobileNumberInvalid = true;
  const [studentDetails, setStudentDetails] = useState({
    student_id: "",
    student_name: "",
    student_phone: "",
    student_role: "",
    student_batch: "",
    student_id_db: "",
  });
  const [bookDetails, setBookDetails] = useState({
    book_id: "",
    book_id_db: "",
    book_name: "",
    book_price: 0,
    book_quantity: 0,
    book_reg : ""
  });
  const [editBookDetails, setEditBookDetails] = useState({
    book_name: "",
    book_reg : "",
    book_price: 0,
    book_quantity: 0,
    book_id_db: "",
  });
  const [editStudentDetails, setEditStudentDetails] = useState({
    student_id: "",
    student_name: "",
    student_role: "",
    student_phone: "",
    student_batch: "",
    student_id_db: "",
  });


  const [allotDetails, setAllotDetails] = useState({
    studentId: "",  // Match the key names with the data structure
    studentName: "",
    bookId: null,
    bookReg: null,
    bookName: '',
    borrowedDate: 0,
    expectedReturnDate: 0,
    return_status: false,
});

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  


// student form onchange

  const handleStudentChange = (e) => {
    if (!studentDetails.student_phone.match(/^(\+\d{1,2}\s)?[6-9]\d{9}$/)) {
      mobileNumberInvalid = false;
    } else {
      mobileNumberInvalid = true;
    }
    

    console.log("check number" , mobileNumberInvalid)
    if (e.target.name === "student_id") {
      if (students.length > 1) {
        const student = students.find(
          (student) => student.student_id === e.target.value
        );
        if (student) {
          setStudentSubmit(false);
          setAddStudentError("Id is taken");
          setStudentDetails((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        } else {
          setStudentSubmit(true);
          if (e.target.value === "") {
            setAddStudentError("");
            setStudentDetails((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }));
          } else {
            setStudentDetails((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }));
          }
        }
      } else {
        setStudentSubmit(true);
        if (e.target.value === "") {
          setAddStudentError("");
          setStudentDetails((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        } else {
          setStudentDetails((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        }
      }
    } else {
      setStudentDetails((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

// book form onchange

  const handleBookChange = (e) => {
    let a = e.target.value[e.target.value.length - 1];
    // if (isNaN(a)) {
    setBookDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // }
  };

  // allot form onchange

  
  async function bookExistenceName(event) {
    const bookName = event.target.value;
  
    try {
      const response = await axios.get(`https://demo-lms.vercel.app/book/validateName/${bookName}`);
      const {isIdTaken} = response.data;
  
      if (isIdTaken) {
        setAddBookError('Book exists');
      } else {
        console.log('Book does not exist');
      }
    } catch (error) {
      console.error('Error:', error);
      console.log('Error checking book existence');
    }
  } 

  async function bookExistenceId(event){
    const reg_no = event.target.value;

    try {
      const response = await axios.get(`https://demo-lms.vercel.app/book/validateReg/${reg_no}`);
      const {isIdTaken} = response.data;
  
      if (isIdTaken) {
        setAddBookError('Book registration exists');
      } else {
        setAddBookError('Book is available');
      }
    } catch (error) {
      console.error('Error:', error);
      console.log('Error checking book existence');
    }



  }


  async function studentExistenceId(event) {
    const student_id = event.target.value;
  
    try {
      const response = await axios.get(`https://demo-lms.vercel.app/student/validateId/${student_id}`);
      const { isIdTaken } = response.data;
  
      if (isIdTaken) {
        setAddStudentError('ID is taken');
        // Handle ID taken logic (e.g., show an error message)
      } else {
        setAddStudentError('ID is available');
        // Handle ID available logic
      }
    } catch (error) {
      console.error('Error validating student ID:', error);
      // Handle error (e.g., show an error message)
    }
  }
  


  



  // student table 
  const studentTable = () => {
    return students;
  };
  const studentObjects = studentTable();

  // book table 
  const BooksTable = () => {
    console.log("books count " , books)
    return books;
  };
  const bookObjects = BooksTable();

  // allot table
  const AllotTable = () => {
    if (searchAllotId === "") {
      // console.log(history);
      return history;
    } else {
      return history.filter(
        (allot) => allot.student_id === parseInt(searchAllotId)
      );
    }
  };
  const allotObjects = AllotTable();



  const lendingHistory = () => {
    console.log("history array :"  ,history)
    return history;
  };

  var historyObjects = lendingHistory();


  const filterSearchId = async (e) => {
    setSearchAllotId(e.target.value);
    let historyArr = [];
  
    try {
      if (e.target.value === "") {
        // If the search value is empty, fetch all allotments
        const response = await axios.get('https://demo-lms.vercel.app/allot/getAllot');
        historyArr = response.data;
      } else {
        // If there is a search value, fetch allotments for the specific student ID
        const response = await axios.get(`https://demo-lms.vercel.app/allot/getAllotByStudentId/${e.target.value}`);
        historyArr = response.data;
      }
  
      // Update state with the fetched data
      setHistory(historyArr);
    } catch (error) {
      console.error('Error fetching allotments:', error);
    }
  };
  

  


  // adding a student 

  const handleStudentSubmit = async (e) => {
    e.preventDefault();

    if (
        studentDetails.student_id !== "" &&
        studentDetails.student_name !== "" &&
        studentDetails.student_role !== "" &&
        studentDetails.student_phone !== "" 
    ) {
        if (!studentDetails.student_phone.match(/^(\+\d{1,2}\s)?[6-9]\d{9}$/)) {
            mobileNumberInvalid = false;
            alert("Enter a valid number");
        } else {
            try {
              // https://demo-lms.vercel.app
                console.log("studentDetails before ---->", studentDetails);

                // Make a POST request to your Express server
                const response = await axios.post('https://demo-lms.vercel.app/student/postStudent', {
                    id: studentDetails.student_id,
                    name: studentDetails.student_name,
                    role: studentDetails.student_role ,  // Assuming 'role' is a required field and set it to 'student'
                    phone: studentDetails.student_phone,
                    batch: studentDetails.student_batch,
                });

                console.log('MongoDB API Response:', response.data);

                // Get the list of students based on the role
                getStudents(studentDetails.student_role);

                // Set the tab based on the role
                if (studentDetails.student_role === "staff") {
                  setTab("staff");
                } else {
                  setTab("students");
                }


                setStudentDetails({
                    student_id: "",
                    student_name: "",
                    student_role: "",
                    student_phone: "",
                    student_batch: "",
                    student_id_db: "",
                });
            } catch (err) {
                console.error('Error adding student:', err);
                alert("Cannot add student");
            }
        }
    } else {
        alert("Please fill in all form values");
    }
};

  // get student

  const getStudents = async (role) => {
    try {
      const response = await axios.get(`https://demo-lms.vercel.app/student/getRole/${role}`);
      const students = response.data;
      console.log(students);
  
      setStudents(students);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately, e.g., show a message to the user
    }
  };

  // delete student  

  const handleDeleteStudent = async (studentId) => {
    try {
      console.log("Deleting student with ID:", studentId);
      if (studentId) {
        // Make an Axios DELETE request to your server endpoint
        const response = await axios.delete(`https://demo-lms.vercel.app/student/deleteStudent/${studentId}`);
        console.log("Delete response:", response.data);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  
    // After deletion, refresh the list of students
    getStudents();
    setTab("students");
  };

  const handleFieldChange = (fieldName, value) => {
    setEditStudentDetails((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  
  // student edit

  const handleEditStudentSubmit = async (studentId) => {
    console.log('handleEditStudentSubmit called');

    try {
        if (studentId) {
            // Make an Axios PUT request to your server endpoint for updating a student
            const response = await axios.put(`https://demo-lms.vercel.app/student/updateStudent/${studentId}`, {
                // Assuming editStudentDetails is an object with updated student details
                id:editStudentDetails.student_id,
                name: editStudentDetails.student_name,
                phone: editStudentDetails.student_phone,
                batch: editStudentDetails.student_batch,
            });

            console.log('Update response:', response.data);
            
            // After updating, refresh the list of students
            getStudents();
            setTab("students");
            setOpenStudent(false);
        }
    } catch (error) {
        console.error('Error updating student:', error);
    }
};

  // student onchange

  const handleEditStudent = async (studentId) => {
    try {
      // Make a request to fetch the student details by their ID
      const response = await fetch(`https://demo-lms.vercel.app/student/getId/${studentId}`);
      const studentData = await response.json();
      
      if (response.ok) {
        // Check if the student data is not empty
        if (studentData) {
          // Open the edit dialog and set the editStudentDetails
          setOpenStudent(true);
          setEditStudentDetails({
            student_id: studentData.id,
            student_name: studentData.name,
            student_phone: studentData.phone,
            student_batch: studentData.batch,
            // Add other fields as needed
          });
        } else {
          console.error('Student not found with ID:', studentId);
        }
      } else {
        // Handle error if the request was not successful
        console.error('Failed to fetch student details:', studentData);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };
  
  // student column
  
  

  const studentColumns = useMemo(
    () => [
      {
        accessorKey: "id", //simple recommended way to define a column
        header: "Student ID",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "name", //simple recommended way to define a column
        header: "Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "phone", //simple recommended way to define a column
        header: "Phone",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "role", //simple recommended way to define a column
        header: "Role",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "batch", //simple recommended way to define a column
        header: "Batch",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      }
    ],
    []
  );


  const staffColumns = useMemo(
    () => [
      {
        accessorKey: "id", //simple recommended way to define a column
        header: "Student ID",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "name", //simple recommended way to define a column
        header: "Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "phone", //simple recommended way to define a column
        header: "Phone",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "role", //simple recommended way to define a column
        header: "Role",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      }
    ],
    []
  );
  
  // get books

  const getBooks = async () => {
    try {
      const response = await axios.get(`https://demo-lms.vercel.app/book/getBook`);
      const books = response.data;
      console.log(books);
  
      setBooks(books);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately, e.g., show a message to the user
    }
  };

  // add books

  const handleBookSubmit = async (e) => {
    e.preventDefault();

    if (
        bookDetails.name !== "" &&
        bookDetails.reg_no !== "" &&
        bookDetails.price !== "" &&
        bookDetails.quantity !== ""
    ) {
        try {
            console.log("bookDetails before ---->", bookDetails);

            // Make a POST request to your Express server for adding a book
            const response = await axios.post('https://demo-lms.vercel.app/book/postBook', {
                name: bookDetails.book_name,
                reg_no: bookDetails.book_reg,
                price: bookDetails.book_price,
                quantity: bookDetails.book_quantity,
            });

            console.log('MongoDB API Response:', response.data);

            getBooks(); // Assuming getBooks is a function to fetch and update the book list
            setTab("books");
            setBookDetails({
                book_name: "",
                book_reg: "",
                book_price: "",
                book_quantity: "",
            });
        } catch (err) {
            console.error('Error adding book:', err);
            alert("Cannot add book");
        }
    } else {
        alert("Please fill in all form values");
    }
};

// delete a book

const deleteBook = async (reg_no) => {
  try {

    // Make an Axios DELETE request to your server endpoint for deleting a book
    const response = await axios.delete(`https://demo-lms.vercel.app/book/deleteBook/${reg_no}`);

    console.log('Delete Book response:', response.data);

    // After deleting, refresh the list of books or perform any other necessary actions
    // (e.g., updating state, re-fetching data)
    getBooks();
    setTab("books");
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};


// onchange for book

const handleEditBookChange = (e) => {
  const { name, value } = e.target;
  setEditBookDetails((prevDetails) => ({
    ...prevDetails,
    [name]: value,
  }));
};

// edit submission

const handleEditBookSubmit = async (reg_no) => {
  console.log('handleBookSubmit called');

  try {
    if (reg_no) {
      // Make an Axios PUT request to your server endpoint for updating a book
      const response = await axios.put(`https://demo-lms.vercel.app/book/updateBook/${reg_no}`, {
        // Assuming editBookDetails is an object with updated book details
        name: editBookDetails.book_name,
        price: editBookDetails.book_price,
        quantity: editBookDetails.book_quantity,
      });

      console.log('Update response:', response.data);

      getBooks();
      setTab("books");
      setOpen(false);

      // After updating, refresh the list of books or perform any other necessary actions
      // For example, you might call a function like getBooks() to update the book list.
    }
  } catch (error) {
    console.error('Error updating book:', error);
  }
};


// diaglog box getting for edit


const handleEditBook = async (reg_no) => {
  try {
    // Make a request to fetch the book details by registration number
    const response = await fetch(`https://demo-lms.vercel.app/book/getBook/${reg_no}`);
    const bookData = await response.json();

    if (response.ok) {
      // Check if the book data is not empty
      if (bookData) {
        // Open the edit dialog and set the editBookDetails
        setOpen(true);
        setEditBookDetails({
          book_reg: bookData.reg_no,
          book_name: bookData.name,
          book_price: bookData.price,
          book_quantity: bookData.quantity,
          // Add other fields as needed
        });
      } else {
        console.error('Book not found with registration number:', reg_no);
      }
    } else {
      // Handle error if the request was not successful
      console.error('Failed to fetch book details:', bookData);
    }
  } catch (error) {
    console.error('Error fetching book details:', error);
  }
};



// Book columns

  const bookColumns = useMemo(
    () => [
      {
        accessorKey: 'reg_no', //simple recommended way to define a column
        header: 'Reg No',
        muiTableHeadCellProps: { sx: { color: 'green' } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "name", //simple recommended way to define a column
        header: "Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "price", //simple recommended way to define a column
        header: "Price",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "quantity", //simple recommended way to define a column
        header: "Quantity",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "available", //simple recommended way to define a column
        header: "Available Quantity",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
    ],
    []
  );


 
  // get allot history


  const getHistory = async () => {
    try {
      const response = await axios.get(`https://demo-lms.vercel.app/allot/getAllot`);
      const allots = response.data;

      setHistory(allots);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately, e.g., show a message to the user
    }
  };
  
  
  // change the return status



  const handleAllotSubmit = async (e) => {
    e.preventDefault();
    
    // Assuming you have a similar state for allotment details
    if (
      allotDetails.studentId !== "" &&
      allotDetails.studentName !== "" &&
      allotDetails.bookName !== "" &&
      allotDetails.bookId !== "" &&
      allotDetails.borrowedDate !== "" &&
      allotDetails.expectedReturnDate !== ""
      ) {
        try {
          // Make a POST request to your Express server
          const response = await axios.post('https://demo-lms.vercel.app/allot/postAllotBook', {
            studentId: allotDetails.studentId,
            studentName: allotDetails.studentName,
            studentRole: allotDetails.studentRole,
            bookName: allotDetails.bookName,
            bookId: allotDetails.bookId,
            borrowedDate: allotDetails.borrowedDate,
            expectedReturnDate: allotDetails.expectedReturnDate,
            return_status: allotDetails.return_status,
          });
          
          console.log('MongoDB API Response:', response.data);
  
          getHistory(); // Assuming this function fetches the latest allotment history
          alert('Allot done with sucess');
          setTab("history");
          setAllotDetails({
            studentId: "",
            studentName: "",
            studentRole: "",
            bookName: "",
            bookId: "",
            borrowedDate: "",
            expectedReturnDate: "",
          });
        } catch (err) {
          console.error('Error adding allotment:', err);
          alert("Cannot add allotment");
        }
      } else {
        alert("Please fill in all form values");
      }
    };
    

    const handleStudentIdChange = async (enteredStudentId) => {
      setAllotDetails({ ...allotDetails, studentId: enteredStudentId });
    
      if (enteredStudentId) {
        try {
          // Make an API call to fetch student details based on the ID
          const response = await axios.get(`https://demo-lms.vercel.app/student/getId/${enteredStudentId}`);
          const student = response.data;
    
          // Update the state with the fetched student name
          setAllotDetails((prevDetails) => ({
            ...prevDetails,
            studentName: student ? student.name : "", // Set to an empty string if student not found
            studentRole : student ? student.role : ""
          }));
        } catch (error) {
          console.error('Error fetching student details:', error);
        }
      } else {
        // Clear the studentName if the entered ID is empty
        setAllotDetails((prevDetails) => ({ ...prevDetails, studentName: "" }));
      }
    };


    const handleBookNameChange = async (enteredBookName) => {
      setAllotDetails({ ...allotDetails, bookName: enteredBookName });
    
      if (enteredBookName) {
        try {
          const response = await axios.get(`https://demo-lms.vercel.app/book/getBookByName/${enteredBookName}`);
          const book = response.data;
    
          // Update the state with the fetched book ID
          setAllotDetails((prevDetails) => ({
            ...prevDetails,
            bookId: book ? book.reg_no : null,
            bookName: enteredBookName,
          }));
        } catch (error) {
          console.error('Error fetching book details:', error);
        }
      } else {
        // Clear the bookId and bookName if the entered name is empty
        setAllotDetails((prevDetails) => ({ ...prevDetails, bookId: null, bookName: null }));
      }
    };
    


    const handleChangeReturnStatus = async (studentId) => {
      try {
        // Assuming selectedStatus is a boolean value // Convert to boolean
        const newStatus = !allotDetails.return_status; // Toggle the status
    
        alert(studentId);
    
        await axios.put(`https://demo-lms.vercel.app/allot/updateAllot/${studentId}`, {
          return_status: newStatus,
        });
    
        // Update the state with the modified return_status
        setAllotDetails((prevDetails) => ({
          ...prevDetails,
          return_status: newStatus,
        }));
    
        // Fetch the updated history after the return_status is updated
        getHistory();
    
        // Trigger a re-render by setting the tab
        setTab("history");
    
        alert("Update done");
      } catch (error) {
        console.error('Error updating return status:', error);
      }
    };
    
    
    const handleApplyFilter = async () => {
      try {
        // Make an API call to get filtered allotments
        const response = await axios.get(`https://demo-lms.vercel.app/allot/getFilteredAllot?startDate=${startDate}&endDate=${endDate}`);
        const filteredAllotments = response.data;
  
        // Process the filtered allotments as needed
        console.log(filteredAllotments);
  
        // Close the filter dialog
        setHistory(filteredAllotments);
        setOpenFilter(false);
        alert("Filtering Done Successfully");
      } catch (error) {
        console.error('Error applying filter:', error);
      }
    };    




const historyColumns = useMemo(
    () => [
      {
        accessorKey: "studentId", //simple recommended way to define a column
        header: "ID",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "studentName", //simple recommended way to define a column
        header: "Student Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "studentRole", //simple recommended way to define a column
        header: "Student Role",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "bookName", //simple recommended way to define a column
        header: "Book Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "borrowedDate", //simple recommended way to define a column
        header: "Borrowed Date",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => 
        <span>
        {new Date(cell.getValue()).toLocaleDateString()}
        </span>, //optional custom cell render
      },
      {
        accessorKey: "expectedReturnDate", //simple recommended way to define a column
        header: "Expected Return Date",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => 
        <span>
        {new Date(cell.getValue()).toLocaleDateString()}
        </span>, //optional custom cell render
      },
      {
        accessorKey: "return_status", //simple recommended way to define a column
        header: "Return Status",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        // Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
        Cell: ({ cell }) => {
          const isReturned = cell.getValue() === "true";
          return (
            <select
              name={cell.row.original.id}
              value={cell.getValue()}
              
              onChange={(e) => handleChangeReturnStatus(cell.row.original.studentId)}
            >

              <option value="true">Returned</option>
              <option value="false" disabled>Pending</option>
            </select>
          );
        },
      },
    ],
    [history]
  );

  const [rowSelection, setRowSelection] = useState({});

  // useEffect(() => {}, [rowSelection]);

  const bookTableInstanceRef = useRef(null);

 

  function handleClose() {
    setOpen(false);
  }

  function handleCloseStudent() {
    setOpenStudent(false);
  }


  // csv upload logic 


  // const handleCSVUpload = async (e) => {
  //   console.log("Csv Upload");
  //   alert("Csv Upload");
  // };

  const handleStudentCSVUpload = async (result) => {
    try {
      for (let x of result.data) {
        let obj = {};
        if (x.length >= 5) {
          obj.id = parseInt(x[0], 10);
          obj.name = x[1];
          obj.role = x[2];
          obj.phone = x[3];
          obj.batch = x[4];
  
          // Add more properties as needed for student
  
          // Make an API request to upload student data
          const response = await axios.post("https://demo-lms.vercel.app/student/postStudent", obj);
          console.log(response.data); // Log the response from the server
        } else {
          console.error('Invalid data format in CSV row:', x);
        }
      }
    } catch (error) {
      console.error('Error uploading student data:', error);
    }
  };

  const handleBookCSVUpload = async (result) => {
    try {
      for (let i = 1; i < result.data.length; i++) {
        let x = result.data[i];
        let obj = {};
        if (x.length >= 4) {
          obj.name = x[0];
          obj.reg_no = parseInt(x[1], 10);
          obj.price = x[2];
          obj.quantity = parseInt(x[3], 10);
  
          // Add more properties as needed for student
  
          // Make an API request to upload student data
          const response = await axios.post("https://demo-lms.vercel.app/book/postBook", obj);
          console.log(response.data); // Log the response from the server
        } else {
          console.error('Invalid data format in CSV row:', x);
        }
      }
    } catch (error) {
      console.error('Error uploading book data:', error);
    }
  };
  
  
  
  const handleCSVUpload = async (e) => {
    const files = e.target.files;
    let name = e.target.name;
    console.log(name);
  
    if (files) {
      Papa.parse(files[0], {
        complete: async function (result) {
  
          if (name === "student") {
            handleStudentCSVUpload(result);
          } 
          else if (name === "book") {
            handleBookCSVUpload(result);
          } 
          else {
            console.log("Invalid file type");
            return;
          }
  
          e.target.value = null;
          // Reload data from the server or update state as needed
          if (name === "student") {
            getStudents();
            setTab("students");
          } 
          else if (name === "book") {
            getBooks();
            setTab("books");
          }
        },
      });
    }
  
    console.log("CSV Upload");
    alert("CSV Upload");
  };


  // download data logic from allot list

  const getStudentsDownlaod = async () => {
    try {
      // Assume you already have JSON data (replace this with your actual JSON data)
      const response = await axios.get(
        `https://demo-lms.vercel.app/allot/getAllot`
      );

      const jsonData =  response.data;
  
      // Convert JSON data to CSV
      let csvContent = "Student ID,Student Name,Book Name,Borrowed Date,Expected Return Date,Return Status\n";
      jsonData.forEach((record) => {
        let csvRow = [
          record.studentId,
          record.studentName,
          record.bookName,
          new Date(record.borrowedDate).toLocaleDateString(),
          new Date(record.expectedReturnDate).toLocaleDateString(),
          record.return_status,
        ].join(",");
        csvContent += csvRow + "\n";
      });
  
      // Create a Blob containing the CSV content
      const blob = new Blob([csvContent], { type: "text/csv" });
  
      // Create a link to download the CSV file
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = "allot_data.csv";
  
      // Append the link to the document and trigger a click event
      document.body.appendChild(a);
      a.click();
  
      // Remove the link from the document
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  

  const LoginFun = () => {
    let username = "admin";
    let password = "admin@123";

    const login = (event) => {
      event.preventDefault();
      if (
        event.target.elements.username.value == username &&
        event.target.elements.password.value == password
      ) {
        setLoginState(true);
        setTab("home");
        localStorage.setItem("user", event.target.elements.username.value);
      }
    };

    

    return (

    <div className="flex justify-center items-center h-full ">
    <div className="flex flex-col items-center justify-between border shadow-2xl w-full max-w-md p-6 md:w-96 bg-white rounded-lg">
      <div className="flex flex-row items-center mb-4">
      <img src={logo} className="p-2 h-16 xs:h-16 sm:h-20 lg:h-20 mr-6" alt="Logo 1" />
      <img src={logoLogin} className="p-1 h-16 xs:h-16  sm:h-20 lg:h-22" alt="Logo 2" />
      </div>
      <form onSubmit={login} className="login w-full">
        <div className="input-field mb-1">
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your user name"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="input-field mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
        <div className="input-field">
          <button type="submit" className="w-full bg-blue-900 text-white px-4 py-2 rounded-md">
            Log in
          </button>
        </div>
        <p className="text-center text-base px-4 py-2">or</p>
        <div className="input-field mb-4">
          <button type="button" className="w-full bg-blue-900 text-white px-4 py-2 rounded-md" onClick={() => window.open('http://elibrary-ptcnanveej-daund.vercel.app', '_blank')}>
            Enter to E-Library
          </button>
        </div>
      </form>
    </div>
  </div>
  



    );
  };

  const Navbar = () => {
    const logout = () => {
      setLoginState(false);
      setTab("login");
      localStorage.removeItem("user");
    };

    return (
      <div id="navbar_container " className="bg-[#0d028d] w-full h-20  flex flex-row items-center justify-between gap-3 px-6">
       <div className="flex flex-row  items-center gap-4">
         <img src={logo} className="w-14 h-10"/>
         <h2 className="text-xl  tracking-wider font-bold  text-white ">
            PTC Nanveej-Daund-LMS{" "}
          </h2>
          <img src={logoLogin}  className="w-14 h-12 "
        />
        
       </div>

       <div className="flex flex-row">
        <img src={satyamev}  className="w-14 h-12 mr-5 "
        />
          <button id={tab === "login" ? "no_display" : "logout"} onClick={logout} className="text-black rounded-md bg-white transition-all duration-700 border-2 hover:scale-105 border-white  px-8 h-11 font-semibold hover:text-white hover:bg-[#0d028d]">
            Logout
          </button>
       </div>
      </div>
    );
  };
  
  
  return (
    <>
      <Navbar />

      <div className="flex flex-row flex items-center justify-center h-full rounded-md">
        {tab !== "login" && (
          <div id="sidebar" className="h-full rounded-md">
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [setTab("home")]}
              className={` ${tab === "home" ? "bg-white !text-black" : "" }`}
            >
              Dashboard
            </div>
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [getStudents(), setTab("student_add_type")]}
              className={` ${tab === "student_add_type" ? "bg-white !text-black" : "" }`}
            >
              Add a Student
            </div>
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [getStudents("student"), setTab("students")]}
              className={` ${tab === "students" ? "bg-white !text-black" : "" }`}
            >
              Students List
            </div>
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [getStudents("staff"), setTab("staff")]}
              className={` ${tab === "staff" ? "bg-white !text-black" : "" }`}
            >
              Staff List
            </div>
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [setTab("book_add_type"), getBooks()]}
              className={` ${tab === "book_add_type" ? "bg-white !text-black" : "" }`}
            >
              Add a Book
            </div>
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [getBooks(), setTab("books")]}
              className={` ${tab === "books" ? "bg-white !text-black" : "" }`}
            >
              Books List
            </div>
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [getHistory(), setTab("allot_book")]}
              className={` ${tab === "allot_book" ? "bg-white !text-black" : "" }`}
            >
              Allot a book   
             
            </div>
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [getHistory(), setTab("history")]}
              className={` ${tab === "history" ? "bg-white !text-black" : "" }`}
            >
              Book Lending History
            </div>
          </div>
        )}
        <div id="main_container">
          <div id={tab === "login" ? "login_display" : "no_display"}>
            <LoginFun></LoginFun>
          </div>
          <div id={tab === "home" ? "db_display" : "no_display"}>
            <Dashboard
              studentDetails={studentDetails}
              bookDetails={bookDetails}
              allotDetails={allotDetails}
            />
           
          </div>
          <div id={tab === "students" ? "display" : "no_display"}>
            <div id="students_table_container" style={{ marginTop: "4%" }}>
            
            <MaterialReactTable
            columns={studentColumns}
            data={studentObjects}
            enableColumnOrdering
            enablePagination={true}
            enableRowActions  // Make sure this is set to true
            renderRowActionMenuItems={({ row }) => [
              <MenuItem
              onClick={() => handleEditStudent(row.original.id)}
              key="edit">Edit</MenuItem>,
              <MenuItem 
              onClick={() => handleDeleteStudent(row.original.id)}
              key="delete">Delete</MenuItem>,
            ]}
          />
          
            </div>
          </div>

          <div id={tab === "staff" ? "display" : "no_display"}>
            <div id="students_table_container" style={{ marginTop: "4%" }}>
            <MaterialReactTable
            columns={staffColumns}
            data={studentObjects}
            enableColumnOrdering
            enablePagination={true}
            enableRowActions  // Make sure this is set to true
            renderRowActionMenuItems={({ row }) => [
              <MenuItem
              onClick={() => handleEditStudent(row.original.id)}
              key="edit">Edit</MenuItem>,
              <MenuItem 
              onClick={() => handleDeleteStudent(row.original.id)}
              key="delete">Delete</MenuItem>,
            ]}
          />
          
            </div>
          </div>


          <div id={tab === "books" ? "display" : "no_display"}>
            <div id="students_table_container" style={{ marginTop: "4%" }}>
            <MaterialReactTable
            columns={bookColumns}
            data={bookObjects}
            enableColumnOrdering
            enablePagination={true}
            enableRowActions  // Make sure this is set to true
            renderRowActionMenuItems={({ row }) => [
              <MenuItem
              onClick={() =>handleEditBook(row.original.reg_no)}
              key="edit">Edit</MenuItem>,
              <MenuItem 
              onClick={() => deleteBook(row.original.reg_no)}
              key="delete">Delete</MenuItem>,
            ]}
          />
            </div>
          </div>

          <Dialog open={open}>
            <DialogContent>
              <DialogContentText>Edit Book</DialogContentText>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="text"
                  id="outlined_basic"
                  label="Book Name"
                  name="book_name"
                  value={editBookDetails.book_name}
                  onChange={handleEditBookChange}
                ></TextField>
              </div>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  id="outlined_basic"
                  label="Book Price"
                  type="number"
                  name="book_price"
                  value={editBookDetails.book_price}
                  onChange={handleEditBookChange}
                ></TextField>
              </div>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="number"
                  name="book_quantity"
                  id="outlined_basic"
                  label="Book Quantity"
                  value={editBookDetails.book_quantity}
                  onChange={handleEditBookChange}
                ></TextField>
              </div>
              <br></br>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => handleEditBookSubmit(editBookDetails.book_reg)}>Edit</Button>
              </DialogActions>
            </DialogContent>
          </Dialog>

          <Dialog open={openStudent}>
            <DialogContent>
              <DialogContentText>Edit Student</DialogContentText>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="number"
                  id="outlined_basic"
                  label="Student ID"
                  name="student_id"
                  value={editStudentDetails.student_id}
                  onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                >
                  Student ID
                </TextField>
              </div>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="text"
                  name="student_name"
                  id="outlined_basic"
                  label="Student Name"
                  value={editStudentDetails.student_name}
                  onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                ></TextField>
              </div>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="text"
                  name="student_phone"
                  id="outlined_basic"
                  label="Student Phone"
                  value={editStudentDetails.student_phone}
                  onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                ></TextField>
              </div>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="text"
                  name="student_batch"
                  id="outlined_basic"
                  label="Student Batch"
                  value={editStudentDetails.student_batch}
                  onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                ></TextField>
              </div>
              <br></br>
              <DialogActions>
                <Button onClick={handleCloseStudent}>Cancel</Button>
                <Button onClick={() => handleEditStudentSubmit(editStudentDetails.student_id)}>Edit</Button>
              </DialogActions>
            </DialogContent>
          </Dialog>

          <Dialog open={openFilter}>
          <DialogContent>
            <DialogContentText>Apply Filter</DialogContentText>
            <br></br>
            <div className="filter_input">
              <TextField
                onChange={(e) => setStartDate(e.target.value)}
                type="date"
                placeholder="Start Date"
              />
            </div>
            <br></br>
            <div className="filter_input">
              <TextField
                onChange={(e) => setEndDate(e.target.value)}
                type="date"
                placeholder="End Date"
              />
            </div>
            <br></br>
            <DialogActions>
              <Button onClick={handleCloseFilter}>Cancel</Button>
              <Button onClick={handleApplyFilter}>Apply</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>


          <div
            id={tab === "history" ? "display" : "no_display"}
            style={{ marginTop: "4%" }}
          >
            <div className="inputs">
              <button className="filter_button" onClick={getStudentsDownlaod}>
                Download Report
              </button>
              <button
                className="filter_button"
                onClick={() => setOpenFilter(true)}
              >
                Apply Filter
              </button>
              <input
                type="number"
                placeholder="Search Student ID"
                value={searchAllotId}
                onChange={filterSearchId}
              />
            </div>
            <div id="students_table_container">
              <MaterialReactTable
                columns={historyColumns}
                data={historyObjects}
                enableColumnOrdering={true}
                enableRowSelection={true}
                enableSelectAll={true}
                enableMultiRowSelection={true}
                enablePagination={true}
                onRowSelectionChange={setRowSelection}
                state={{ rowSelection }}
                tableInstanceRef={bookTableInstanceRef}
              />
            </div>
          </div>
          <div
            id={tab === "add_student" ? "display" : "no_display"}
            style={{ marginTop: "4%" }}
          >
            {/* student details */}
            <form id="form">

            <div style={{ marginTop: "5%"}}>
                <label for="name">Select Role</label>
                <br />
                <select
                  required
                  name="student_role"
                  value={studentDetails.student_role}
                  onChange={handleStudentChange}
                  style={{ border: "1px solid #ccc", borderRadius: "4px" }}
                  

                >
                  <option value="">Select Role</option>
                  <option value="staff">Staff</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <div style={{ marginTop: "5%" }}>
                <label for="name">Student ID</label>
                <input
                  required
                  type="number"
                  name="student_id"
                  placeholder="Student ID"
                  value={studentDetails.student_id}
                  onChange={handleStudentChange}
                  onInput={studentExistenceId}
                />
                <p
                  style={{
                    marginLeft: "5%",
                    marginBottom: "0",
                    marginTop: "0",
                  }}
                  id="student_error"
                >
                  {addStudentError}
                </p>
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Student Name</label>
                <input
                  required
                  type="text"
                  name="student_name"
                  placeholder="Name"
                  value={studentDetails.student_name}
                  onChange={handleStudentChange}
                />
              </div>

              <div style={{ marginTop: "5%" }}>
                <label for="name">Student Phone</label>
                <input
                  required
                  type="tel"
                  pattern="[0-9]{3} [0-9]{3} [0-9]{4}"
                  maxlength="10"
                  minLength="10"
                  name="student_phone"
                  placeholder="Phone No"
                  value={studentDetails.student_phone}
                  onChange={handleStudentChange}
                />
                <p
                  style={{ display: mobileNumberInvalid ? "none" : "block" }}
                  id="student_error"
                >
                  Invalid Number
                </p>
              </div>
              {studentDetails.student_role === 'student' && (
                <div style={{ marginTop: "5%" }}>
                  <label htmlFor="name">Student Batch</label>
                  <input
                    required
                    type="text"
                    name="student_batch"
                    placeholder="Batch No"
                    value={studentDetails.student_batch}
                    onChange={handleStudentChange}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleStudentSubmit(e);
                      }
                    }}
                  />
                </div>
              )}
              <Button
                id="submit"
                disabled={!studentSubmit}
                onClick={handleStudentSubmit}
              >
                Submit
              </Button>
            </form>
          </div>
          <div
            id={tab === "add_book" ? "display" : "no_display"}
            style={{ marginTop: "4%" }}
          >
            <form id="form">
              <div style={{ marginTop: "5%" }}>
                <label for="name">Book Name</label>
                <input
                  required
                  type="text"
                  name="book_name"
                  placeholder="Name"
                  value={bookDetails.book_name}
                  onChange={handleBookChange}
                  onInput={bookExistenceName}
                />
                <p
                  style={{
                    marginLeft: "5%",
                    marginBottom: "0",
                    marginTop: "0",
                  }}
                  id="student_error"
                >
                  {addBookError}
                </p>
              </div>

              <div style={{ marginTop: "5%" }}>
                <label for="name">Book Register number</label>
                <input
                  required
                  type="text"
                  name="book_reg"
                  placeholder="Enter a number"
                  value={bookDetails.book_reg}
                  onChange={handleBookChange}
                  onInput={bookExistenceId}
                />
                <p
                  style={{
                    marginLeft: "5%",
                    marginBottom: "0",
                    marginTop: "0",
                  }}
                  id="student_error"
                >
                  {addBookError}
                </p>
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Book Price</label>
                <input
                  required
                  type="number"
                  name="book_price"
                  value={bookDetails.book_price}
                  placeholder="Price"
                  onChange={handleBookChange}
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Book Quantity</label>
                <input
                  required
                  type="number"
                  name="book_quantity"
                  value={bookDetails.book_quantity}
                  placeholder="Quantity"
                  onChange={handleBookChange}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleBookSubmit(e);
                    }
                  }}
                />
              </div>
              <button id="submit" onClick={handleBookSubmit}>
                Submit
              </button>
            </form>
          </div>
          <div
            id={tab === "allot_book" ? "display" : "no_display"}
            style={{ marginTop: "4%" }}
          >
            <form id="form">
              <div style={{ marginTop: "5%" }}>
                <label for="name">Student ID</label>
                <input
                  type="number"
                  name="studentId"
                  placeholder="Student ID"
                  value={allotDetails.studentId}
                  onChange={(e) => handleStudentIdChange(e.target.value)}
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Student Name</label>
                <input
                  type="text"
                  name="studentName"
                  placeholder="Student Name"
                  value={allotDetails.studentName}
                  readOnly
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Role Name</label>
                <input
                  type="text"
                  name="studentRole"
                  placeholder="Student Role"
                  value={allotDetails.studentRole}
                  readOnly
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Book Name</label>
                  <CategorySearch  handleAllotChange={handleBookNameChange}/>
                

                {/*<input
                  type="text"
                  name="bookName"
                  placeholder="Book Name"
                  value={allotDetails.bookName}
                  onChange={(e) => handleBookNameChange(e.target.value)}
                />*/}

              </div>

              <div style={{ marginTop: "5%" }}>
                <label for="name">Book id</label>
                <input
                  type="number"
                  name="bookId"
                  placeholder="Book register id"
                  value={allotDetails.bookId}
                  readOnly
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Borrowed Date</label>
                <input
                  type="date"
                  name="borrowedDate"
                  placeholder="Borrowed Date"
                  value={allotDetails.borrowedDate}
                  onChange={(e) => {
                    setAllotDetails({ ...allotDetails, borrowedDate: e.target.value });
                  }}
                  style={{ 
                    padding: "10px", 
                    fontSize: "16px", 
                  }}
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Expected Return Date</label>
                <input
                  type="date"
                  name="expectedReturnDate"
                  placeholder="Return Date"
                  value={allotDetails.expectedReturnDate}
                  onChange={(e) => {
                    setAllotDetails({ ...allotDetails, expectedReturnDate: e.target.value });
                  }}
                  style={{ 
                    padding: "10px",
                    fontSize: "16px", 
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAllotSubmit(e);
                    }
                  }}
                />
              </div>
              <button
                id="submit"
                onClick={handleAllotSubmit}
              >
                Submit
              </button>
            </form>
          </div>
          <div
            id={tab === "student_add_type" ? "display_add" : "no_display"}
            style={{ height: "inherit" }}
          >
            <div className="add_type">
              <div className="add_button">
                <button className="adding_button" onClick={() => setTab("add_student")}>
                  Add a student
                </button>
              </div>
              <div className="add_button">
                <button onClick={() => setTab("add_student_bulk")}>
                  Bulk Upload
                </button>
              </div>
            </div>
          </div>
          <div
            id={tab === "book_add_type" ? "display_add" : "no_display"}
            style={{ height: "inherit" }}
          >
            <div className="add_type">
              <div className="add_button">
                <button className="bg-black" onClick={() => setTab("add_book")}>Add a book</button>
              </div>
              <div className="add_button">
                <button onClick={() => setTab("add_book_bulk")}>
                  Bulk Upload
                </button>
              </div>
            </div>
          </div>
          <div
            id={tab === "add_student_bulk" ? "display_add" : "no_display"}
            style={{ height: "inherit" }}
          >
            <div className="bulk_button">
              <p>Please upload the csv file</p>
              <div>
                <input
                  className="custom-file-input"
                  name="student"
                  accept="csv"
                  onChange={handleCSVUpload}
                  type="file"
                ></input>
              </div>
            </div>
          </div>
          <div
            id={tab === "add_book_bulk" ? "display_add" : "no_display"}
            style={{ height: "inherit" }}
          >
            <div className="bulk_button">
              <p>Please upload the csv file</p>
              <div>
                <input
                  className="custom-file-input"
                  name="book"
                  accept="csv"
                  onChange={handleCSVUpload}
                  type="file"
                ></input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
