const { Given, When, Then } = require('cucumber');

const api = require('../../util/api');
const file = require('../../util/file');
const JsonFind = require('json-find');
const assert = require('chai').assert;


const PROSPECT_URL = "https://easybanking.testaccess.qabnpparibasfortis.be/OCPL-pr90/rpc/v1/prospects";
//const IDENTIFICATION_URL = "https://i-net1938a-test.be.fortis.bank:51088/OCAL-ap55-war/api/scan-id/identifications";



// /*############################################## POST (create) a prospect with generated random data ##############################################*/

Given('I create a prospect with {string} {string} {string} {string} {string}', (firstName, lastName, email, brand, language, callback) => {
    //

});

/*Given('I create a prospect with empty fields {string} {string} {string} {string} {string}', (firstName, lastName, email, brand, language, callback) => {

   let body = {};

   if(firstName != '') body.firstName = firstName;
   if(lastName != '') body.lastName = lastName;
   if(email != '') body.email = email;
   if(language != '') body.language = language;
   if(brand != '') body.brand = brand;


   callApiPost(PROSPECT_URL, body, callback);
});*/

// *############################################## WHEN - GET a prospect with an ID ##############################################*/

When('I retrieve the prospect with the id received from the creation', (callback) => {
    //
});

/*When('I save his identity details with result {string}', (result, callback) => {
    const requestParams = {
        "identificationprocess": {
            "result": result,
            "companyid": "fortispoc",
            "filename": "93ab0b24-23a3-48b9-bdee-bc89dfb21c8b.zip",
            "identificationtime": "2019-07-04T14:41:40+02:00",
            "id": global.data.identId,
            "href": "/api/v1/fortispoc/identifications/93ab0b24-23a3-48b9-bdee-bc89dfb21c8b.zip",
            "type": "APP",
            "transactionnumber": global.data.id
        },
        "customdata": {
            "custom3": null,
            "custom4": null,
            "custom1": null,
            "custom2": null,
            "custom5": null
        },
        "contactdata": {
            "mobilephone": null,
            "email": null
        },
        "userdata": {
            "birthday": {
                "status": "NEW",
                "value": "1976-03-21"
            },
            "firstname": {
                "status": "NEW",
                "value": "FREDERIK ALEXANDER N"
            },
            "address": {

            },
            "personalnumber": {
                "status": "NEW",
                "value": "76.03.21-197.14"
            },
            "birthplace": {
                "status": "NEW",
                "value": "KORTRIJK"
            },
            "nationality": {
                "status": "NEW",
                "value": "BE"
            },
            "gender": {
                "status": "NEW",
                "value": "MALE"
            },
            "lastname": {
                "status": "NEW",
                "value": "PAPPIJN"
            }
        },
        "identificationdocument": {
            "country": {
                "status": "NEW",
                "value": "BE"
            },
            "number": {
                "status": "NEW",
                "value": "592737410350"
            },
            "issuedby": {
                "status": "NEW",
                "value": "WORTEGEM-PETEGEM"
            },
            "type": {
                "status": "NEW",
                "value": "IDCARD"
            },
            "dateissued": {
                "status": "NEW",
                "value": "2018-01-23"
            },
            "validuntil": {
                "status": "NEW",
                "value": "2028-01-23"
            }
        },
        "attachments": {
            "pdf": "93ab0b24-23a3-48b9-bdee-bc89dfb21c8b.pdf",
            "xml": "93ab0b24-23a3-48b9-bdee-bc89dfb21c8b.xml",
            "idbackside": "93ab0b24-23a3-48b9-bdee-bc89dfb21c8b_idbackside.jpg",
            "idfrontside": "93ab0b24-23a3-48b9-bdee-bc89dfb21c8b_idfrontside.jpg",
            "security1": "93ab0b24-23a3-48b9-bdee-bc89dfb21c8b_security1.jpg",
            "userface": "93ab0b24-23a3-48b9-bdee-bc89dfb21c8b_userface.jpg",
            "livenessleft": "93ab0b24-23a3-48b9-bdee-bc89dfb21c8b_liveness_left.jpg",
            "livenessright": "93ab0b24-23a3-48b9-bdee-bc89dfb21c8b_liveness_right.jpg"
        }
    };
    callApiPost(IDENTIFICATION_URL, requestParams, callback);
});*/

/*When('I set the {string} and address {string} {string} {string} {string}', (product, street, number, city, postalCode, callback) => {
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
});*/

/*When('I add a product {string} to the prospect', function (product, callback) {
   const requestParams = {
      "product": product                             
   }


   callApiPost(PROSPECT_URL + "/" + global.data.id, requestParams, callback);
 });*/

// *############################################## Validate POST prospect response ##############################################*/

Then('I get the correct prospect details in the response {string} {string} {string} {string} {string}', function(firstName, lastName, email, brand, language) {
    callback();
});

/*Then('I get the prospect status as identity {string}', function(status) {
    assert.equal(global.data.status, status, "eID Update failed");
    assert.isDefined(global.data.idCard, "eidCard is not defined");
    assert.isDefined(global.data.idCard.number, "eidCardNumber is not defined");
});*/


// // //  ---------------------------------    Missing field validation   -------------------------------------------

// //  Then('I have {int} error code {string}', (int, codes) => {
// //    const response = global.data;
// //    const listCode = codes.split(', ');
// //    const validateCode = (response, errorCode) => response.filter(error => (error.code)==errorCode).length == 1;

// //    for (let code of listCode){
// //       assert.isTrue(validateCode(response, code));
// //    }
// //  });

// //  Then('I have {int} error message {string}', (int, messages) => {
// //    const response = global.data;
// //    const listMessage = messages.split(', ');
// //    const validateMessage = (response, errorMessage) => response.filter(error => (error.message)==errorMessage).length == 1;

// //    for(let message of listMessage){
// //       assert.isTrue(validateMessage(response, message));
// //    }
// //  });

// //  Then('I see the product {string} in the prospect', function (product) {
// //    assert.equal(global.data.product, product)
// //  });