var express = require('express');
var router = express.Router();

// GET add player page
router.get('/:playerSlug/add', (req, res) => {
	const slugFromUrl = req.params.playerSlug;

    // formatted slug for display, may remove this when database retrieval is implemented
    // as the database will store the display name
    const formattedName = slugFromUrl.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    // DATABASE PLAYER MATCHUP NOTES RETRIEVAL HERE TODO

    res.render('matchup-notes-add', { 
        title: `Add Matchup Note for ${formattedName} - NBA Player Matchup Notes`,
        playerSlug: slugFromUrl,
        playerName: formattedName
    });
});
  
// POST for add player page
router.post('/:playerSlug/add', (req, res) => {
	const playerSlug = req.params.playerSlug;

    // DATABASE SAVING HERE TODO
    const { opponent, points, assists, rebounds, notes } = req.body;

    // 2. Redirect back to the dynamic player page
    // This will send them to: http://localhost:3000/matchups/lebron-james
    res.redirect(`/matchups/${playerSlug}`);
});


// GET player matchup notes list page
router.get('/:playerSlug', function(req, res, next) {
    const slugFromUrl = req.params.playerSlug;

    // formatted slug for display, may remove this when database retrieval is implemented
    // as the database will store the display name
    const formattedName = slugFromUrl.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    // DATABASE PLAYER MATCHUP NOTES RETRIEVAL HERE TODO

    res.render('matchup-notes-player', { 
        title: `${formattedName} Matchup Notes - NBA Player Matchup Notes`,
        playerSlug: slugFromUrl,
        playerName: formattedName
    });
});


module.exports = router;