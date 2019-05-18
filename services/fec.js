const request = require('request');
const config = require('../config');

exports.getPacContributions = getPacContributions = (cb) => {
	const options = {
		method: 'GET',
		url: `https://api.open.fec.gov/v1/schedules/schedule_a/?api_key=` + config.fec.api_key + `&sort_hide_null=false&sort_nulls_last=true&sort=-contribution_receipt_date&per_page=100&committee_id=` + config.fec.committee_id + `&two_year_transaction_period=2020&is_individual=false`,
		json: true
	}

	request(options, (err, response, body) => {
	  if (err) {
	    return cb(err);
	  }
	  // do any modification or filtering here needed to get the contribution data
	  console.log('Loading FEC receipts data for ' + config.congressPerson.name + ', ' + config.fec.committee_id);
	  return cb(null, body);
	});
}

exports.getIndivContributions = getIndivContributions = (cb) => {
	const options = {
		method: 'GET',
		url: `https://api.open.fec.gov/v1/schedules/schedule_a/?api_key=` + config.fec.api_key + `&sort_hide_null=false&sort_nulls_last=true&sort=-contribution_receipt_date&per_page=100&committee_id=` + config.fec.committee_id + `&two_year_transaction_period=2020&is_individual=true`,
		json: true
	}

	request(options, (err, response, body) => {
	  if (err) {
	    return cb(err);
	  }
	  // do any modification or filtering here needed to get the contribution data
	  console.log('Loading FEC individual receipts data for ' + config.congressPerson.name + ', ' + config.fec.committee_id);
	  return cb(null, body);
	});
}

exports.getCampaignExpenditures = getCampaignExpenditures = (cb) => {
	const options = {
		method: 'GET',
		url: `https://api.open.fec.gov/v1/schedules/schedule_b/?api_key=` + config.fec.api_key + `&sort_hide_null=false&sort_nulls_last=true&sort=-disbursement_date&per_page=100&committee_id=` + config.fec.committee_id + `&two_year_transaction_period=2020`,
		json: true
	}

	request(options, (err, response, body) => {
	  if (err) {
	    return cb(err);
	  }
	  // do any modification or filtering here needed to get the contribution data
	  console.log('Loading FEC expenditure data for ' + config.congressPerson.name + ', ' + config.fec.committee_id);
	  return cb(null, body);
	});
}



