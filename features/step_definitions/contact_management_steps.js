const { Given, When, Then } = require("cucumber");
const assert = require('chai').assert;
const querystring = require('querystring');
const api = require('../../util/api');
const root_url = "https://p1.easybanking.qabnpparibasfortis.be";
const login = require('../../util/login');

const csrf = '2e9312a346129e623ca0c830b874fcd3e25a8a0c1919f2d03414b7a13c5d9e65f447255cb9b2b69d485e13066c14cd0cf9e8bd8777be028ae468ffece305bef5627ce76f8d4c68d6a70880eae33b41e6407ab1c14f48830e50369b607042bfc8c9d0a6c601606b81545f3cb1c32818338924b4c1c9c8a27e87bba7140555fca2';
let responseBody;
let responseStatusCode;

const headers = {
    'CSRF': csrf,
    'Cookie': 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    'Content-Type': 'application/json'
}



Given('I am logged with smid {string} and {string} as cardnumber', function(smid, cardnumber, callback) {
    login(smid, cardnumber, callback);
});


When('I retrieve my contactpoints', function(callback) {
    api.post("https://p1.easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentManagement/getConsentList", {}, headers)
        .then((response) => {
            responseBody = response.body;
            responseStatusCode = response.statusCode;
            console.log(responseBody);
            console.log(responseStatusCode);
            callback();
        })
});



Then('status code is {string}', function(status, callback) {
    // Write code here that turns the phrase above into concrete actions
    assert.equal(responseStatusCode, status);
    callback();
});

//POST https: //p1.easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentData/getContactPointList


//POST https: //easybanking.testaccess.qabnpparibasfortis.be/OCPL-pr01/rpc/consentData/insertContactPoint
//{"type":"04","id":"","value":"azerty@test.com","consents":[{"value":"IN","id":"","usage":""}],"brandsplit":true} type 04 => email pro type 03 => privé

// {
// 	"type":"04",
// 	"value":"azerty@test.com",
// 	"consents": [
// 		{"value":"IN"}
// 	]
// }