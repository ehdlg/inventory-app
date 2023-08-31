const Genre = require('../models/genre');
const Game = require('../models/game');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const validation = require('../middlewares/validation');

exports.genre_list = asyncHandler(async (req, res, next) => {
  const genres = await Genre.find().exec();

  res.render('genre_list', {
    headTitle: 'Genre List',
    title: 'Genre List',
    genre_list: genres,
  });
});

exports.genre_detail = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);

  if (genre === null) {
    res.status(404).send({ err: 'Genre not found' });
  }
  //get all games with that genre
  const genreGames = await Game.find({ genres: { $in: [genre._id] } });

  res.render('genre_details', {
    headTitle: 'Genre Details',
    title: 'Genre Details',
    genre,
    game_list: genreGames,
  });
});

exports.genre_form = asyncHandler(async (req, res, next) => {
  let genre = false;
  if (req.params.id) {
    genre = await Genre.findById(req.params.id);
    if (genre === null) {
      res.status(404).send({ err: 'Genre ID not found' });
    }
  }

  res.render('genre_form', {
    headTitle: 'Create Genre',
    title: 'Create Genre',
    genre,
    errors: false,
  });
});

exports.genre_create_post = [
  validation.validateGenre,

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({
      name: req.body.name,
    });
    if (!errors.isEmpty()) {
      res.render('genre_form', {
        headTitle: 'Create Genre',
        title: 'Create Genre',
        genre,
        errors: errors.array(),
      });
    } else {
      await genre.save();
      res.redirect(genre.url);
    }
  }),
];

exports.genre_update_post = [
  validation.validateGenre,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({
      name: req.body.name,
      _id: req.body.genreId,
    });
    if (!errors.isEmpty()) {
      res.render('genre_form', {
        headTitle: 'Update Genre',
        title: 'Update Genre',
        errors: errors.array(),
        genre,
      });
    } else {
      const updatedGenre = await Genre.findByIdAndUpdate(
        req.params.id,
        genre,
        {}
      );
      res.redirect(updatedGenre.url);
    }
  }),
];

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);
  if (genre === null) {
    return res.status(404).send({ err: 'The genre could not be found' });
  }

  const gamesGenre = await Game.find({ genres: { $in: [genre._id] } });

  res.render('genre_delete', {
    headTitle: 'Delete Genre',
    title: 'Delete Genre',
    genre,
    game_list: gamesGenre,
  });
});

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);

  if (genre === null) {
    return res.status(404).send({ err: 'The genre could not be found' });
  }

  await genre.deleteOne();
  res.redirect('/genres');
});
