
// tweeting PAC contributions every 2 hours in tweetPacs
const okayToTweet = (contribution) => {
  if (!contribution.tweetedAt) {
    return true;
  }
  const tweetedAt = new moment(contribution.tweetedAt);
  const cutoff = new moment().subtract(2, 'h');
    if (tweetedAt.isBefore(cutoff)) {
      return true;
    }
  return false;
};

// handle null values for string methods
const handleNullValues = (obj) => {
  Object.keys(obj).forEach(function(key) {
    if(obj[key] === null) {
      obj[key] = '-';
    }
  })
  return obj;
};

// to avoid 186 errors, abbreviate
const handleDonorName = (str) => {
  var mapObj = {
   'Political Action Committee':"PAC",
   'pac':"PAC",
   'Pac':"PAC",
   'political action committee':"PAC",
   'Association':"Assn.",
   'Companies':"Co's."
  };

  var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
  str = str.replace(re, function(matched){
    return mapObj[matched];
  });
  return str
};

// properCase helper -- FEC data is all caps
const toProperCase = (string) => {
	return string.replace(/\w\S*/g, (txt) => { 
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

module.exports = {
    okayToTweet: okayToTweet,
    handleNullValues: handleNullValues,
    handleDonorName: handleDonorName,
    toProperCase: toProperCase
};

