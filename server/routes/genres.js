const router = require('express').Router();
// let genres = require('../models/genres.model');

router.route('/genres').get(async (req, res) => {
  try {
    const genres = Genres.find()
    const genreStrings = genres.rows.map(genres => genres.genres)

    res.json(genreStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

module.exports = router
