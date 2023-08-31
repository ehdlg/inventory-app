const { body } = require('express-validator');
const Developer = require('../models/developer');
const Genre = require('../models/genre');
const Game = require('../models/game');
const platforms = ['Sony Playstation', 'Xbox', 'PC', 'Nintendo Switch'];

const checkRepeatedDeveloper = async (value, { req }) => {
  const developer = await Developer.findById(req.params.id);
  if (!developer || developer.name !== value) {
    const repeatedDeveloper = await Developer.findOne({ name: value });
    if (repeatedDeveloper) {
      throw new Error('The Developers already exists in the database');
    }
  }
  return true;
};

const checkRepeatedGenre = async (value, { req }) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre || genre.name !== value) {
    const repeatedGenre = await Genre.findOne({ name: value });
    if (repeatedGenre) {
      throw new Error('The Genre already exists in the database');
    }
  }

  return true;
};

const checkRepeatedGame = async (value, { req }) => {
  const game = await Game.findById(req.params.id).exec();
  if (!game || game.name !== value) {
    const repeatedGame = await Game.find({ name: value }).exec();
    if (repeatedGame) {
      throw new Error('The game already exists in the database');
    }
  }
  return true;
};

exports.validateDeveloper = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(checkRepeatedDeveloper),
  body('founded', 'Founded date must not be empty')
    .optional({ checkFalsy: false })
    .isISO8601()
    .withMessage('Invalid date format. Use YYYY-MM-DD.'),
  body(
    'employees',
    'Number of employees must be a number greater than 0'
  ).isInt({ min: 1 }),
  body('img').escape(),
];

exports.validateGenre = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .custom(checkRepeatedGenre),
];

exports.validateGame = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .custom(checkRepeatedGame),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 }),
  body('genres.*').escape(),
  body('platforms').isIn(platforms).withMessage('Invalid platform'),
  body('publisher').trim().isLength({ min: 1 }).escape(),
  body('developer').trim().isLength({ min: 1 }).escape(),
  body(
    'price',
    'Price must be a valid decimal number greater or equal than 0'
  ).isFloat({
    min: 0,
  }),
  body('stock')
    .trim()
    .isInt({ min: 0 })
    .withMessage('Stock must be 0 or a positive number'),
  body('releaseDate', 'Release date must not be empty')
    .optional({ checkFalsy: false })
    .isISO8601()
    .withMessage('Date must be in format dd/MM/yyyy'),
  body('img').optional({ checkFalsy: false }).escape(),
];
