twitterService = require('./services/twitter');

main = (cb) => {
	
  twitterService.tweet('test tweet', (err) => {
    if (err) return cb(err);
    console.log('tweeted!');
    return cb();
  })
}

main((err) => {
  if (err) throw JSON.stringify(err);
  console.log('DONE!');
});