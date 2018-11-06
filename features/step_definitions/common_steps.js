const { When, Then } = require('cucumber');

const api = require('../../util/api');
const file = require('../../util/file');

var assert = require('chai').assert;

// http status code validation
Then('the http status code is {string}', (code) => {
  assert.equal(global.statusCode, code);
  console.log(global.statusCode)
  console.log(code)
});