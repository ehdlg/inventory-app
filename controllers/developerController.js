const Developer = require('../models/developer');
const Game = require('../models/game');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const validation = require('../middlewares/validation');

// Display list of all Authors.
exports.developer_list = asyncHandler(async (req, res, next) => {
  const allDevelopers = await Developer.find().sort({ name: 1 }).exec();

  res.render('developer_list', {
    headTitle: 'Developers',
    title: 'Developer List',
    developer_list: allDevelopers,
  });
});

exports.developer_detail = asyncHandler(async (req, res, next) => {
  const developer = await Developer.findById(req.params.id);
  if (developer === null) {
    res.sendStatus(404);
  }
  if (!mongoose.Types.ObjectId.isValid(developer._id)) {
    res.sendStatus(404);
    return;
  }
  const developerGames = await Game.find({ developer: developer._id }).exec();

  res.render('developer_detail', {
    headTitle: 'Developer Detail',
    title: 'Developer Detail',
    developer,
    game_list: developerGames,
  });
});

exports.developer_form = asyncHandler(async (req, res, next) => {
  let developer = null;
  let title = 'Create Developer';
  if (req.params.id) {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      developer = await Developer.findById(req.params.id);
      title = 'Update Developer';
    } else {
      res.sendStatus(403);
    }
  }

  res.render('developer_form', {
    headTitle: title,
    title,
    developer,
    errors: false,
  });
});

exports.developer_create_post = [
  validation.validateDeveloper,

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const developer = new Developer({
      name: req.body.name,
      founded: req.body.founded,
      num_employees: req.body.employees,
      img: req.body.img,
    });
    if (!errors.isEmpty()) {
      res.render('developer_form', {
        title: 'Create Developer',
        headTitle: 'Create Developer',
        developer,
        errors: errors.array(),
      });
    } else {
      await developer.save();
      res.redirect(developer.url);
    }
  }),
];

exports.developer_update_post = [
  validation.validateDeveloper,

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const developer = new Developer({
      name: req.body.name,
      founded: req.body.founded,
      num_employees: req.body.employees,
      img: req.body.img,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render('developer_form', {
        title: 'Update Developer',
        headTitle: 'Update Developer',
        developer,
        errors: errors.array(),
      });
    } else {
      const updatedDeveloper = await Developer.findByIdAndUpdate(
        req.params.id,
        developer,
        {}
      );
      res.redirect(updatedDeveloper.url);
    }
  }),
];

exports.developer_delete_get = asyncHandler(async (req, res, next) => {
  const developer = await Developer.findById(req.params.id).exec();
  if (!developer) {
    res.sendStatus(404);
  }

  const developerGames = await Game.find({ developer: developer._id }).exec();

  res.render('developer_delete', {
    headTitle: 'Delete Developer',
    developer,
    game_list: developerGames,
  });
});

exports.developer_delete_post = asyncHandler(async (req, res, next) => {
  const developer = await Developer.findById(req.params.id);

  await developer.deleteOne();
  res.redirect('/developers');
});
