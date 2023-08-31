let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    headTitle: 'Gaming Inventory',
    title: 'Gaming Inventory',
  });
});

module.exports = router;
