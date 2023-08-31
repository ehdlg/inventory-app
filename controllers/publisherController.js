const Publisher = require('../models/publisher');
const Game = require('../models/game');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.publisher_list = asyncHandler(async (req, res, next) => {
  const publishers = await Publisher.find().exec();
  res.render('publisher_list', {
    headTitle: 'Publishers',
    title: 'Publisher List',
    publisher_list: publishers,
  });
});

exports.publisher_detail = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send({ err: 'Invalid ID' });
  }
  const publisher = await Publisher.findById(req.params.id);

  if (publisher === null) {
    return res.status(404).send({ err: 'No publisher found' });
  }

  res.render('publisher_details', {
    headTitle: 'Publisher detail',
    title: 'Publisher Detail',
    publisher,
  });
});

//controller that displays a form for the update and create operations
exports.publisher_form = asyncHandler(async (req, res, next) => {
  //retrieve the publisher
  const publisher = await Publisher.findById(req.params.id);
  let headTitle;
  let title;
  //if there is a publisher (update method), update the variables with the update operation
  if (publisher) {
    headTitle = 'Update Publisher';
    title = 'Update Publisher';
    //else, update with the create operation
  } else {
    headTitle = 'Create Publisher';
    title = 'Create Publisher';
  }
  //render the form
  res.render('publisher_form', {
    headTitle,
    title,
    publisher,
    errors: false,
  });
});

exports.publisher_create_post = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(async (value) => {
      const repeatedPublisher = await Publisher.findOne({ name: value });
      if (repeatedPublisher) {
        throw new Error('Publisher name is already in the database');
      }
      return true;
    }),

  body('founded', 'Founded date must not be empty')
    .optional({ checkFalsy: false })
    .isISO8601()
    .withMessage('Invalid date format. Use YYYY-MM-DD.'),
  body(
    'num_employees',
    'Number of employees must be a number greater than 0'
  ).isInt({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const publisher = new Publisher({
      name: req.body.name,
      founded: req.body.founded,
      num_employees: req.body.num_employees,
      img: req.body.img,
    });

    if (!errors.isEmpty()) {
      res.render('publisher_form', {
        headTitle: 'Create Publisher',
        title: 'Create Publisher',
        publisher,
        errors: errors.array(),
      });
    } else {
      await publisher.save();
      res.redirect(publisher.url);
    }
  }),
];

exports.publisher_update_post = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(async (value, { req }) => {
      //check if the publisher name has been changed in the form
      const originalPublisher = await Publisher.findById(req.params.id);
      //if it has been changed, check if the name is already in the database
      if (originalPublisher.name !== value) {
        const repeatedPublisher = await Publisher.findOne({ name: value });
        //if the new name is in the database, throw an error
        if (repeatedPublisher) {
          throw new Error('Publisher name is already in the database');
        }
      }
      //else, everything is good
      return true;
    }),

  body('founded', 'Founded date must not be empty')
    .optional({ checkFalsy: false })
    .isISO8601()
    .withMessage('Invalid date format. Use YYYY-MM-DD.'),
  body(
    'num_employees',
    'Number of employees must be a number greater than 0'
  ).isInt({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    //check errors
    const errors = validationResult(req);
    //crete a new object with the data from the form with the object id for the update
    const publisher = new Publisher({
      name: req.body.name,
      founded: req.body.founded,
      num_employees: req.body.num_employees,
      img: req.body.img,
      _id: req.params.id,
    });
    //if there are errors, display the form again with the valid data and the errors
    if (!errors.isEmpty()) {
      res.render('publisher_form', {
        headTitle: 'Update Publisher',
        title: 'Update Publisher',
        publisher,
        errors: errors.array(),
      });
      //else, update the publisher and redirect to the publisher url
    } else {
      const updatedPublisher = await Publisher.findByIdAndUpdate(
        req.params.id,
        publisher,
        {}
      );
      res.redirect(updatedPublisher.url);
    }
  }),
];

exports.publisher_delete_get = asyncHandler(async (req, res, next) => {
  const publisher = await Publisher.findById(req.params.id);
  if (publisher === null) {
    const error = new Error('Publisher not found');
    return next(error);
  }

  const publisherGames = await Game.find({ publisher: publisher._id }).exec();

  res.render('publisher_delete', {
    headTitle: 'Delete Publisher',
    title: 'Delete Publisher',
    publisher,
    game_list: publisherGames,
  });
});

exports.publisher_delete_post = asyncHandler(async (req, res, next) => {
  const publisher = await Publisher.findById(req.params.id);
  if (!publisher) {
    res.sendStatus(404);
  }

  await publisher.deleteOne();
  res.redirect('/publishers');
});
