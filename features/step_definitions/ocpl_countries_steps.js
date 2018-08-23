var request = require('request-promise');
var stringify = require('json-stringify-safe');
var chai = require('chai').assert;

var getCountriesTest = function () {
  var languageFactor;
  var queryResponse;
  var TARGET_ENV = process.env.TARGET_ENV || "QA+1";
  var getCountries = "/OCPL-pr90/rpc/v1/countries";

  // this.Given(/^I send a request to PBIA-pr90 CheckAppEnabled to check the forced upgrade$/, function(callback) {
  //   callback();
  // });

  this.When(/^I try to hit getCountryList Service with request (.*)$/, function (language, callback) {
    languageFactor = JSON.parse(language);
    var reqOptions = {
      url:this.ENVIRONMENTS[TARGET_ENV]+getCountries+"?lang="+languageFactor,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      json: true,
      resolveWithFullResponse: true,
      simple: false
    };
    if (process.env.HTTP_PROXY){
      reqOptions.proxy = process.env.HTTP_PROXY;
    }

    request(reqOptions)
    .then(function (response) {
      queryResponse = response.body;
      callback();
    })
    .catch(function (err) {
      throw "*** ERROR DUDE: "+err.toString();
    });
  });

  this.Then(/^I should be able to get the correct country list$/, function (callback) {

    var yamlValidationResult = this.validateApiDefinition(queryResponse,"retrieve");
    if(yamlValidationResult.isValid){
      validateResponse(queryResponse);
      callback();
    }else{
      callback(new Error("Response doesnt respect the api definition with the Error : " + yamlValidationResult.message));
    }
  });

  function validateResponse(response){
    chai.isNotNull(response, "response is null");
    chai.isDefined(response, 'response is undefined');

    chai.isNotNull(response[0].code, "countryCode is null");
    chai.isDefined(response[0].label, "countryCode is undefined");

    chai.isAbove(response.length, 200, 'Not all countries are returned');
    
    response.forEach(country => {
      if(country.code === 'BE')
        validateLanguage(country.label);
    });
  }

  function validateLanguage(countryLabel){
    switch(languageFactor){
        case 'en':
          chai.equal(countryLabel,'Belgium','Country Language is incorrect')
          break;
        case 'fr':
          chai.equal(countryLabel,'Belgique','Country Language is incorrect')
          break;
        case 'nl':
          chai.equal(countryLabel,'Belgie','Country Language is incorrect')
          break;
        case 'de':
          chai.equal(countryLabel,'Belgien','Country Language is incorrect')
          break;
        default:
          callback(new Error("CountryLanguage InValid"));
          break;
    }
  }
};
module.exports = GetCountryTest;
