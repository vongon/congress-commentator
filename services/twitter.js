var Twitter = require('twitter');

var config = require('../config');

var client = new Twitter({
  consumer_key: config.twitterKeys.consumer_key,
  consumer_secret: config.twitterKeys.consumer_secret,
  access_token_key: config.twitterKeys.access_token_key,
  access_token_secret: config.twitterKeys.access_token_secret
});

exports.tweet = (message, cb) => {
  // if (process.env.NODE_ENV !== 'production') {
  //   console.log(`---- Skipping actual tweet because NODE_ENV !== 'production' ----`);
  //   return cb();
  // }
  client.post('statuses/update', { status: message }, cb);
}
