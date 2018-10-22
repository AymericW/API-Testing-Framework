const { When, Then } = require('cucumber');

const api = require('../../util/api');
const file = require('../../util/file');

var assert = require('chai').assert;

const PROSPECT_URL = "/OCPL-pr90/rpc/v1/prospects";

let postData;
let getData;
let statusCode;

const callApiPost = (url, body) => api.post(url, body)
.then((response) => {
  postData = response.body
  statusCode = response.statusCode
})

const callApiGet = (url) => api.get(url)
.then((response) => {
  getData = response.body
  statusCode = response.statusCode
})

/*############################################## POST (create) a prospect with generated random data ##############################################*/

When('I try to create a prospect with generated random data', function () {
    return callApiPost(PROSPECT_URL, {
        firstName: randomFirstName,
        lastName: randomLastName,
        email: randomEmail
    });
});

/*############################################## GET a prospect with an ID ##############################################*/

When('I try to retrieve data from previously created prospect', () => callApiGet(PROSPECT_URL + "/" + postData.id));

/*############################################## Validate POST prospect response ##############################################*/

Then('I should be able to get the correct prospect', function () {
    // console.log("the firstname is " + randomFirstName);
    // console.log("the lastname is " + randomLastName);
    // console.log("the email is " + randomEmail);

    assert.equal(postData.firstName, randomFirstName, "Request and response firstname doesn't match");
    assert.equal(postData.lastName, randomLastName, "Request and response lastname doesn't match");
    assert.equal(postData.email, randomEmail, "Request and response email doesn't match");
    assert.isNotNull(postData.id, "id is null");
    assert.isDefined(postData.id, "id is not defined");
    assert.isNotNull(postData.identId, "identId is null");
    assert.isDefined(postData.identId, "identId is not defined");

    // console.log(data.firstName);
    // console.log(randomFirstName);
});

/*############################################# Compare GET and POST response #########################################################*/

Then('I should have both data matching', function () {
    console.log("post response is " + JSON.stringify(postData));
    console.log("get response is " + JSON.stringify(getData));
    assert.deepEqual(postData, getData);
});

/*######################################################### FUNCTIONS #########################################################*/

// Random name/email generator
function generateName(){
    var nameLength = Math.random() * (2 - 15) + 15;
    var firstLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var bodyLetter = "abcdefghijklmnopqrstuvwxyz";

    var generateRandom = firstLetter.charAt(Math.floor(Math.random() * firstLetter.length));
    
    for (var i = 1; i < nameLength; i++){
        generateRandom += bodyLetter.charAt(Math.floor(Math.random() * bodyLetter.length));
    }

    return generateRandom;
}

var randomFirstName = generateName();
var randomLastName = generateName();
var randomEmail = randomFirstName.toLowerCase() + "." + randomLastName.toLowerCase() + "@hotmail.com";
