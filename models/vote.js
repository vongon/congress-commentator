const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Vote = new Schema({
  // mixed type for vote from propublica
  data: {},
  
  // set this date when we tweet this bill
  tweetedAt: Date,

  // timestamp when this document was created
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Vote', Vote);