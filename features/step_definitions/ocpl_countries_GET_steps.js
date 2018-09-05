var fs = require('fs');
var request = require('request-promise');
var stringify = require('json-stringify-safe');
var chai = require('chai').assert;
var path = require('path');

var getCountriesTest = function () {
  
  var queryResponse;
  var TARGET_ENV = process.env.TARGET_ENV || "QA+1";
  var countriesLink = "/OCPL-pr90/rpc/v1/countries";

  // this.Given(/^I send a request to PBIA-pr90 CheckAppEnabled to check the forced upgrade$/, function(callback) {
  //   callback();
  // });

/*############################################### GET countries according language ###############################################*/

  When(/^I try to retrieve country list with request (.*)$/, function (language, callback) {
    
    var reqOptions = {
      url: this.ENVIRONMENTS[TARGET_ENV] + countriesLink + "?lang=" + language,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      json: true,
      resolveWithFullResponse: true,
      simple: false
    };
    
    console.log(reqOptions.url);
    if (process.env.HTTP_PROXY){
      reqOptions.proxy = process.env.HTTP_PROXY;
    }

    request(reqOptions)
    .then(function (response) {
      queryResponse = response.body;
      // console.log(queryResponse);
      //fs.writeFileSync('countries.json',JSON.stringify(queryResponse));l
      callback();
    })
    .catch(function (err) {
      throw "*** ERROR DUDE: "+err.toString();
    });
  });

/*############################################## Validate GET countries response with yaml ##############################################*/

  Then(/^I should be able to get the correct country list (.*)$/, (language, callback) => {

    chai.deepEqual(queryResponse, loadCountriesReference(language));
    callback();

  });

};

/*######################################################### FUNCTIONS #########################################################*/

function loadCountriesReference(language){
  
  let filePath;
  
  switch(language){
    case "en":
      filePath = "./references/countryList/countriesEnglish.json";
      break;
    case "fr":
      filePath= "./references/countryList/countriesFrench.json";
      break;
    case "nl":
      filePath= "./references/countryList/countriesDutch.json";
      break;
    case "de":
      filePath= "./references/countryList/countriesGerman.json";
      break;
    default:
      callback(new Error("CountryLanguage InValid"));
      break;
  }

  return JSON.parse(fs.readFileSync(path.resolve(filePath)));

}

module.exports = getCountriesTest;
