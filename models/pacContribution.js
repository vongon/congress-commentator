const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PACContribution = new Schema({
  // mixed type for PAC data from the FEC
  data: {},
  
  // set this date when we tweet about this contribution
  tweetedAt: Date,

  // timestamp when this document was created
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('PACContribution', PACContribution);