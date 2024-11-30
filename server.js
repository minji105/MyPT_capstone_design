const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3001;
require('dotenv').config();

const User = require('./models/user');
const Board = require('./models/board');
const Exercise = require('./models/exercise');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 로그인 API
app.post('/api/login', async (req, res) => {
  try {
    const { id, pw } = req.body;

    const user = await User.findOne({ id });
    if (!user) return res.status(400).json({ error: 'Invalid id' });

    const isMatch = await bcrypt.compare(pw, user.pw);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );
    res.json({ message: 'Login successful', token, id });
    console.log('Login successful');

  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
    console.log('Login Failed');
  }
});

//회원가입 API
app.post('/api/register', async (req, res) => {
  const { id, pw, name, email } = req.body;

  try {
    const newUser = new User({
      id,
      pw,
      name,
      email,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
    console.log('Register successful');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'User registration failed', err });
  }
});

// 게시물 등록 API
app.post('/api/posts', async (req, res) => {
  const { title, writer, content } = req.body;

  try {
    const board = new Board({
      title,
      writer,
      content,
    });

    await board.save();
    res.status(201).json({ message: 'Post created successfully' });
    console.log('Post upload successful');
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', err });
    console.error('Error post upload:', err);
  }
});

// 게시물 조회 API
app.get('/api/posts', async (req, res) => {
  const board = await Board.find({});
  res.json(board);
});

app.get('/api/posts/:boardId', async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch post', error: err.message });
  }
})

// 게시물 수정 API
app.put('/api/posts/:boardId', async (req, res) => {
  const boardId = req.params.boardId;
  const { title, content } = req.body;

  try {
    const updatedPost = await Board.findByIdAndUpdate(
      boardId,
      { title, content },
      { new: true }
    );
    if (!updatedPost)
      return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update post', err });
  }
})

// 게시물 삭제 API
app.delete('/api/posts/:boardId', async (req, res) => {
  const boardId = req.params.boardId;

  try {
    const deletedPost = await Board.findByIdAndDelete(boardId);
    if (!deletedPost)
      return res.status(404).json({ message: 'Post not found' });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post', err });
  }
})

// 운동 기록 저장 API
app.post('/api/save-exercise', async (req, res) => {
  const { exerciseType, user, duration, date } = req.body;

  try {
    const record = new Exercise({ exerciseType, user, duration, date });
    await record.save();
    res.status(200).json({ message: 'Save success' });
    console.log("save success");
  } catch (err) {
    res.status(500).json({ message: 'Failed to save', err });
    console.log("Failed to save");
  }
})

// 운동 기록 조회 API
app.get('/api/save-exercise/:userId', async (req, res) => {
  try {
    console.log("Received userId:", req.params.userId);
    const record = await Exercise.find({ user: req.params.userId });
    if (!record || record.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch record', error: err.message });
  }
})

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);