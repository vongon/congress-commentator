const mongoose = require('mongoose');
const Vote = require('./vote');
 
mongoose.connect('mongodb://localhost/congress-commentator', { useNewUrlParser: true }, (err) => {
	if (err) throw err;
	console.log('connected');
	console.log({Vote});
	const vote = new Vote({vote:'test'});


	vote.save((err)=>{
		if (err) throw err;
		console.log('Done');
	});
});


