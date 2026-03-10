var express = require('express');
var router = express.Router();

/* GET home (landing) page. */
router.get('/', function(req, res, next) {
  res.render('players', { title: 'NBA Player Matchup Notes - Player List' });
});
module.exports = router;
