const router = require('express').Router();

router.route('/add').post((req, res) => {
  //album info
  const email = req.body.email;
  const artistnews = req.body.artistnews;
  const appnews = req.body.appnews;
  const livestream = req.body.albumName;
  const feedback = req.body.feedback;
  const message = req.body.message;

  const newPdxbusk = new Pdxbusk({
    email,
    artistnews,
    appnews,
    livestream,
    feedback,
    message
  });

  newPdxbusk.save()
    .then(() => res.json('Entry added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;