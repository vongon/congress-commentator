
// tweeting PAC contributions every 2 hours in tweetPacs
const okayToTweet = (transaction) => {
  if (!transaction.tweetedAt) {
    return true;
  }
  const tweetedAt = new moment(transaction.tweetedAt);
  const cutoff = new moment().subtract(24, 'h');
    if (tweetedAt.isBefore(cutoff)) {
      return true;
    }
  return false;
};

// tweeting individual contributions every 6 hours in tweetIndivContributions
const indivContrOkayToTweet = (transaction) => {
  if (!transaction.tweetedAt) {
    return true;
  }
  const tweetedAt = new moment(transaction.tweetedAt);
  const cutoff = new moment().subtract(6, 'h');
    if (tweetedAt.isBefore(cutoff)) {
      return true;
    }
  return false;
};

const trimString = (string, maxLength) => {
  if (!string) {
    var temp = String(string); 
    var replaced = temp.replace("", "N/A")
    return replaced; 
  }
  var trimmedString = string.substr(0, maxLength);
  // lastWord regex match will return null if we don't remove punctuation first
  trimmedString = trimmedString.replace(/\b[-.,()&$#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, "");
  // now re-trim if we are in the middle of a word
  trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
  // remove awkward words at ends of phrases
  // var lastWord = trimmedString.match(/\w+$/)[0];
  // var lastIndex = trimmedString.lastIndexOf(" ");
  // // var lastWordsOkayToDelete = ['of','the', 'and', 'for', 'with', 'to', 'ending' ]
  // if (lastWord == 'of' ||
  //       lastWord == 'the' ||
  //       lastWord == 'and' ||
  //       lastWord == 'for' ||
  //       lastWord == 'with' ||
  //       lastWord == 'to' ||
  //       lastWord == 'to' ||
  //       lastWord == 'ending') {
  //       trimmedString = trimmedString.substring(0, lastIndex);
  //   }
    return trimmedString + `...`;  
}

// handle null values for string methods
const handleNullValues = (obj) => {
  Object.keys(obj).forEach((key) => {
    if(obj[key] == null) {
      obj[key] = '-';
    } 
  })
  return obj;
};

// handle individual donor contributor names for string methods
const handleIndivContributorName = (name) => {
 // var temp = name.replace(/^(.+?) ([^\s,]+)(,? (?:[JS]r\.?|III?|IV))?$/i,"$2, $1$3");
 // return temp.replace(/,/g, '')
  
  var temp = name.split(' ')
  var reversed = temp[temp.length - 1] + ' ' + temp[temp.length - 2] + ' ' + temp[temp.length - 4] +  ' ' + temp[temp.length - 3] 

  var tempReversed = reversed.split(' ')
  var PATTERN = 'undefined'
  var filtered = tempReversed.filter(function (str) { return str.indexOf(PATTERN) === -1; });
  
  var donorName =filtered.join(', ')

  return donorName.replace(/,/g, '')
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
   'the':"the",
   'And':"and",
   'and': "and",
   ' - Mpl Pac Akd Physician Insurers Of America Pac': "",
   ' For Rural Electrification (Acre)': "",
   ' - Usaa Employee Pac': "",
   '/International Union Of Operating Engineers': "",
   "The National Rural Electric Cooperative Association Action Committee For Rural Electrifica": "Nat'l. Rural Electric Co-op",
   'Farmers Group, Inc., Farmers Insurance Exchange, Fire Insurance Exchange And Truck Insurance Exch...': "Farmers Insurance PAC",
   'Texas Association For Home Care & Hospice, Inc. Texas Home Care & Hospice PAC- Federal': "",
   'Political Action Comm': "PAC"
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

// to avoid 186 errors, abbreviate
const handleRecipientDesc = (str) => {
  var thingsWeDontCareAbout = ['CREDIT CARD MERCHANT FEES' ]

  var replaceDict = {
    '(see Below If Itemized)':""
  };
  // remove anything in parentheses
  str = str.replace(/ *\([^)]*\) */g, " ");
  // replace anything in the dict with correct word
  var re = new RegExp(Object.keys(replaceDict).join("|"),"gi");
  str = str.replace(re, function(matched){
    return replaceDict[matched];
  });
  return str
};

module.exports = {
    okayToTweet: okayToTweet,
    indivContrOkayToTweet: indivContrOkayToTweet,
    handleNullValues: handleNullValues,
    handleDonorName: handleDonorName,
    toProperCase: toProperCase,
    trimString: trimString,
    handleRecipientDesc: handleRecipientDesc,
    handleIndivContributorName: handleIndivContributorName
};
