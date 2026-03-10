var express = require('express');
var router = express.Router();

/* GET home (landing) page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NBA Player Matchup Notes' });
});
module.exports = router;
