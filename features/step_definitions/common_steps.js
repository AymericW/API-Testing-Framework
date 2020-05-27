const { When, Then, Given } = require('cucumber');

const api = require('../../util/api');
const file = require('../../util/file');
const login = require('../../util/login');

var assert = require('chai').assert;

// http status code validation
Then('the response status is {string}', (code) => {
    assert.equal(global.statusCode, code);
});

Given('I am logged with smid', (callback) => {
    login('1151379451', '6703 0417 1998 4572 7', callback);
})