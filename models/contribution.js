const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Contribution = new Schema({
  // mixed type for FEC data from from propublica
  data: {},
  
  // set this date when we tweet about this contribution
  tweetedAt: Date,

  // timestamp when this document was created
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Contribution', Contribution);