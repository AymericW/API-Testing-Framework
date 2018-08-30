    var fs = require('fs');
    var request = require('request-promise');
    var queryResponse;

    var getProductList = function () {        
        var TARGET_ENV = process.env.TARGET_ENV || "QA+1";
        var productListLink = "/AC52-pr90/rpc/v1/products?ageUnder28=";

/*############################################### GET products according to age and language ###############################################*/

        this.When(/^I try to get a product according to my age (.*) (.*)$/, function (under28, language, callback) {
            let age = "n";
            let ageFactor = JSON.parse(under28);
            age = (ageFactor == "NO") ? "n" : "y";
            
            let languageFactor = JSON.parse(language);

            switch(languageFactor){
                case "en":
                    languageSelected = "&lang=en";
                    break;
                case "de":
                    languageSelected = "&lang=de";
                    break;
                case "nl":
                    languageSelected = "&lang=nl";
                    break;
                default:
                    languageSelected = "&lang=fr";
                    break;
            }

            var reqOptions = {
                url: this.ENVIRONMENTS[TARGET_ENV]+productListLink+age+languageSelected,
                method: 'GET',
                headers: {
                "Content-Type": "application/json",
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
                fs.writeFileSync('productsResponse.json',JSON.stringify(queryResponse));
                callback();
            })
            .catch(function (err) {
                throw "*** ERROR DUDE: "+err.toString();
            });
        });

/*############################################## Validate GET products response with yaml ##############################################*/

        this.Then(/^I should be able to get the correct products$/, function (callback) {
            //yaml validation
            var yamlValidationResult = this.validateApiDefinition(queryResponse,"getProducts");

            if(yamlValidationResult.isValid){
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
            }else{
                callback(new Error("Response doesnt respect the api definition with the Error : " + yamlValidationResult.message + " , " + yamlValidationResult.schemaPath));
            }
        });
    
    };

/*######################################################### FUNCTIONS #########################################################*/

// Fields validation
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