const router = require('express').Router();

router.route('/etherrate').get(async (req, res) => {
  try {
    const etherrate = etherrate.find()
    const etherrateStrings = etherrate.rows.map(etherrate => etherrate.etherrate)

    res.json(etherrateStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

module.exports = router
