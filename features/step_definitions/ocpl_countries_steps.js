const { When, Then } = require('cucumber');

const api = require('../../util/api');
const file = require('../../util/file');

var assert = require('chai').assert;

const COUNTRIES_URL = '/OCPL-pr90/rpc/v1/countries';

let data;
let statusCode;

const callApi = (url) => api.get(url)
.then((response) => {
  global.data = response.body
  global.statusCode = response.statusCode
})

// Retrieves one country
When('I retrieve the country {string} in {string}', (code, language) => callApi(COUNTRIES_URL + '/' + code + '?lang=' + language));
When('I retrieve the country {string}', (code) => callApi(COUNTRIES_URL + '/' + code));

// Retrieves all countries
When('I retrieve the countries', () => callApi(COUNTRIES_URL));
When('I retrieve the countries in {string}', (language) => callApi(COUNTRIES_URL + '?lang=' + language));

Then('I have the same countries as my reference in {string}', (language) => {
  assert.deepEqual(file.read('expected/countries/get_countries_' + language + '.json'), global.data);
});

Then('the country code is {string} and label is {string}', (expectedCode, expectedLabel) => {
  assert.equal(global.data.code, expectedCode);
  assert.equal(global.data.label, expectedLabel);
});



