const router = require('express').Router();

router.route('/liverate').get(async (req, res) => {
  try {
    const liverate = liverate.find()
    const liverateStrings = liverate.rows.map(liverate => liverate.liverate)

    res.json(liverateStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

module.exports = router
