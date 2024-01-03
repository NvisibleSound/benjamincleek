const router = require('express').Router();

router.route('/filetype').get(async (req, res) => {
  try {
    const filetype = filetype.find()
    const filetypeStrings = filetype.rows.map(filetype => filetype.filetype)

    res.json(filetypeStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

module.exports = router
