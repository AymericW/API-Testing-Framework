const { When, Then } = require('cucumber');

const api = require('../../util/api');
const file = require('../../util/file');

var assert = require('chai').assert;

const PRODUCTS_URL = "/AC52-pr90/rpc/v1/products?ageUnder28=";

let data;
let statusCode;

const callApi = (url) => api.get(url)
.then((response) => {
  data = response.body
  statusCode = response.statusCode
})    


/*############################################### GET products according to age and language ###############################################*/
  
When('I try to get a product according to my age {string} {string}', (under28, language) => callApi(PRODUCTS_URL + under28 + '&lang=' + language));

/*############################################### Validate GET products response ###############################################*/

Then('I should be able to get the correct products {string} {string}', (under28, language) => {
    assert.deepEqual(file.read('expected/products/under28_' + under28 + '_' + language + '.json'), data);
});

/*######################################################### FUNCTIONS #########################################################*/
