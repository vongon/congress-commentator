const mongoose = require('mongoose');
const async = require('async');

const importData = require('./app/importData');
const processData = require('./app/processData');
const tweetVote = require('./app/tweetVote');
const tweetContribution = require('./app/tweetContribution');
const tweetPACs = require('./app/tweetPACs')
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
      // import data 
      importData(sCb);
    },
    // (sCb) => {
    //   processData(sCb);
    //   // 1. creates meme
    //   // 2. uploads to imgur
    //   // 3. saves imgur link to db
      
    // },
    (sCb) => {
      // tweet votes
      tweetVote(sCb);
      // TODO: create alt text for each image so screen readers can read tweets      
    }, 
    (sCb) => {
      // tweet contribution
      tweetContribution(sCb);
    },
    (sCb) => {
      // tweet PAC contribution data
      tweetPACs(sCb);
    }
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
