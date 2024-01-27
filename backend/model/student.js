const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  id: {
    type: Number
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;