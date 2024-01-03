const router = require('express').Router();
let Album = require('../models/album.model')

router.route('/').get((req, res) => {
  Album.find()
    .then(albums => res.json(albums))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  //album info
  const photoUrl = req.body.photoUrl;
  const version = req.body.version;
  const privacy = req.body.privacy;
  const albumName = req.body.albumName;
  const artistName = req.body.artistName;
  const genres = req.body.genres;
  const description = req.body.description;

  //sales and download options
  const downloadoptions = req.body.downloadoptions;
  const albumprice = req.body.albumprice;
  const trackprice = req.body.trackprice;
  const bonusitem = req.body.bonusitem;

  //tags ect
  const etc = req.body.etc;

  //metadata
  const isMusic = req.body.isMusic;
  const artist = req.body.artist;
  const publisher = req.body.publisher;
  const isrc = req.body.isrc;
  const composer = req.body.composer;
  const buyLink = req.body.buyLink;
  const recordLabel = req.body.recordLabel;
  const releaseDate = req.body.releaseDate;
  const barcode = req.body.barcode;
  const iswc = req.body.iswc;
  const pline = req.body.pline;
  const explicit = req.body.explicit;
  
  //privacy
  const license = req.body.license;

  //permissions
  const downloadpermission = req.body.downloadpermission;
  const embedcode = req.body.embedcode;
  const offline = req.body.offline;
  const appplayback = req.body.appplayback;
  const rss = req.body.rss;

  //extra 
  const tracks = req.body.tracks;
  const credits = req.body.credits;
  const catalognumber = req.body.catalognumber;
  const tags = req.body.tags;
    if (tags) {
      const tagArray = tags.split(',');
      // ...
    }
  const plays = req.body.plays

  const newAlbum = new Album({
    photoUrl,
    albumversion,
    privacy, 
    albumName, 
    artistName,
    genres,
    description,

    // sales and download options
    downloadoptions,
    albumprice,
    trackprice,
    bonusitem,

    //tags ect \
    etc,

    //metadata
    isMusic,
    artist,
    publisher,
    isrc,
    composer,
    buyLink,
    recordLabel,
    releaseDate,
    barcode,
    iswc,
    pline,
    explicit,

    //privacy
    license,

    //permissions
    downloadpermission,
    embedcode,
    offline,
    appplayback,
    rss,

    // extra
    tracks,
    credits,
    catalognumber,
    tags,
    plays,
  });

  newAlbum.save()
    .then(() => res.json('Album added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Album.findById(req.params.id)
    .then(album => res.json(album))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Album.findByIdAndDelete(req.params.id)
    .then(() => res.json('Album deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').put((req, res) => {
  Album.findOneAndUpdate ({ _id: req.params.id }, req.body)    
        .then(() => res.json('Album updated!'))
        .catch(err => res.status(400).json('Error: ' + err))
})


module.exports = router;