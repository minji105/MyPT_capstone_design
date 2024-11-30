const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  exerciseType: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
