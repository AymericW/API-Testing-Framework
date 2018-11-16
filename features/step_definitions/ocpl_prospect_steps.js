const { When, Then } = require('cucumber');

const api = require('../../util/api');
const file = require('../../util/file');

var assert = require('chai').assert;

const PROSPECT_URL = "https://easybanking.testaccess.qabnpparibasfortis.be/OCPL-pr90/rpc/v1/prospects";

let postData;
let getData;
let statusCode;

const callApiPost = (url, body) => api.post(url, body)
.then((response) => {
    global.postData = response.body
    global.statusCode = response.statusCode
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
        email: randomEmail,
        language: randomLanguage,
        brand: randomBrand
    });
});

/*############################################## GET a prospect with an ID ##############################################*/

When('I try to retrieve data from previously created prospect', () => callApiGet(PROSPECT_URL + "/" + global.postData.id));

/*############################################## Validate POST prospect response ##############################################*/

Then('I should be able to get the correct prospect', function () {
    // console.log("the firstname is " + randomFirstName);
    // console.log("the lastname is " + randomLastName);
    // console.log("the email is " + randomEmail);

    assert.equal(global.postData.firstName, randomFirstName, "Request and response firstname doesn't match");
    assert.equal(global.postData.lastName, randomLastName, "Request and response lastname doesn't match");
    assert.equal(global.postData.email, randomEmail, "Request and response email doesn't match");
    assert.isNotNull(global.postData.id, "id is null");
    assert.isDefined(global.postData.id, "id is not defined");
    assert.isNotNull(global.postData.identId, "identId is null");
    assert.isDefined(global.postData.identId, "identId is not defined");

    // console.log(data.firstName);
    // console.log(randomFirstName);
});

/*############################################# Compare GET and POST response #########################################################*/

Then('I should have both data matching', function () {
    // console.log("post response is " + JSON.stringify(postData));
    // console.log("get response is " + JSON.stringify(getData));
    assert.deepEqual(global.postData, getData);
});

/*############################################# 404 error code validation #########################################################*/

When('I try retrieve prospect data with id that doesn\'t exist', () => callApiGet(PROSPECT_URL + "/32"));

/*############################################# Textfield input Validation #########################################################*/

When('I try to create a prospect with {string}, {string}, {string}, in {string} and in {string}', function (string, string2, string3, string4, string5) {
    return callApiPost(PROSPECT_URL, {
        firstName: string,
        lastName: string2,
        email: string3,
        brand: string4,
        language: string5
    });
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
    };
    return generateRandom;
};

var randomFirstName = generateName();
var randomLastName = generateName();
var randomEmail = randomFirstName.toLowerCase() + "." + randomLastName.toLowerCase() + "@hotmail.com";


// Random language generator

function generateLanguage(){
    var language = ["NL", "FR", "EN", "DE"][Math.floor(Math.random() * 4)];
    return language;
};

var randomLanguage = generateLanguage();

// Random brand generator

function generateBrand(){
    var brand = ["FB", "HB"][Math.floor(Math.random() * 2)];
    return brand;
};
    
var randomBrand = generateBrand();
