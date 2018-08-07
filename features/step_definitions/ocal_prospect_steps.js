var request = require('request-promise');


var prospectTest = function () {
    var queryResponse;
    // var TARGET_ENV = process.env.TARGET_ENV || "TEST";
    var getProspect = "/OCAL-ap90-war/rpc/prospects";
    // const ENVIRONMENTS = {
    //   "TEST2"   : "https://app.easybanking.test2access.qabnpparibasfortis.be",
    //   "TEST"  : "https://easybanking.testaccess.qabnpparibasfortis.be",
    //   "QA"    : "https://easybanking.qabnpparibasfortis.be",
    //   "QA+1"  : "https://p1.easybanking.qabnpparibasfortis.be",
    //   "QA-1"  : "https://m1.easybanking.qabnpparibasfortis.be"
    // };

    this.When(/^I try create a prospect with some data$/, function (callback) {
        var reqOptions = {
            url: "http://sdwl0314:9092"+getProspect,
            method: 'POST',
            headers: {
            "Content-Type": "application/json",
            },
            body: {
            'firstName': randomFirstName,
            'lastName': randomLastName,
            'email': randomEmail
            },
            json: true,
            resolveWithFullResponse: true,
            simple: false
        };
        if (process.env.HTTP_PROXY){
            reqOptions.proxy = process.env.HTTP_PROXY;
        }
        request(reqOptions)
        .then(function (response) {
            queryResponse = response.body;
            console.log(queryResponse);
            callback();
        })
        .catch(function (err) {
            throw "*** ERROR DUDE: "+err.toString();
        });
    });
    
    this.Then(/^I should be able to get the correct prospect$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    // function generateName(){
    //     var nameLength = Math.random() * (2 - 15) + 15;
    //     var firstLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //     var bodyLetter = "abcdefghijklmnopqrstuvwxyz";

    //     var generateRandom = firstLetter.charAt(Math.floor(Math.random() * firstLetter.length));
        
    //     for (var i = 1; i < nameLength; i++){
    //         generateRandom += bodyLetter.charAt(Math.floor(Math.random() * bodyLetter.length));
    //     }

    //     return generateRandom;
    // }

    // var firstName = generateName();
    // var lastName = generateName();
    // var Email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@hotmail.com";

    var generateRandomName = function getRandomName(){
        var nameLength = Math.random() * (2 - 15) + 15;
        var firstLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var bodyLetter = "abcdefghijklmnopqrstuvwxyz";

        
        var generateRandomF = firstLetter.charAt(Math.floor(Math.random() * firstLetter.length));
        
        for (var i = 1; i < nameLength; i++){
            generateRandomF += bodyLetter.charAt(Math.floor(Math.random() * bodyLetter.length));
        }

        var generateRandomL = firstLetter.charAt(Math.floor(Math.random() * firstLetter.length));
        
        for (var i = 1; i < nameLength; i++){
            generateRandomL += bodyLetter.charAt(Math.floor(Math.random() * bodyLetter.length));
        }

        var generatedEmail = generateRandomF.toLowerCase() + "." + generateRandomL.toLowerCase() + "@hotmail.com";

        return {
            firstName: generateRandomF,
            lastName: generateRandomL,
            generatedEmail: generatedEmail
        }
    };

    var generateRandom = generateRandomName();
    var randomFirstName = generateRandom.firstName;
    var randomLastName = generateRandom.lastName;
    var randomEmail = generateRandom.generatedEmail;

};
  module.exports = prospectTest;