var request = require('request-promise');
var chai = require('chai').assert;

var prospectTest = function () {
    var queryResponse;
    var TARGET_ENV = process.env.TARGET_ENV || "TEST";
    var getProspect = "/OCAL-ap90-war/rpc/prospects";
    const ENVIRONMENTS = {
      "TEST2"   : "https://app.easybanking.test2access.qabnpparibasfortis.be",
      "TEST"  : "https://easybanking.testaccess.qabnpparibasfortis.be",
      "QA"    : "https://easybanking.qabnpparibasfortis.be",
      "QA+1"  : "https://p1.easybanking.qabnpparibasfortis.be",
      "QA-1"  : "https://m1.easybanking.qabnpparibasfortis.be"
    };

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
        //yaml validation
        var yamlValidationResult = this.validateApiDefinition(queryResponse,"addProspect");
        if(yamlValidationResult.isValid){
            validateProspect(callback);
        }else{
            callback(new Error("Response doesnt respect the api definition with the Error : " + yamlValidationResult.message));
        }
    });

    function validateProspect(callback){
        // Fields validated
        var errorList = [];
        if(queryResponse.id === null || queryResponse.id === undefined || typeof(queryResponse.id) != "string"){
            errorList.push("id : " + queryResponse.id);
        }
        if(queryResponse.identId === null || queryResponse.identId === undefined || typeof(queryResponse.identId) != "string"){
            errorList.push("identId : " + queryResponse.identId);
        }
        if(queryResponse.lastName !== randomLastName || queryResponse.lastName === undefined || typeof(queryResponse.lastName) != "string"){
            errorList.push("lastName : " + queryResponse.lastName);
        }
        if(queryResponse.firstName !== randomFirstName || queryResponse.firstName === undefined || typeof(queryResponse.firstName) != "string"){
            errorList.push("firstName : " + queryResponse.firstName);
        }
        if(queryResponse.email !== randomEmail || queryResponse.email === undefined || typeof(queryResponse.email) != "string"){
            errorList.push("email : " + queryResponse.email);
        }

        // // Throw error
        if(errorList.length !== 0){
            var errors = "";
            errorList.forEach(element => {
                errors += element + "\n";
            });
            callback(new Error("The Following Fields were incorrect \n" + errors));
        }else{
            callback();
        }
    }
    
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

};
  module.exports = prospectTest;