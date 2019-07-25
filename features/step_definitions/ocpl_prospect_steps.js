const { Given, When, Then } = require('cucumber');

const api = require('../../util/api');
const assert = require('chai').assert;

const PROSPECT_URL = "https://easybanking.testaccess.qabnpparibasfortis.be/OCPL-pr90/rpc/v1/prospects";
const IDENTIFICATION_URL = "https://i-net1938a-test.be.fortis.bank:51088/OCAL-ap55-war/api/scan-id/identifications";

const callApiPost = (url, body, callback) => api.post(url, body)
    .then((response) => {
        if(response.body !== undefined){
            global.data = response.body;
            global.statusCode = response.statusCode;
        }
        callback();
    })
    .catch(function (err) {
        callback(err);
    });

const callApiGet = (url, callback) => api.get(url)
   .then((response) => {
      global.data = response.body;
      global.statusCode = response.statusCode;
      callback();
   })
   .catch(function (err) {
      callback(err);
   });

/*############################################## POST (create) a prospect with generated random data ##############################################*/

Given('I create a prospect with {string} {string} {string} {string} {string}', (firstName, lastName, email, language, brand, callback) => {
    callApiPost(PROSPECT_URL, {
        firstName,
        lastName,
        email,
        language,
        brand
    }, callback);
});

Given('I create a propspect with {string} {string} {string} {string}', function (firstName, lastName, email, product, callback) {
    callApiPost(PROSPECT_URL,{
        firstName,
        lastName,
        email,
        product
    }, callback);
});

/*############################################## GET a prospect with an ID ##############################################*/

When('I retrieve the prospect with the id received from the creation', (callback) => {
    callApiGet(PROSPECT_URL + "/" + global.data.id, callback)
});

When('I save his identity details', (callback) => {
    const requestParams = {
        "identificationprocess":{
           "result":"REVIEW_PENDING",
           "companyid":"fortispoc",
           "filename":"93ab0b24-23a3-48b9-bdee-bc89dfb21c8b.zip",
           "identificationtime":"2019-07-04T14:41:40+02:00",
           "id": global.data.identId,
           "href":"/api/v1/fortispoc/identifications/93ab0b24-23a3-48b9-bdee-bc89dfb21c8b.zip",
           "type":"APP",
           "transactionnumber": global.data.id
        },
        "customdata":{
           "custom3":null,
           "custom4":null,
           "custom1":null,
           "custom2":null,
           "custom5":null
        },
        "contactdata":{
           "mobilephone":null,
           "email":null
        },
        "userdata":{
           "birthday":{
              "status":"NEW",
              "value":"1976-03-21"
           },
           "firstname":{
              "status":"NEW",
              "value":"FREDERIK ALEXANDER N"
           },
           "address":{
     
           },
           "personalnumber":{
              "status":"NEW",
              "value":"76.03.21-197.14"
           },
           "birthplace":{
              "status":"NEW",
              "value":"KORTRIJK"
           },
           "nationality":{
              "status":"NEW",
              "value":"BE"
           },
           "gender":{
              "status":"NEW",
              "value":"MALE"
           },
           "lastname":{
              "status":"NEW",
              "value":"PAPPIJN"
           }
        },
        "identificationdocument":{
           "country":{
              "status":"NEW",
              "value":"BE"
           },
           "number":{
              "status":"NEW",
              "value":"592737410350"
           },
           "issuedby":{
              "status":"NEW",
              "value":"WORTEGEM-PETEGEM"
           },
           "type":{
              "status":"NEW",
              "value":"IDCARD"
           },
           "dateissued":{
              "status":"NEW",
              "value":"2018-01-23"
           },
           "validuntil":{
              "status":"NEW",
              "value":"2028-01-23"
           }
        },
        "attachments":{
           "pdf":"93ab0b24-23a3-48b9-bdee-bc89dfb21c8b.pdf",
           "xml":"93ab0b24-23a3-48b9-bdee-bc89dfb21c8b.xml",
           "idbackside":"93ab0b24-23a3-48b9-bdee-bc89dfb21c8b_idbackside.jpg",
           "idfrontside":"93ab0b24-23a3-48b9-bdee-bc89dfb21c8b_idfrontside.jpg",
           "security1":"93ab0b24-23a3-48b9-bdee-bc89dfb21c8b_security1.jpg",
           "userface":"93ab0b24-23a3-48b9-bdee-bc89dfb21c8b_userface.jpg",
           "livenessleft":"93ab0b24-23a3-48b9-bdee-bc89dfb21c8b_liveness_left.jpg",
           "livenessright":"93ab0b24-23a3-48b9-bdee-bc89dfb21c8b_liveness_right.jpg"
        }
    };

    callApiPost(IDENTIFICATION_URL, requestParams, callback);
});

When('I set the {string} and address {string} {string} {string} {string}', (product, street, number, city, postalCode, callback) => {
   const requestParams = {
      "address": {
         "street": street,
         "number": number,
         "city": city,
         "postalCode": postalCode
      },
      "product": product
   }

   console.log(requestParams);

   callApiPost(PROSPECT_URL + "/" + global.data.id, requestParams, callback);
});

/*############################################## Validate POST prospect response ##############################################*/

Then('I get the correct prospect details in the response {string} {string} {string} {string} {string}', function (firstName, lastName, email, language, brand) {
    assert.equal(global.data.firstName, firstName, "Request and response firstname doesn't match");
    assert.equal(global.data.lastName, lastName, "Request and response lastname doesn't match");
    assert.equal(global.data.email, email, "Request and response email doesn't match");
    assert.isNotNull(global.data.id, "id is null");
    assert.isDefined(global.data.id, "id is not defined");
    assert.isNotNull(global.data.identId, "identId is null");
    assert.isDefined(global.data.identId, "identId is not defined");
});

Then('I get the prospect status as identity {string}', function (status) {
   console.log(global.data);
   assert.equal(global.data.status, status, "eID Update failed");
   assert.isDefined(global.data.idCard, "eidCard is not defined");
   assert.isDefined(global.data.idCard.number, "eidCardNumber is not defined");
});