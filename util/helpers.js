
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

// trim tweet Question & Description 
const trimString = (string, maxLength) => {
  var trimmedString = string.substr(0, maxLength);
  // lastWord regex match will return null if we don't remove punctuation first
  trimmedString = trimmedString.replace(/\b[-.,()&$#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, "");
  // now re-trim if we are in the middle of a word
  trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
  // remove awkward words at ends of phrases
  var lastWord = trimmedString.match(/\w+$/)[0];
  var lastIndex = trimmedString.lastIndexOf(" ");

  // var lastWordsOkayToDelete = ['of','the', 'and', 'for', 'with', 'to', 'ending' ] 
    if (lastWord == 'of' ||
        lastWord == 'the' ||
        lastWord == 'and' ||
        lastWord == 'for' ||
        lastWord == 'with' ||
        lastWord == 'to' ||
        lastWord == 'to' ||
        lastWord == 'ending') {
        trimmedString = trimmedString.substring(0, lastIndex);
    }
  return trimmedString + `...`; 
}

// handle null values for string methods
const handleNullValues = (obj) => {
  Object.keys(obj).forEach(function(key) {
    if(!obj[key]) {
      obj[key] = '-';
    }
  })
  return obj;
};

// to avoid 186 errors, abbreviate
const handleDonorName = (str) => {
  var abbrevDict = {
   'Political Action Committee':"PAC",
   'pac':"PAC",
   'Pac':"PAC",
   'political action committee':"PAC",
   'Political Committee':"PAC",
   'Separate Segregated Fund':"SSF",
   'separate segregated fund':"SSF",
   'Association':"Assn.",
   'Companies':"Co's.",
   'National':"Nat'l.",
   'International':"Int'l.",
   'The':"the",
   'And':"and",
   ' - Mpl Pac Akd Physician Insurers Of America Pac': "",
   ' For Rural Electrification (Acre)': "",
   ' - Usaa Employee Pac': "",
   '/International Union Of Operating Engineers': "",
   'The National Rural Electric Cooperative Association Action Committee For Rural Electrification (Acre)': "Nat'l. Rural Electric Co-op Assn."
  };
  // remove anything in parentheses
  str = str.replace(/ *\([^)]*\) */g, " ");
  // replace anything in the dict with correct word
  var re = new RegExp(Object.keys(abbrevDict).join("|"),"gi");
  str = str.replace(re, function(matched){
    return abbrevDict[matched];
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
    toProperCase: toProperCase,
    trimString: trimString
};
