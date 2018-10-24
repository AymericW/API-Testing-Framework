const { When, Then } = require('cucumber');

const api = require('../../util/api');
const file = require('../../util/file');

var assert = require('chai').assert;

const COUNTRIES_URL = '/OCPL-pr90/rpc/v1/countries';

let data;
let statusCode;

const callApi = (url) => api.get(url)
.then((response) => {
  data = response.body
  statusCode = response.statusCode
})

// http status code validation
Then('the http status code is {string}', (code) => {
    assert.equal(statusCode, code);
});