const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Expenditure = new Schema({
  // mixed type for campaign expenditure data from the FEC
  data: {},
  
  // set this date when we tweet about this expenditure
  tweetedAt: Date,

  // timestamp when this document was created
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Expenditure', Expenditure);