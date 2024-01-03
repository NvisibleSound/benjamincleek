const router = require('express').Router();
let Profile = require('../models/profile.model');

router.route('/').get((req, res) => {
  Profile.find()
    .then(profile => res.json(profile))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const first = req.body.first;
  const last = req.body.last;
  const email = req.body.email;
  const password = req.body.password;
  const dob = req.body.dob;
  const location = req.body.location;

  const newProfile = new Profile({
    username,
    first,
    last,
    email,
    password,
    dob,
    location,
  });

  newProfile.save()
    .then(() => res.json('Profile added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Profile.findById(req.params.id)
    .then(profile => res.json(profile))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Profile.findByIdAndDelete(req.params.id)
    .then(() => res.json('Profile deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').put((req, res) => {
  Profile.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => res.json('Profile updated!'))
    .catch(err => res.status(400).json('Error: ' + err))
})


module.exports = router;