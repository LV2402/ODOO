const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/question'));
app.use('/api/answers', require('./routes/answer'))
app.use('/api/notifications', require('./routes/notification'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));