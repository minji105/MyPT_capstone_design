const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  pw: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  // birth: {
  //   type: Date,
  //   required: true
  // },
});

userSchema.pre('save', async function (next) {
  console.log('pre-save 미들웨어 실행'); 
  
  if (!this.isModified('pw')) return next();
  const salt = await bcrypt.genSalt(10);
  this.pw = await bcrypt.hash(this.pw, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
