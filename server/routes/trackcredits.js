const router = require('express').Router();
// let trackcredits = require('../models/trackcredits.model');

router.route('/trackcredits').get(async (req, res) => {
  try {
    const trackcredits = trackcredits.find()
    const trackcreditstrings = trackcredits.rows.map(trackcredits => trackcredits.trackcredits)

    res.json(trackcreditstrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

module.exports = router
