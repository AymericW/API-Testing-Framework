const { When, Then, Given } = require('cucumber');

const api = require('../../util/api');
const file = require('../../util/file');
const login = require('../../util/login');

var assert = require('chai').assert;
const csrf = '2e9312a346129e623ca0c830b874fcd3e25a8a0c1919f2d03414b7a13c5d9e65f447255cb9b2b69d485e13066c14cd0cf9e8bd8777be028ae468ffece305bef5627ce76f8d4c68d6a70880eae33b41e6407ab1c14f48830e50369b607042bfc8c9d0a6c601606b81545f3cb1c32818338924b4c1c9c8a27e87bba7140555fca2';

const headers = {
    'CSRF': csrf,
    'Cookie': 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    'Content-Type': 'application/json'
}

// http status code validation
Then('the response status is {string}', (code) => {
    assert.equal(global.statusCode, code);
});


Given("I am logged with smid and are on the Privacy portal page", (callback) => {
    login('1453637078', '67030417181622761', callback);
});

Given("that i am a logged in user", (callback) => {
    login('1353974538', '67030417216403435', callback);
});