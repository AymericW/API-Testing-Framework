const { When, Then } = require('cucumber');
const api = require('../../util/api');
const file = require('../../util/file');

var assert = require('chai').assert;

const PRODUCTS_URL = '/OCPL-pr90/rpc/v1/products?ageUnder28=';
/*
Change OCPL back to AC52 after it's complete
*/

const callApi = (url) => api.get(url)
.then((response) => {
  global.data = response.body
  global.statusCode = response.statusCode
})

/*############################################### GET products according to age and language ###############################################*/
  
When('I try to get a product according to my age {string} {string} {string}', (under28, language, brand) => callApi(PRODUCTS_URL + under28 + '&lang=' + language + '&brand' + brand));


/*############################################### Validate GET products response ###############################################*/

Then('I should be able to get the correct products {string} {string} {string}', (under28, language, brand) => {
  if(brand == ''){
    assert.deepEqual(file.read('expected/products/under28_' + under28 + '_' + language + '.json'), data);
  }else{
    assert.deepEqual(file.read('expected/products/under28_' + under28 + '_' + language + '_' + brand + '.json'), data);
  };
});

