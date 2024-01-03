const router = require('express').Router();

router.route('/albumprice').get(async (req, res) => {
  try {
    const albumprice = albumprice.find()
    const albumpriceStrings = albumprice.rows.map(albumprice => albumprice.albumprice)

    res.json(albumpriceStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

module.exports = router
