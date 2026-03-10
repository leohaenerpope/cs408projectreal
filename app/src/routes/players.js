var express = require('express');
var router = express.Router();

// GET player list page
router.get('/', function(req, res, next) {
	res.render('players', { title: 'NBA Player Matchup Notes - Player List' });
});
module.exports = router;

// GET add player page
router.get('/add', (req, res) => {
	res.render('add-player', { title: 'Add New Player' });
});
  
// POST for add player page
router.post('/add', (req, res) => {
	const { playerName } = req.body;
	
	console.log(`Saving: ${playerName}`);
  
	// TODO: SAVE TO DATABASE
	
	// After saving, send the user back to the list
	res.redirect('/players');
});