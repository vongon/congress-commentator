twitterService = require('./services/twitter');
var fs = require('fs');

main = (cb) => {
	
  // twitterService.tweet('test tweet', (err) => {
  //   if (err) return cb(err);
  //   console.log('tweeted!');
  //   return cb();
  // })

  function tweetBill() {	
	console.log('Attempting the tweetBill function!')
	// read the file and send to the cb
	fs.readFile('./example-member-vote-data.json', handleBillData) 
	  
	function handleBillData(err, data) {
		if (err) {
		  throw err
		  console.log('There was an error with the handleBillData function.')
		} 
		// Parse the buffer that fs.readFile creates and store it in a variable we can use
		var proPublicaData = JSON.parse(data)

		// 'votes' is an array and here we are just returning the first index; 
		var mostRecentBill = proPublicaData.results[0].votes[0]

		// this is the stuff we want to tweet
		console.log ('Using fs.readFile to read the bill data! Roger Williams member ID is: ' + proPublicaData.results[0].member_id + '. Here is the most recent bill action was taken on: '+ mostRecentBill.bill.number + '. Most recent vote: ' + mostRecentBill["position"])
		
		// trying to throw something into a variable we can tweet...but....		
		var params = { status: 'Most recent vote: ' +  mostRecentBill.bill.number }
		
		// ...there appears to be some scope issue with the twitterService function...
		twitterService.tweet('Roger Williams member ID is: ' + proPublicaData.results[0].member_id + '. Here is the most recent bill action was taken on: '+ mostRecentBill.bill.number + '. Most recent vote: ' + mostRecentBill["position"], function (err, data, response) {
		  if (err) return cb(err);
		  console.log('Success!');
		  return cb();
		}) 
	  }
	}	

tweetBill();

} //end Main



main((err) => {
  if (err) throw JSON.stringify(err);
  console.log('DONE!');
});