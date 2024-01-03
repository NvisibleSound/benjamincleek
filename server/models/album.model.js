const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const albumSchema = new Schema({
  //album info
  fileurl: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  version: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  privacy: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  albumname: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  artistname: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  genres: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },  
  description: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },

  //sales and download options
  downloadoption: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  albumPrice: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  trackPrice: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  bonusitem: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },

  //tags etc
  etc: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },

  //metadata
  ismusic: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  artist: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  publisher: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  isrc: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  composer: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },

  buylink: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  recordlabel: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  releasedate: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  barcode: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  iswc: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  pline: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  explicit: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  license: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },

  //permissions
  download: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  embedcode: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  offline: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  appplayback: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  rss: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },

  //extra
  tracks: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  credits: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  catalognumber: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  tags: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  plays: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
}, {
  timestamps: true,
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;