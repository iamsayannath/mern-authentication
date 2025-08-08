const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: 'https://mern-authentication-frontend-spgp.onrender.com',
    credentials: true
  }
));





app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => console.log('mongoDB connected and node Server running')))
  .catch((err) => console.log(err));
