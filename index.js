const mongoose = require('mongoose');

const importData = require('./app/importData');
const tweet = require('./app/tweet');
const config = require('./config');
 

const main = (cb) => {

  // import new data from propublica
  // importData(cb);

  // tweet
  tweet();
}

main((err) => {
  if (err) throw JSON.stringify(err);
  console.log('DONE!');
  process.exit();
});
  