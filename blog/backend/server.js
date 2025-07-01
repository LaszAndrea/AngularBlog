const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('db okes'))
.catch(err => console.error('db hiba:', err));

const User = mongoose.model('User', {
  name: String,
  nickname: String,
  email: String,
  password: String,
});

const BlogPost = mongoose.model('BlogPost', {
  title: String,
  content: String,
  author: String,
  userId: String,
  date: Date,
  pictureUrl: String
});


app.post('/api/register', async (req, res) => {
  const { name, nickname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { nickname }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email vagy becenév már használatban' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, nickname, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Sikeres regisztráció' });
  } catch (err) {
    res.status(500).json({ message: 'Hiba a regisztráció során' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Hibás email vagy jelszó' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Hibás email vagy jelszó' });

    res.json({ user: { _id: user._id, name: user.name, nickname: user.nickname } });
  } catch (err) {
    console.error('Login error:', err); 
    res.status(500).json({ message: 'Hiba a bejelentkezés során' });
  }
});

app.post('/api/addPost', async (req, res) => {
  const blogPost = new BlogPost(req.body);
  await blogPost.save();
  res.status(201).json(blogPost);
});

app.get('/api/getAllPosts', async (req, res) => {
  try{
    const blogPosts = await BlogPost.find();
    res.json(blogPosts);
  }catch(err){
    res.status(500).json({ message: 'Hiba a posztok lekérése során.' });
  }
});

app.get('/api/getAllUsers', async (req, res) => {
  try{
    const users = await User.find();
    res.json(users);
  }catch(err){
    res.status(500).json({ message: 'Hiba a userek lekérése során.' });
  }
});

app.delete('/api/deletePost/:id', async (req, res) => {
  try {
    const blogpostId = req.params.id;

    await BlogPost.findByIdAndDelete(blogpostId);

    res.status(200).json({ message: 'Sikeresen törölve.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hiba történt a törlés során.' });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const updatedPost = await BlogPost.findByIdAndUpdate(id, updatedData, { new: true });
    console.log(updatedData)

    if (!updatedPost) {
      return res.status(404).json({ message: 'A poszt nem található' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hiba történt a módosítás során.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend fut a ${PORT}-as porton`);
});