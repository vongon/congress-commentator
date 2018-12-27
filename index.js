const mongoose = require('mongoose');
const async = require('async');

const importData = require('./app/importData');
const tweet = require('./app/tweet');
const config = require('./config');

const main = (cb) => {

  importData(cb);
}

main((err) => {
  if (err) throw JSON.stringify(err);
  console.log('DONE!');
  process.exit();
});
  