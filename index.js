const mongoose = require('mongoose');
const async = require('async');

const importData = require('./app/importData');
const tweetVote = require('./app/tweetVote');
const tweetContribution = require('./app/tweetContribution');
const config = require('./config');


const main = (cb) => {
  async.series([
    (sCb) => {
      // connect to database
      const options = config.mongo.options;
      options.useNewUrlParser = true;
      mongoose.connect(config.mongo.connectionString, options, sCb);
    },
    (sCb) => {
      // import new data from propublica
      importData(sCb);
    },
    (sCb) => {
      // tweet votes
      tweetVote(sCb);
    }, 
    (sCb) => {
      // tweet contribution
      tweetContribution(sCb);
    },
  ], cb);
}

main((err) => {
  if (err) {
    throw JSON.stringify(err);
    process.exit(1); // just to make sure the program quits when an error is thrown.
  }
  console.log('DONE!');
  process.exit();
});
