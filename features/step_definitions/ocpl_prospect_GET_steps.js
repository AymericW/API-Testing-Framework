var request = require('request-promise');
var chai = require('chai').assert;
var colors = require('colors');

var prospectGET = function () {
    var TARGET_ENV = process.env.TARGET_ENV || "QA+1";
    var prospectLink = "/OCPL-pr90/rpc/v1/prospects";

/*######################################################### GET a prospect with an ID #########################################################*/

    this.When(/^I try retrieve data from previously created prospect$/, function (callback) {
        var reqOptions = {
            url: this.ENVIRONMENTS[TARGET_ENV]+prospectLink+"/"+prospectID,
            method: 'GET',
            headers: {
            "Content-Type": "application/json",
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
            global.GETqueryResponse = response.body;
            // console.log(GETqueryResponse);
            callback();
        })
        .catch(function (err) {
            throw "*** ERROR DUDE: "+err.toString();
        });
    });

/*######################################################### Compare GET and POST response #########################################################*/

    this.Then(/^I should have both data matching$/, function (callback) { 
        chai.deepEqual(GETqueryResponse, POSTqueryResponse);
        // objectEquals(GETqueryResponse, POSTqueryResponse);

        callback();
    });
    
/*###################################################### GET a prospect without a correct ID ######################################################*/
    
    this.When(/^I try retrieve prospect data without id that doesn't exist$/, function (callback) {
        var reqOptions = {
            url: this.ENVIRONMENTS[TARGET_ENV]+prospectLink+"/"+prospectID,
            method: 'GET',
            headers: {
            "Content-Type": "application/json",
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
            global.GETqueryResponse = response.body;
            console.log(GETqueryResponse);
            callback();
        })
        .catch(function (err) {
            throw "*** ERROR DUDE: "+err.toString();
        });
    });
    
/*###################################################### Get error message for wrong ID input ######################################################*/

    this.Then(/^I should be I should get a proper error message$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });
};
    
/*######################################################### FUNCTIONS #########################################################*/

// // Fields validation
// function objectEquals(a, b){

//     for(let field in a){
//         if(typeof(b[field]) == 'undefined'){
//             return false;
//         }
//     }

//     for(let field in a){

//         if(typeof(a[field]) == 'object'){

//             if(!objectEquals(a[field], b[field])){
//                 return false;
//             }

//         } else {
        
//             console.log("Comparing POST " + field .blue + ": " +a[field] .green + " and GET " + field .blue + ": " + b[field] .green);
            
//             if(a[field] != b[field]){
//                 return false;
//             }

//         }
//     }

//     return true;
// }

module.exports = prospectGET;
