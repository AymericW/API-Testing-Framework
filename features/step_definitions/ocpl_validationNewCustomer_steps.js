var request = require('request-promise');
var stringify = require('json-stringify-safe');
var chai = require('chai').assert;

var ValidateNewCustomerTest = function () {
  var queryResponse;
  var TARGET_ENV = process.env.TARGET_ENV || "TEST";
  var validateNewCustomerUrl = "/OCPL-pr90/rpc/CJBRC/validateNewCustomer";
  var getContextUrl = "/OCPL-pr90/rpc/CJBRC/getContext";
  const ENVIRONMENTS = {
    "TEST2"   : "https://app.easybanking.test2access.qabnpparibasfortis.be",
    "TEST"  : "https://easybanking.testaccess.qabnpparibasfortis.be",
    "QA"    : "https://easybanking.qabnpparibasfortis.be",
    "QA+1"  : "https://p1.easybanking.qabnpparibasfortis.be",
    "QA-1"  : "https://m1.easybanking.qabnpparibasfortis.be"
  };

  var validateNewCustomerReqOptions = {
    url:ENVIRONMENTS[TARGET_ENV]+validateNewCustomerUrl,
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      "gsn": null,
      "address" :{
        "city": "saint josse ten noode",
        "postalCode": "1210",
        "streetName" : "rue du progres",
        "houseNumber" : "55",
        "countryCode": "BE"

      },
      "firstName": "Nicolas",
      "lastName" : "Cueto",
      "nationality": "Belge",
      "birthPlace": "uccle",
      "birthDate" :"1990-11-18",
      "gender": "M",
      "civilStatus": "2",
      "idCardNumber" : "590123457380",
      "idCardExpirationDate": "2027-03-02",
      "nationalRegistryNumber": "90111865197"
    },
    json: true,
    resolveWithFullResponse: true,
    simple: false
  };

  var getContextReqOptions = {
    url:ENVIRONMENTS[TARGET_ENV]+getContextUrl,
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      "firstName":"foo",
      "lastName":"bar",
      "brand":"FB",
      "language":"FR",
      "email":"abc@abc.com"
    },
    json: true,
    resolveWithFullResponse: true,
    simple: false
  };


  // this.Given(/^I send a request to PBIA-pr90 CheckAppEnabled to check the forced upgrade$/, function(callback) {
  //   callback();
  // });

  this.When(/^I try to hit validationNewCustomer Service with request$/, function (callback) {
    //var getContextRequest = getContextReqOptions;
    if (process.env.HTTP_PROXY){
      getContextReqOptions.proxy = process.env.HTTP_PROXY;
      validateNewCustomerReqOptions.proxy = process.env.HTTP_PROXY;
    }
    request(getContextReqOptions)
    .then(function (response) {
      //console.log("====== " + response.body.value.gsn)
      validateNewCustomerReqOptions.body.gsn = response.body.value.gsn;
      //console.log("request **********");
      //console.log(validateNewCustomerReqOptions);
      //console.log("******************");
      request(validateNewCustomerReqOptions)
    .then(function (response) {
      queryResponse = response.body;
      callback();
    })
    })



    .catch(function (err) {
      throw "*** ERROR DUDE: "+err.toString();
    });
  




  });

  this.Then(/^I should be able to validate the new customer$/, function (callback) {
    //console.log("response:   "+ stringify(queryResponse));
    validateResponse(queryResponse);
    callback();
  });

  function validateResponse(response){
    chai.isNotNull(response, "response is null");
    chai.isDefined(response, 'response is undefined');

    chai.isNotNull(response.value, "response.value is null");
    chai.isDefined(response.value, "response.value is null");
    chai.equal(response.value+'', 'true'+'', 'response.value is NOT true');

    chai.isNotNull(response.businessMessageBulk, 'businessMessageBulk is null in ' + stringify(response.businessMessageBulk));
    chai.isDefined(response.businessMessageBulk, 'businessMessageBulk is undefined in ' + stringify(response.businessMessageBulk));
    chai.isNull(response.businessMessageBulk.pewCode, "response.businessMessageBulk.pewCode is NOT null " + response.businessMessageBulk.pewCode);
  }








};
module.exports = ValidateNewCustomerTest;
