var request = require('request-promise');
var stringify = require('json-stringify-safe');
var chai = require('chai').assert;

var ValidateNewCustomerTest = function () {
  var queryResponse;
  var TARGET_ENV = process.env.TARGET_ENV || "TEST";
  var getContextUrl = "/OCPL-pr90/rpc/CJBRC/getContext";
   var getCountryUrl = "/OCPL-pr90/rpc/CJBRC/getCountryList";
  var validateNewCustomerUrl = "/OCPL-pr90/rpc/CJBRC/validateNewCustomer";
  var createCustomerAccountUrl = "/OCPL-pr90/rpc/CJBRC/createCustomerAccount";
  var getStatusUrl = "/OCPL-pr90/rpc/CJBRC/getStatus";

  const ENVIRONMENTS = {
    "TEST2"   : "https://app.easybanking.test2access.qabnpparibasfortis.be",
    "TEST"  : "https://easybanking.testaccess.qabnpparibasfortis.be",
    "QA"    : "https://easybanking.qabnpparibasfortis.be",
    "QA+1"  : "https://p1.easybanking.qabnpparibasfortis.be",
    "QA-1"  : "https://m1.easybanking.qabnpparibasfortis.be"
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

  var getCountryListReqOptions = {
    url:ENVIRONMENTS[TARGET_ENV]+getContextUrl,
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
      "birthDate" :"18NOV1990",
      "gender": "M",
      "idCardNumber" : "590123457380",
      "idCardExpirationDate": "02.03.2027",
      "nationalRegistryNumber": "90111865197"
    },
    json: true,
    resolveWithFullResponse: true,
    simple: false
  };

  var createCustomerAccountReqOptions = {
    url:ENVIRONMENTS[TARGET_ENV]+createCustomerAccountUrl,
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      "gsn": null,
    },
    json: true,
    resolveWithFullResponse: true,
    simple: false
  };


  var getStatusUrlReqOptions = {
    url:ENVIRONMENTS[TARGET_ENV]+getStatusUrl,
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      "gsn": null,
    },
    json: true,
    resolveWithFullResponse: true,
    simple: false
  };


  // this.Given(/^I send a request to PBIA-pr90 CheckAppEnabled to check the forced upgrade$/, function(callback) {
  //   callback();
  // });

  this.When(/^I try to hit getStatus Service with request$/, function (callback) {
    if (process.env.HTTP_PROXY){
      getContextReqOptions.proxy = process.env.HTTP_PROXY;
      validateNewCustomerReqOptions.proxy = process.env.HTTP_PROXY;
      createCustomerAccountReqOptions.proxy = process.env.HTTP_PROXY;
      getStatusUrlReqOptions.proxy = process.env.HTTP_PROXY;
    }
    request(getContextReqOptions)
    .then(function (getContextResponse) {
      validateNewCustomerReqOptions.body.gsn = getContextResponse.body.value.gsn;
      createCustomerAccountReqOptions.body.gsn = getContextResponse.body.value.gsn;
      getStatusUrlReqOptions.body.gsn = getContextResponse.body.value.gsn;
      console.log("getContextResponse****** " + stringify(getContextResponse));
      request(validateNewCustomerReqOptions)
      .then(function (validateNewCustomerResponse) {
        console.log("validateNewCustomerResponse------- " + stringify(validateNewCustomerResponse));
        //callback();
        request(createCustomerAccountReqOptions)
        .then(function (createCustomerAccountResponse) {
          console.log("createCustomerAccountResponse------- " + stringify(createCustomerAccountResponse));
          //callback();
          request(getStatusUrlReqOptions)
          .then(function (getStatusResponse) {
            console.log("getStatusResponse------- " + stringify(getStatusResponse));
            queryResponse = getStatusResponse.body;
            callback();
          })
        })
      })
    })

    .catch(function (err) {
      throw "*** ERROR DUDE: "+err.toString();
    });
  });

  this.Then(/^I should be able to get the status$/, function (callback) {
    console.log("response:   "+ stringify(queryResponse));
    validateResponse(queryResponse);
    callback();
  });

  function validateResponse(response){
    chai.isNotNull(response, "response is null");
    chai.isDefined(response, 'response is undefined');

    chai.isNotNull(response.value, "response.value is null");
    chai.isDefined(response.value, "response.value is null");

    chai.isNotNull(response.value.ctiaFlag, "response.value.ctiaFlag is null");
    chai.isDefined(response.value.ctiaFlag, "response.value.ctiaFlag is undefined");

    // chai.isNotNull(response.value.accountNumber, "response.value.accountNumber is null");
    // chai.isDefined(response.value.accountNumber, "response.value.accountNumber is null");

    // chai.isNotNull(response.value.context, "response.value.context is null");
    // chai.isDefined(response.value.context, "response.value.context is null");

    chai.isNotNull(response.businessMessageBulk, 'businessMessageBulk is null in ' + stringify(response.businessMessageBulk));
    chai.isDefined(response.businessMessageBulk, 'businessMessageBulk is undefined in ' + stringify(response.businessMessageBulk));
    chai.isNull(response.businessMessageBulk.pewCode, "response.businessMessageBulk.pewCode is NOT null " + response.businessMessageBulk.pewCode);
  }

};
module.exports = ValidateNewCustomerTest;
