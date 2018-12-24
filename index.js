const mongoose = require('mongoose');
const async = require('async');

const importData = require('./app/importData');
const tweet = require('./app/tweet');
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
      // tweet
      tweet(sCb);
    }
  ], cb);
}

main((err) => {
  if (err) throw JSON.stringify(err);
  console.log('DONE!');
  process.exit();
});


// main = (cb) => {
//   function tweetMostRecentBill() {	
// 	proPublicaService.getLatestVoteData(function (err, res) {
//   	  if (err) {
// 		  throw err
// 		} 
// 	  // Store response from ProPublicaCongress API memberVotePositions endpoint and in a variable 
// 		var proPublicaData = res

// 		// 'votes' is an array; here we are just returning the first index of that array:
// 		var mostRecentBill = proPublicaData.results[0].votes[0]

// 		// in case we ever want to loop through the votes
// 		var billsArray = proPublicaData.results[0].votes 

// 		// date of the vote and some other useful variables, using substring method to shorten question & description
// 		var mostRecentVoteDate = proPublicaData.results[0].votes[0].date
// 		var abbreviatedBillQuestion = proPublicaData.results[0].votes[0].question.substring(0,30)
// 		var abbreviatedBillDescription = mostRecentBill.description.substring(0,65)

// 		// Logging some basics to the console
// 		console.log ('Using the ProPublica memberVotePositions API endpoint to to read the bill data. Roger Williams member ID is: ' + proPublicaData.results[0].member_id + '. Here is the most recent bill action was taken on: '+ mostRecentBill.bill.number + '. Most recent vote: ' + mostRecentBill["position"])
		
// 		// storing the data we want to tweet in a variable -- once deployed, member's Twitter handle should be used	
// 		var params = '"' + abbreviatedBillQuestion + '" on ' + mostRecentBill.bill.number + 
// 		', Roger Williams (R-Weatherford) voted "' + mostRecentBill["position"] + '". \n\nShort Description: "' + 
// 		abbreviatedBillDescription +'".\n\n' + mostRecentBill.total["yes"] + ' member(s) voted "Yes". ' 
// 		+  mostRecentBill.total["no"] + ' voted "No". ' + mostRecentBill.total["not_voting"] 
// 		+ ' not voting. Result: ' + mostRecentBill.result + ' ' + mostRecentVoteDate + '.' 	

// 		// tweeting
// 		twitterService.tweet(params, function (err, data, response) {
// 		  if (err) return cb(err);
// 		  console.log('Success! Here is the bill info the bot tweeted about:', proPublicaData.results[0].votes[0]);
// 		  return cb();
// 		}) 
//   	});
//   }	

// tweetMostRecentBill();

// } //end Main


 		