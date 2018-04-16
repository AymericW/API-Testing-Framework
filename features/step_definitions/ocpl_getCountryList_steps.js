var request = require('request-promise');
var stringify = require('json-stringify-safe');
var chai = require('chai').assert;

var GetContextTest = function () {
  var queryResponse;
  var TARGET_ENV = process.env.TARGET_ENV || "QA+1";
  var getCountry = "/OCPL-pr90/rpc/CJBRC/getCountryList";
  const ENVIRONMENTS = {
    "TEST2"   : "https://app.easybanking.test2access.qabnpparibasfortis.be",
    "TEST"  : "https://easybanking.testaccess.qabnpparibasfortis.be",
    "QA"    : "https://easybanking.qabnpparibasfortis.be",
    "QA+1"  : "https://p1.easybanking.qabnpparibasfortis.be",
    "QA-1"  : "https://m1.easybanking.qabnpparibasfortis.be"
  };


  // this.Given(/^I send a request to PBIA-pr90 CheckAppEnabled to check the forced upgrade$/, function(callback) {
  //   callback();
  // });

  this.When(/^I try to hit getCountryList Service with request$/, function (callback) {
    var reqOptions = {
      url:ENVIRONMENTS[TARGET_ENV]+getCountry,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        'brand':'FB',
        'language':'fr'
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
    //console.log("response:   "+ stringify(queryResponse));
    validateResponse(queryResponse);
    callback();
  });

  function validateResponse(response){
    chai.isNotNull(response, "response is null");
    chai.isDefined(response, 'response is undefined');

    chai.isNotNull(response.value, "response.value is null");
    chai.isDefined(response.value, "response.value is null");

    chai.isNotNull(response.value.countryLists, "response.value.countryLists is null");
    chai.isDefined(response.value.countryLists, "response.value.countryLists is null");

    chai.isNotNull(response.value.countryLists[0].countryCode, "countryCode is null");
    chai.isDefined(response.value.countryLists[0].countryCode, "countryCode is null");

    chai.isNotNull(response.value.countryLists[0].countryLabel, "countryLabel is null");
    chai.isDefined(response.value.countryLists[0].countryLabel, "countryLabel is null");

    chai.isNotNull(response.businessMessageBulk, 'businessMessageBulk is null in ' + stringify(response.businessMessageBulk));
    chai.isDefined(response.businessMessageBulk, 'businessMessageBulk is undefined in ' + stringify(response.businessMessageBulk));
    chai.isNull(response.businessMessageBulk.pewCode, "response.businessMessageBulk.pewCode is NOT null " + response.businessMessageBulk.pewCode);
  }
};
module.exports = GetContextTest;
