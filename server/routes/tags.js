const router = require('express').Router();
// let tag = require('../models/tag.model');

router.route('/tags').get(async (req, res) => {
  try {
    const tags = tag.find()
    const tagsStrings = tags.rows.map(tags => tags.tags)

    res.json(tagsStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

module.exports = router
