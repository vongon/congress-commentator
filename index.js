twitterService = require('./services/twitter');
var fs = require('fs');

main = (cb) => {
	
  // twitterService.tweet('test tweet', (err) => {
  //   if (err) return cb(err);
  //   console.log('tweeted!');
  //   return cb();
  // })

  function tweetBill() {	
	// read the file and send to the cb
	fs.readFile('./example-member-vote-data.json', handleBillData) 
	  
	function handleBillData(err, data) {
		if (err) {
		  throw err
		} 
		// Parse the buffer that fs.readFile creates and store it in a variable we can use
		var proPublicaData = JSON.parse(data)

		// 'votes' is an array and here we are just returning the first index; 
		var mostRecentBill = proPublicaData.results[0].votes[0]

		var billsArray = proPublicaData.results[0].votes 

		// date of the vote
		var voteDate = proPublicaData.results[0].votes[0].date
		var abbreviatedBillQuestion = proPublicaData.results[0].votes[0].question.substring(0,30)
		var abbreviatedBillDescription = mostRecentBill.description.substring(0,65)


		// Logging some basics to the console
		console.log ('Using fs.readFile to read the bill data. Roger Williams member ID is: ' + proPublicaData.results[0].member_id + '. Here is the most recent bill action was taken on: '+ mostRecentBill.bill.number + '. Most recent vote: ' + mostRecentBill["position"])
		
		// storing the data we want to tweet in a variable -- once deployed, member's Twitter handle should be used	
		var params = '"' + abbreviatedBillQuestion + '" on ' + mostRecentBill.bill.number + 
		', Roger Williams (R-Weatherford) voted "' + mostRecentBill["position"] + '". \n\n Description: "' + 
		abbreviatedBillDescription +'".\n\n' + mostRecentBill.total["yes"] + ' member(s) voted "Yes".\n' 
		+  mostRecentBill.total["no"] + ' voted "No".\n' + mostRecentBill.total["not_voting"] 
		+ ' not voting.\n Result: ' + mostRecentBill.result + ' ' + voteDate + '.' 
		
		// tweeting
		twitterService.tweet(params, function (err, data, response) {
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


// var params = 'On ' + voteDate + ', Roger Williams voted "' + mostRecentBill["position"] 
// 		+ '"" on ' + billQuesion + mostRecentBill.bill.number + '. \n' + 'Description: "' 
// 		+ billDescription + '". \n' + mostRecentBill.total["yes"] + ' member(s) voted "Yes". \n ' 
// 		+  mostRecentBill.total["no"] + ' member(s) voted "No". \n\n ' + mostRecentBill.total["not_voting"] 
// 		+ ' member(s) not voting.\n\n The bill ' + mostRecentBill.result + ' in the ' + mostRecentBill.chamber + '.' 
// 		