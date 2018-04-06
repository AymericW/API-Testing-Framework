var request = require('request-promise');
var stringify = require('json-stringify-safe');
var chai = require('chai').assert;

var GetContextTest = function () {
  var queryResponse;
  var TARGET_ENV = process.env.TARGET_ENV || "QA+1";
  var retrieveCustomerProductListUrl = "/AC52-pr90/rpc/CJBRC/retrieveCustomerProductList";
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

  this.When(/^I try to hit retrieveCustomerProductList Service with request$/, function (callback) {
    var reqOptions = {
      url:ENVIRONMENTS[TARGET_ENV]+retrieveCustomerProductListUrl,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        'ageUnder28':'N',
        'brand':'FB',
        'language':'fr',
        'personalDetailsDTO':{
          'dateOfBirth': '01010111'
        }
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

  this.Then(/^I should be able to get the correct customer product list$/, function (callback) {
    console.log("response:   "+ stringify(queryResponse));
    validateResponse(queryResponse);
    callback();
  });

  function validateResponse(response){
    chai.isNotNull(response, "response is null");
    chai.isDefined(response, 'response is undefined');

    chai.isNotNull(response.value, "response.value is null");
    chai.isDefined(response.value, "response.value is null");

    chai.isNotNull(response.value.productList, "response.value.productList is null");
    chai.isDefined(response.value.productList, "response.value.productList is null");

    chai.isNotNull(response.value.productList.product, "response.value.product is null");
    chai.isDefined(response.value.productList.product, "response.value.product is null");

    chai.isNotNull(response.businessMessageBulk, 'businessMessageBulk is null in ' + stringify(response.businessMessageBulk));
    chai.isDefined(response.businessMessageBulk, 'businessMessageBulk is undefined in ' + stringify(response.businessMessageBulk));
    chai.isNull(response.businessMessageBulk.pewCode, "response.businessMessageBulk.pewCode is NOT null " + response.businessMessageBulk.pewCode);
  }
};
module.exports = GetContextTest;
