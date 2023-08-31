const express = require('express');
const mongoose = require('mongoose');
const index = require('./routes/index');
const gamesRoute = require('./routes/gamesRoute');
const genresRoute = require('./routes/genresRoute');
const publishersRoute = require('./routes/publishersRoute');
const developersRoute = require('./routes/developersRoute');
require('dotenv').config();

const path = require('path');

const app = express();
const mongoDB = process.env.MONGO_URL;

mongoose.set('strictQuery', false);
//public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//routers
app.use('/', index);
app.use('/games', gamesRoute);
app.use('/genres', genresRoute);
app.use('/publishers', publishersRoute);
app.use('/developers', developersRoute);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
  app.listen(process.env.PORT, () => {
    console.log(`App listening on: http://localhost:${process.env.PORT}`);
  });
}
