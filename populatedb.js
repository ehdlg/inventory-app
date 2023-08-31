#! /usr/bin/env node

console.log(
  'This script populates some genres, developes, publishers and games to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require('./models/game');
const Developer = require('./models/developer');
const Genre = require('./models/genre');
const Publisher = require('./models/publisher');

const games = [];
const genres = [];
const developers = [];
const publishers = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createGenres();
  await createDevelopers();
  await createPublishers();
  await createGames();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function genreCreate(index, name) {
  const genre = new Genre({ name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function developerCreate(
  index,
  name,
  founded,
  num_employees,
  img = null
) {
  const developerdetail = {
    name,
    founded,
    num_employees,
    img,
  };

  const developer = new Developer(developerdetail);

  await developer.save();
  developers[index] = developer;
  console.log(`Added developer: ${name}`);
}
async function publisherCreate(
  index,
  name,
  founded,
  num_employees,
  img = null
) {
  const publisherdetail = {
    name,
    founded,
    num_employees,
    img,
  };

  const publisher = new Publisher(publisherdetail);

  await publisher.save();
  publishers[index] = publisher;
  console.log(`Added publisher: ${name}`);
}

async function gameCreate(
  index,
  name,
  description,
  genres,
  platforms,
  publisher,
  developer,
  price,
  stock,
  releaseDate,
  cover = null
) {
  const gamedetail = {
    name,
    description,
    genres,
    platforms,
    publisher,
    developer,
    price,
    stock,
    releaseDate,
    cover,
  };

  const game = new Game(gamedetail);
  await game.save();
  games[index] = game;
  console.log(`Game added: ${name}`);
}

async function createGenres() {
  console.log('Adding genres');
  await Promise.all([
    genreCreate(0, 'FPS'),
    genreCreate(1, 'RPG'),
    genreCreate(2, 'JRPG'),
    genreCreate(3, 'Action/Adventure'),
    genreCreate(4, 'Platforms'),
    genreCreate(5, 'Strategy'),
  ]);
}

async function createDevelopers() {
  console.log('Adding developers');
  await Promise.all([
    developerCreate(
      0,
      'Electronic Arts',
      new Date('1982-05-28'),
      9000,
      'URL de la imagen del desarrollador 1'
    ),
    developerCreate(
      1,
      'Ubisoft',
      new Date('1986-03-28'),
      18000,
      'URL de la imagen del desarrollador 2'
    ),
    developerCreate(
      2,
      'Activision Blizzard',
      new Date('2008-12-02'),
      8000,
      'URL de la imagen del desarrollador 3'
    ),
    developerCreate(
      3,
      'CD Projekt Red',
      new Date('2002-03-16'),
      1500,
      'URL de la imagen del desarrollador 4'
    ),
  ]);
}

async function createPublishers() {
  console.log('Adding publishers');
  await Promise.all([
    publisherCreate(
      0,
      'Nintendo',
      new Date('1889-09-23'),
      6000,
      'URL de la imagen del editor 1'
    ),
    publisherCreate(
      1,
      'Sony Interactive Entertainment',
      new Date('1993-12-03'),
      12000,
      'URL de la imagen del editor 2'
    ),
    publisherCreate(
      2,
      'Microsoft Studios',
      new Date('2000-03-01'),
      10000,
      'URL de la imagen del editor 3'
    ),
    publisherCreate(
      3,
      'Square Enix',
      new Date('1975-09-22'),
      4500,
      'URL de la imagen del editor 4'
    ),
  ]);
}

async function createGames() {
  console.log('Adding Games');
  await Promise.all([
    gameCreate(
      0,
      'The Legend of Zelda: Breath of the Wild',
      'Un juego de acción y aventura desarrollado y publicado por Nintendo. Es el décimo octavo título de la serie de The Legend of Zelda.',
      [genres[0]._id, genres[3]._id],
      ['Nintendo Switch'],
      publishers[0],
      developers[0],
      59.99,
      100,
      new Date('2017-03-03'),
      'URL de la portada del juego 1'
    ),

    gameCreate(
      1,
      "Assassin's Creed Valhalla",
      "Un juego de rol de acción desarrollado y publicado por Ubisoft. Es el decimosegundo título principal de la serie Assassin's Creed.",
      [genres[1]._id, genres[3]._id],
      ['Sony Playstation', 'Xbox', 'PC'],
      publishers[1],
      developers[1],
      49.99,
      50,
      new Date('2020-11-10'),
      'URL de la portada del juego 2'
    ),
    gameCreate(
      2,
      'Call of Duty: Warzone',
      'Un juego de disparos en línea gratuito desarrollado y publicado por Activision. Es una parte del juego Call of Duty: Modern Warfare de 2019.',
      [genres[0]._id, genres[3]._id],
      ['Sony Playstation', 'Xbox', 'PC'],
      publishers[2],
      developers[2],
      0,
      200,
      new Date('2020-03-10'),
      'URL de la portada del juego 3'
    ),
    gameCreate(
      3,
      'Cyberpunk 2077',
      'Un juego de rol de acción desarrollado y publicado por CD Projekt Red. Ambientado en Night City, un mundo abierto ambientado en la era futura.',
      [genres[1], genres[3]],
      ['Sony Playstation', 'Xbox', 'PC'],
      publishers[3],
      developers[3],
      59.99,
      20,
      new Date('2020-12-10'),
      'URL de la portada del juego 4'
    ),
    gameCreate(
      4,
      'Super Mario Odyssey',
      'Un juego de plataformas de la saga Mario desarrollado para la Nintendo Switch',
      [genres[4]],
      ['Nintendo Switch'],
      publishers[0],
      developers[0],
      59.99,
      110,
      new Date('2017-10-27'),
      'URL de la portada del juego 4'
    ),
  ]);
}
