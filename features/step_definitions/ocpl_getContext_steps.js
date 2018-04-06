var request = require('request-promise');
var stringify = require('json-stringify-safe');
var chai = require('chai').assert;

var GetContextTest = function () {
  var queryResponse;
  var TARGET_ENV = process.env.TARGET_ENV || "QA+1";
  var getContext = "/OCPL-pr90/rpc/CJBRC/getContext";
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

  this.When(/^I try to hit getContext Service with request$/, function (callback) {
    var reqOptions = {
      url:ENVIRONMENTS[TARGET_ENV]+getContext,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        'firstName':'foo',
        'lastName':'bar',
        'brand':'FB',
        'language':'FR',
        'email':'abc@abc.com'
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

  this.Then(/^I should be able to get the correct context$/, function (callback) {
    console.log("response:   "+ stringify(queryResponse));
    validateResponse(queryResponse);
    callback();
  });

  function validateResponse(response){
    chai.isNotNull(response, "response is null");
    chai.isDefined(response, 'response is undefined');

    chai.isNotNull(response.value, "response.value is null");
    chai.isDefined(response.value, "response.value is null");

    chai.isNotNull(response.value.gsn, "response.value.gsn is null");
    chai.isDefined(response.value.gsn, "response.value.gsn is null");

    chai.isNotNull(response.businessMessageBulk, 'businessMessageBulk is null in ' + stringify(response.businessMessageBulk));
    chai.isDefined(response.businessMessageBulk, 'businessMessageBulk is undefined in ' + stringify(response.businessMessageBulk));
    chai.isNull(response.businessMessageBulk.pewCode, "response.businessMessageBulk.pewCode is NOT null " + response.businessMessageBulk.pewCode);
  }
};
module.exports = GetContextTest;
