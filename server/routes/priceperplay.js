const router = require('express').Router();

router.route('/priceperplay').get(async (req, res) => {
  try {
    const priceperplay = priceperplay.find()
    const priceperplayStrings = priceperplay.rows.map(priceperplay => priceperplay.priceperplay)

    res.json(priceperplayStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

module.exports = router
