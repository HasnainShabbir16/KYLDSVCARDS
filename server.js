const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const cardsRoute = require('./routes/cards');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // to support large images

// Serve static files from 'public' folder at '/public' path
app.use('/public', express.static(path.join(__dirname, 'public')));

// Optional: Redirect root URL to /public/admin.html
app.get('/', (req, res) => {
  res.redirect('/public/admin.html');
});

// API routes for cards
app.use('/api/cards', cardsRoute);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('Mongo error:', err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});
