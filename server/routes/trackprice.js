const router = require('express').Router();

router.route('/trackprice').get(async (req, res) => {
  try {
    const trackprice = trackprice.find()
    const trackpriceStrings = trackprice.rows.map(trackprice => trackprice.trackprice)

    res.json(trackpriceStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

module.exports = router
