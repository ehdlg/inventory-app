const Game = require('../models/game');
const Developer = require('../models/developer');
const Genre = require('../models/genre');
const Publisher = require('../models/publisher');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const platforms = ['Sony Playstation', 'Xbox', 'Nintendo Switch', 'PC'];
const validation = require('../middlewares/validation');

// Display list of all Authors.
exports.game_list = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find()
    .sort({ name: 1 })
    .populate('developer')
    .populate('publisher')
    .populate('genres')
    .exec();

  res.render('games_list', {
    headTitle: 'Games',
    title: 'Games List',
    game_list: allGames,
  });
});

exports.game_detail = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id)
    .populate('developer')
    .populate('genres')
    .exec();
  if (game === null) {
    return res.status(404).send({ err: 'Game Not Found' });
  }
  res.render('game_details', {
    headTitle: 'Game Detail',
    title: 'Game: ',
    game,
  });
});

exports.game_create_get = asyncHandler(async (req, res, next) => {
  const genres = await Genre.find().exec();
  const developers = await Developer.find().exec();
  const publishers = await Publisher.find().exec();

  res.render('game_form', {
    headTitle: 'Create Game',
    title: 'Create Game',
    game: false,
    errors: false,
    platforms,
    publishers,
    genres,
    developers,
  });
});

exports.game_create_post = [
  validation.validateGame,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const game = new Game({
      name: req.body.name,
      description: req.body.description,
      genres: req.body.genres,
      platforms: req.body.platforms,
      publisher: req.body.publisher,
      developer: req.body.developer,
      price: req.body.price,
      stock: req.body.stock,
      releaseDate: req.body.releaseDate,
      img: req.body.img,
    });

    const publishers = await Publisher.find().exec();
    const developers = await Developer.find().exec();
    const genres = await Genre.find().exec();

    if (!errors.isEmpty()) {
      res.render('game_form', {
        headTitle: 'Create Game',
        title: 'Create Game',
        game,
        errors: errors.array(),
        publishers,
        developers,
        platforms,
        genres,
      });
    } else {
      await game.save();
      res.redirect(game.url);
    }
  }),
];

exports.game_update_get = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id).exec();

  if (game === null) {
    return res.status(404).json({ err: 'Game Not Found' });
  }
  const genres = await Genre.find().exec();
  const developers = await Developer.find().exec();
  const publishers = await Publisher.find().exec();
  console.log(game.publisher.toString(), publishers);

  res.render('game_form', {
    headTitle: 'Update Game',
    title: 'Update game',
    game,
    genres,
    developers,
    publishers,
    platforms,
    errors: false,
  });
});

exports.game_update_post = [
  validation.validateGame,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const game = new Game({
      name: req.body.name,
      description: req.body.description,
      genres: req.body.genres,
      platforms: req.body.platforms,
      publisher: req.body.publisher,
      developer: req.body.developer,
      price: req.body.price,
      stock: req.body.stock,
      releaseDate: req.body.releaseDate,
      img: req.body.img,
      _id: req.params.id,
    });

    const publishers = await Publisher.find().exec();
    const developers = await Developer.find().exec();
    const genres = await Genre.find().exec();

    if (!errors.isEmpty()) {
      res.render('game_form', {
        headTitle: 'Update Game',
        title: 'Update Game',
        game,
        errors: errors.array(),
        publishers,
        developers,
        platforms,
        genres,
      });
    } else {
      await Game.findByIdAndUpdate(req.params.id, game, {});
      res.redirect(game.url);
    }
  }),
];

exports.game_delete_get = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    res.sendStatus(404);
  }
  res.render('game_delete', {
    title: 'Delete Game',
    headTitle: 'Delete Game',
    game,
  });
});

exports.game_delete_post = asyncHandler(async (req, res, next) => {
  await Game.findByIdAndDelete(req.params.id);
  res.redirect('/games');
});
