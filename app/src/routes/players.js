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
  
	// format the name
	const playerSlug = rawName
	  .toLowerCase()
	  .trim()
	  .replace(/\s+/g, '-');
  
	console.log(`Original: ${rawName} | Slug: ${playerSlug}`);
  
	// 3. Save both to your data store
	const newPlayer = {
	  displayName: rawName,
	  slug: playerSlug 
	};
  
	// ADD TO DATABASE HERE TODO;
	// PRobably shouldn't add to database if the playerSlug already exists
  
	res.redirect('/players');
});

module.exports = router;