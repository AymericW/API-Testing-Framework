    var fs = require('fs');
    var request = require('request-promise');
    var chai = require('chai').assert;
    var path = require('path');
    var queryResponse;

    var getProductList = function () {        
        var TARGET_ENV = process.env.TARGET_ENV || "QA+1";
        var productListLink = "/AC52-pr90/rpc/v1/products?ageUnder28=";

/*############################################### GET products according to age and language ###############################################*/

        this.When(/^I try to get a product according to my age (.*) (.*)$/, function (under28, language, callback) {

            this.ENVIRONMENTS[TARGET_ENV] + productListLink + under28 + "&lang=" + language

            var reqOptions = {
                url: this.ENVIRONMENTS[TARGET_ENV] + productListLink + under28 + "&lang=" + language,
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
                // console.log(queryResponse);
                // fs.writeFileSync('productsResponse.json',JSON.stringify(queryResponse));
                callback();
            })
            .catch(function (err) {
                throw "*** ERROR DUDE: "+err.toString();
            });
        });

/*############################################## Validate GET products response with yaml ##############################################*/

        this.Then(/^I should be able to get the correct products (.*) (.*)$/, function (under28, language, callback) {

            chai.deepEqual(queryResponse, loadProductsReference(under28, language));
            callback();
     
        });
    
    };

/*######################################################### FUNCTIONS #########################################################*/

// Fields validation
function loadProductsReference(under28, language){

    let filePath;
    
    if(under28 == "y"){
        switch(language){
            case "en":
                filePath = "./references/productList/under28English.json";
                break;
            case "fr":
                filePath= "./references/productList/under28French.json";
                break;
            case "nl":
                filePath= "./references/productList/under28Dutch.json";
                break;
            case "de":
                filePath= "./references/productList/under28German.json";
                break;
        }
    }else{
        switch(language){
            case "en":
                filePath = "./references/productList/above28English.json";
                break;
            case "fr":
                filePath= "./references/productList/above28French.json";
                break;
            case "nl":
                filePath= "./references/productList/above28Dutch.json";
                break;
            case "de":
                filePath= "./references/productList/above28German.json";
                break;
        }
    }

  console.log(filePath);

  return JSON.parse(fs.readFileSync(path.resolve(filePath)));
}

module.exports = getProductList;