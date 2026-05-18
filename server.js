const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const cardsRoute = require('./routes/cards');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // to support large avatars/covers

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('Mongo error:', err.message);
});

app.use('/api/cards', cardsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});
