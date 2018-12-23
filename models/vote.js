const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Vote = new Schema({
  vote: {},
  createdAt: {
    type: Date,
    default: Date.now
  },
  tweetedAt: Date // set this date when we tweet this bill
});

module.exports = mongoose.model('Vote', Vote);