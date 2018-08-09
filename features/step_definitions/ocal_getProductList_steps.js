    var request = require('request-promise');
    var queryResponse;

    var getProductList = function () {        
        var ageFactor;
        // var TARGET_ENV = process.env.TARGET_ENV || "TEST";
        var getProductList = "/OCAL-ap90-war/rpc/products?ageUnder28=";
        // const ENVIRONMENTS = {
        //   "TEST2"   : "https://app.easybanking.test2access.qabnpparibasfortis.be",
        //   "TEST"  : "https://easybanking.testaccess.qabnpparibasfortis.be",
        //   "QA"    : "https://easybanking.qabnpparibasfortis.be",
        //   "QA+1"  : "https://p1.easybanking.qabnpparibasfortis.be",
        //   "QA-1"  : "https://m1.easybanking.qabnpparibasfortis.be"
        // };
    
        this.When(/^I try to get a product according to my age (.*)$/, function (under28, callback) {
            let age = "n";
            ageFactor = JSON.parse(under28);
            age = (ageFactor == "NO") ? "n" : "y";
            var reqOptions = {
                url: "http://sdwl0314:9092"+getProductList+age,
                method: 'GET',
                headers: {
                "Content-Type": "application/json",
                },
                body: {
                },
                json: true,
                resolveWithFullResponse: true,
                simple: false
            };
            console.log("Request URL : " + reqOptions.url);

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
    
        this.Then(/^I should be able to get the correct products$/, function (callback) {
            // Fields validated
            var errorList = checkProducts(ageFactor);
            // Throw error
            if(errorList.length !== 0){
                var errors = "";
                errorList.forEach(element => {
                    errors += element + "\n";
                });
                callback(new Error("The Following Fields were incorrect \n" + errors));
            }else{
                callback();
            }
        });
    
    };

    function checkProducts(ageParam){
        var errorList = [];
        var productIndex = 0;
        // Age < 28 -> "CDIGPK"
        // Age >= 28 -> "CCOMF", "CPREMI"
        queryResponse.forEach(product => {
            productIndex ++;
            var isValidPack = false;
            if(ageParam === "YES"){
                isValidPack = validateAccountType(product.accType,["CDIGPK"]);
                isValidPack = validateAccountType(product.accountProductName,["Compte à vue Hello4You"]);
            }else{
                isValidPack = validateAccountType(product.accType,["CCOMF","CPREMI"]);
                isValidPack = validateAccountType(product.accountProductName,["Comfort Pack","Premium Pack"]);
            }
            if(!isValidPack){
                errorList.push(productIndex + "-accType :"+ product.accType + " is not permitted");
            }
            if(product.accType === null || product.accType === undefined || typeof(product.accType) != 'string'){
                errorList.push(productIndex + "-accType : " + product.accType);
            }
            if(product.accountProductName === null || product.accountProductName === undefined || typeof(product.accountProductName) != 'string'){
                errorList.push(productIndex + "-accountProductName : " + product.accountProductName);
            }
            if(ageParam === "YES"){
                console.log("accType expected for under 28:  'CDIGPK' \n" + "accType fetched are: " + product.accType);
            }else{
                console.log("accType expected for above 28:  'CCOMF' or 'CPREMI' \n" + "accType fetched are: " + product.accType);
            }
        });
        return errorList;
    }

    function validateAccountType(accType,acceptedProducts){
        var validationResult = false;
        acceptedProducts.forEach(acceptedAccountType => {
            if(acceptedAccountType === accType){
                validationResult = true;
            }
        });
        return validationResult;
    }

    module.exports = getProductList;