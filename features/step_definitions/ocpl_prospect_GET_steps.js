var request = require('request-promise');
var chai = require('chai').assert;

var prospectGET = function () {
    var TARGET_ENV = process.env.TARGET_ENV || "QA+1";
    var prospectLink = "/OCPL-pr90/rpc/v1/prospects";

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
            console.log(GETqueryResponse);
            callback();
        })
        .catch(function (err) {
            throw "*** ERROR DUDE: "+err.toString();
        });
    });

    this.Then(/^I should have both data matching$/, function (callback) {
        objectEquals(GETqueryResponse, POSTqueryResponse);

        // var resultCompare = function(){
        //     console.log("Get response is ");
        //     console.log(GETqueryResponse);
        //     console.log("Post response is ");
        //     console.log(POSTqueryResponse);

        //     if(GETqueryResponse === POSTqueryResponse){
        //         return "GET response same as POST response";
        //     }else{
        //         return "GET response doesn't match POST response";
        //     }
        // }
        // console.log(resultCompare());
        callback();
    });
};
function objectEquals(a, b){

    for(let field in a){
        if(typeof(b[field]) == 'undefined'){
            return false;
        }
    }

    for(let field in a){

        if(typeof(a[field]) == 'object'){

            if(!objectEquals(a[field], b[field])){
                return false;
            }

        } else {
            
            console.log("Comparing POST " + field + ": " +a[field] + " and GET " + field + ": " + b[field]);
            
            if(a[field] != b[field]){
                return false;
            }

        }
    }

    return true;
}

module.exports = prospectGET;
