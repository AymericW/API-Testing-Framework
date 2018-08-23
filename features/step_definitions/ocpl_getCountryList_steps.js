var request = require('request-promise');
var stringify = require('json-stringify-safe');
var chai = require('chai').assert;

var GetCountryTest = function () {
  var queryResponse;
  var TARGET_ENV = process.env.TARGET_ENV || "QA+1";
  var getCountry = "/OCPL-pr90/rpc/v1/countries";

  // this.Given(/^I send a request to PBIA-pr90 CheckAppEnabled to check the forced upgrade$/, function(callback) {
  //   callback();
  // });

  this.When(/^I try to hit getCountryList Service with request$/, function (callback) {
    var reqOptions = {
      url:this.ENVIRONMENTS[TARGET_ENV]+getCountry+"?lang=fr",
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
        chai.equal(country.label,'Belgique','Country Language is incorrect')
    });

  }
};
module.exports = GetCountryTest;
