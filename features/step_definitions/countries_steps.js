const { Given, When, Then } = require("cucumber");
const assert = require('chai').assert;
const api = require('../../util/api');
const login = require('../../util/login');

//Script Variables
let countryList;
let nationalityResponse;


//Login variables
const csrf = '2e9312a346129e623ca0c830b874fcd3e25a8a0c1919f2d03414b7a13c5d9e65f447255cb9b2b69d485e13066c14cd0cf9e8bd8777be028ae468ffece305bef5627ce76f8d4c68d6a70880eae33b41e6407ab1c14f48830e50369b607042bfc8c9d0a6c601606b81545f3cb1c32818338924b4c1c9c8a27e87bba7140555fca2';
const headers = {
    'CSRF': csrf,
    'Cookie': 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    'Content-Type': 'application/json'
}

//URLS
const EASYBANKING_URL = 'https://p1.easybanking.qabnpparibasfortis.be';
const OCPL_PR01 = EASYBANKING_URL + '/OCPL-pr01';

const COUNTRIES_URL = OCPL_PR01 + '/rpc/countries';



Given('I am logged in', (callback) => {
    login('1353974538', '67030417216403435', callback);
});

When('I request the list of countries', function(callback) {
    api.get(COUNTRIES_URL, headers)
        .then((response) => {
            countryList = response.body.value;
            callback();
        })
});

When('I request the list of countries with a date of 1970', function(callback) {
    api.get(COUNTRIES_URL + '?date=1970-11-18', headers)
        .then((response) => {
            countryList = response.body.value;
            callback();
        })
});

When('I request details for Belgium', function(callback) {
    api.get(COUNTRIES_URL + '/BE', headers)
        .then((response) => {
            console.log(response.body);
            nationalityResponse = response.body.value.nationality;
            callback();
        })
})


Then('I see the list of countries and {string} is included', function(Oldcountry, callback) {
    const filteredcountry = countryList.filter(country => country.name == Oldcountry);

    assert.isNotEmpty(filteredcountry);

    callback();
});

Then('I see nationality is Belgian', function(callback) {
    assert.equal(nationalityResponse, 'BELGE');
    callback();
});

Then('I do not see the incorrect country in the list', function(callback) {
    const filteredcountry = countryList.filter(country => country.code == '00');
    assert.isEmpty(filteredcountry);
    callback();
})