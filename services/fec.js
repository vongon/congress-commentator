const request = require('request-promise');
const config = require('../config')

exports.getPacContributions = getPacContributions = (cb) => {
	const options = {
		method: 'GET',
		url: `https://api.open.fec.gov/v1/schedules/schedule_a/?api_key=` + config.fec.api_key + `&sort_hide_null=false&sort_nulls_last=true&sort=-contribution_receipt_date&per_page=4&committee_id=` + config.fec.committee_id + `&two_year_transaction_period=2018&is_individual=false`,
		json: true
	}

	request(options)
	  .then((response) => {  
	    return cb(null, response)
	    process.stdout.write('Loading FEC receipts data for ' + config.congressPerson.name + ', ' + config.fec.committee_id);
	  })
	  .catch((err) => {
	  	console.log(err)
	  })	
}
