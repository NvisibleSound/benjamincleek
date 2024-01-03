const router = require('express').Router();

router.route('/bonusitem').get(async (req, res) => {
  try {
    const bonusitem = bonusitem.find()
    const bonusitemStrings = bonusitem.rows.map(bonusitem => bonusitem.bonusitem)

    res.json(bonusitemStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

module.exports = router
