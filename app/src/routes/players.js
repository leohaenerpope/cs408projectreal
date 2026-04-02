var express = require('express');
var router = express.Router();

// GET player list page
router.get('/', function(req, res, next) {
	const players = req.db.getAllPlayers();
	res.render('players', { title: 'NBA Player Matchup Notes - Player List', players: players});
});

// GET add player page
router.get('/add', (req, res) => {
	res.render('add-player', { title: 'NBA Player Matchup Notes - Add New Player' });
});

// deletes the player (selected by id) from the database
router.post('/delete/:id', (req, res) => {
	const id = req.params.id;
	req.db.deletePlayer(id);
	res.redirect('/players');
});
  
// POST for add player page
router.post('/add', (req, res) => {
	// get the raw name from the form (
	const rawName = req.body.playerName;

	try {
		req.db.createPlayer(rawName);
		res.redirect('/players');
	} catch (err) {
		console.error(err.message);
		if (err.message.includes('UNIQUE')) {
			return res.render('add-player', { title: 'NBA Player Matchup Notes - Add New Player', error: 'Player already exists'});
		}
		res.render('add-player', { title: 'NBA Player Matchup Notes - Add New Player', error: 'Failed to add player'});
	}
  
	
});

module.exports = router;