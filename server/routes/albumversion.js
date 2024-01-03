const router = require('express').Router();
// let version = require('../models/version.model');

router.route('/albumversion').get(async (req, res) => {
  try {
    const albumversion = albumversion.find()
    const albumVersionStrings = albumversion.rows.map(albumversion => albumversion.albumversion)

    res.json(albumVersionStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

module.exports = router
