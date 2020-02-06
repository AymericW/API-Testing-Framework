// const { When, Then } = require('cucumber');
// const api = require('../../util/api');
// const file = require('../../util/file');
// const validator = require('../../util/schemaValidator');
// const JsonFind = require('json-find');

// var assert = require('chai').assert;

// const PRODUCTS_URL = 'https://p1.easybanking.qabnpparibasfortis.be/OCPL-pr90/rpc/v1/products';
// /*
// Change OCPL back to AC52 after it's complete
// */

// const callApi = (url, callback) => {
//     api.get(url)
//         .then((response) => {
//             global.data = response.body
//             global.statusCode = response.statusCode
//             callback();
//         })
//         .catch(function(err) {
//             callback(err);
//         });
// }

// // /*############################################### GET products according to age, language and brand ###############################################*/

// When('I try to get a product according to my age {string} {string} {string}', (under28, language, brand, callback) => {
//     callApi(PRODUCTS_URL + '?ageUnder28=' + under28 + '&lang=' + language + '&brand=' + brand, callback)
// });

// // /*############################################### Validate GET products response ###############################################*/

// Then('I should be able to get the correct products {string} {string} {string}', (under28, language, brand) => {
//     assert.deepEqual(file.read('expected/products/under28_' + under28 + '_' + language + '_' + brand + '.json'), data);
//     const schema = JsonFind(file.read('configuration/products.json'));
//     const schemaResponse = schema.extractPaths(false, ['paths', '/products', 'get', 'responses', '200', 'content', 'application/json', 'schema']).schema;
//     assert.isTrue(validator.validate(schemaResponse, global.data), 'Schema Validation Unsuccessful');
// });