const mongoose = require('mongoose')
require('mongoose-type-url');
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
  
  // store imgurUrl for each vote
  imgurUrl: {
    string: mongoose.SchemaTypes.Url
    }
  }
});

module.exports = mongoose.model('Vote', Vote);