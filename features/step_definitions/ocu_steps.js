const { Given, When, Then } = require("cucumber");
const assert = require('chai').assert;
const api = require('../../util/api');
const login = require('../../util/login');
let bodyResponse;
let surnameResponse;
const csrf = '2e9312a346129e623ca0c830b874fcd3e25a8a0c1919f2d03414b7a13c5d9e65f447255cb9b2b69d485e13066c14cd0cf9e8bd8777be028ae468ffece305bef5627ce76f8d4c68d6a70880eae33b41e6407ab1c14f48830e50369b607042bfc8c9d0a6c601606b81545f3cb1c32818338924b4c1c9c8a27e87bba7140555fca2';

const headers = {
    'CSRF': csrf,
    'Cookie': 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    'Content-Type': 'application/json'
}

//URLS
const EASYBANKING_URL = 'https://p1.easybanking.qabnpparibasfortis.be'
const OCPL_PR01 = EASYBANKING_URL + '/OCPL-pr01'

Given('I am logged with smid', (callback) => {
    login('1180546302', '67030417188221005', callback);
});


Given('I am on the personal data page', function(callback) {
    api.post(OCPL_PR01 + '/rpc/consentData/getContactPointList', {}, headers)
        .then((response) => {
            console.log(response.body);
            callback();
        })
});



When('I click on modify details', function(callback) {
    api.get(OCPL_PR01 + '/rpc/ocuVerify/checkUpdateRestrictions', headers)
        .then((response) => {
            bodyResponse = response.body;
            console.log(response.body);
            callback();
        })
});


When('I try to modify the details of non_related_smid', function(callback) {
    api.get(OCPL_PR01 + '/rpc/ocuVerify/checkUpdateRestrictions/1858973291', headers)
        .then((response) => {
            bodyResponse = response.body;
            console.log(response.body);
            callback();
        })
});



When('I try to modify the details of related_smid', function(callback) {
    api.get(OCPL_PR01 + '/rpc/ocuVerify/checkUpdateRestrictions/"TODO"', headers)
        .then((response) => {
            bodyResponse = response.body;
            console.log(response.body);
            callback();
        })
});


When('I start the e-contract flow', function(callback) {
    api.post(OCPL_PR01 + '/rpc/updateRequest/createOcuRequest', { "updateType": "EID" }, headers)
        .then((response) => {
            console.log(response.body);
            callback();
        })
});

When('I create an Ocu Request for a non_related_smid', function(callback) {
    api.post(OCPL_PR01 + '/rpc/updateRequest/createOcuRequest/1858973291', { "updateType": "EID" }, headers)
        .then((response) => {
            console.log(response.body);
            callback();
        })
});

When('I create an Ocu Request for a related_smid', function(callback) {
    api.post(OCPL_PR01 + '/rpc/updateRequest/createOcuRequest/"TODO"', { "updateType": "EID" }, headers)
        .then((response) => {
            console.log(response.body);
            callback();
        })
});

When('I request the e-contract URL', function(callback) {
    api.get(OCPL_PR01 + '/rpc/e-contract', headers)
        .then((response) => {
            console.log(response.body);
            callback();
        })
})

When('I retrieve my personal data', function(callback) {
    api.get(OCPL_PR01 + '/rpc/customers/getPersonalData', headers)
        .then((response) => {
            console.log(response.body);
            surnameResponse = response.body;
            callback();
        })
})


Then('I should receive the correct URL', function(callback) {
    //TODO
    callback();
})

Then('I should see the eID update button', function(callback) {
    //TODO
    callback();
});

Then('I should see an error', function(callback) {
    //TODO
    callback();
});

Then("The surname is smid {string}", function(surname, callback) {
    //TODO
    assert.equal(surnameResponse, surname);
    callback();
})