const router = require('express').Router();
let track = require('../models/track.model');

router.route('/').get((req, res) => {
  track.find()
    .then(tracks => res.json(tracks))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const title = req.body.title;
  const artist = req.body.artist;
  const releasedate = req.body.releasedate;
  const description = req.body.description;

  const newtrack = new track({
    title ,
    artist,
    releasedate,
    description,
  });

  newtrack.save()
    .then(() => res.json('Track added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  track.findById(req.params.id)
    .then(track => res.json(track))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  track.findByIdAndDelete(req.params.id)
    .then(() => res.json('track deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  track.findById(req.params.id)
    .then(track => {
      track.trackName = req.body.trackName;
      track.artist = req.body.artist;
      track.album = req.body.album;
      track.releaseDate = req.body.releaseDate;
      track.personel = req.body.personel;
      track.catalogNumber = req.body.catalogNumber;

      track.save()
        .then(() => res.json('Profile updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;