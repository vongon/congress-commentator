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
      mongoose.connect(config.mongo.connectionString, { useNewUrlParser: true }, sCb);    
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
  if (err) throw JSON.stringify(err);
  console.log('DONE!');
  process.exit();
});
