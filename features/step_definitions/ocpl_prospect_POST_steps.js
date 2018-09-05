var request = require('request-promise');
var chai = require('chai').assert;

var prospectTest = function () {
    var TARGET_ENV = process.env.TARGET_ENV || "QA+1";
    var prospectLink = "/OCPL-pr90/rpc/v1/prospects";

/*############################################## POST (create) a prospect with some random data ##############################################*/

    When(/^I try create a prospect with some data$/, function (callback) {
        var reqOptions = {
            url: this.ENVIRONMENTS[TARGET_ENV]+prospectLink,
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

        console.log("Environment : "+ reqOptions.url);
        
        if (process.env.HTTP_PROXY){
            reqOptions.proxy = process.env.HTTP_PROXY;
        }
        request(reqOptions)
        .then(function (response) {
            global.POSTqueryResponse = response.body;
            global.prospectID = POSTqueryResponse.id;
            console.log(POSTqueryResponse);
            callback();
        })
        .catch(function (err) {
            throw "*** ERROR DUDE: "+err.toString();
        });
    });

/*############################################## Validate POST prospect response with yaml ##############################################*/

    Then(/^I should be able to get the correct prospect$/, function (callback) {
        console.log("The created prospect ID is " + prospectID);

        //yaml validation
        var yamlValidationResult = this.validateApiDefinition(POSTqueryResponse,"addProspect");
        if(yamlValidationResult.isValid){
            validateProspect(callback);
        }else{
            callback(new Error("Response doesnt respect the api definition with the Error : " + yamlValidationResult.message + " , " + yamlValidationResult.schemaPath));
        }
    });
};

/*######################################################### FUNCTIONS #########################################################*/

// Fields validation
function validateProspect(callback){
    var errorList = [];
    if(POSTqueryResponse.id === null || POSTqueryResponse.id === undefined || typeof(POSTqueryResponse.id) != "string"){
        errorList.push("id : " + POSTqueryResponse.id);
    }

    if(POSTqueryResponse.identId === null || POSTqueryResponse.identId === undefined || typeof(POSTqueryResponse.identId) != "string"){
        errorList.push("identId : " + POSTqueryResponse.identId);
    }
    
    if(POSTqueryResponse.lastName !== randomLastName || POSTqueryResponse.lastName === undefined || typeof(POSTqueryResponse.lastName) != "string"){
        errorList.push("lastName : " + POSTqueryResponse.lastName);
    }
    
    if(POSTqueryResponse.firstName !== randomFirstName || POSTqueryResponse.firstName === undefined || typeof(POSTqueryResponse.firstName) != "string"){
        errorList.push("firstName : " + POSTqueryResponse.firstName);
    }
    
    if(POSTqueryResponse.email !== randomEmail || POSTqueryResponse.email === undefined || typeof(POSTqueryResponse.email) != "string"){
        errorList.push("email : " + POSTqueryResponse.email);
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

module.exports = prospectTest;