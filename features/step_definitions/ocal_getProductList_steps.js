    var request = require('request-promise');

    var getProductList = function () {
        var queryResponse;
        // var TARGET_ENV = process.env.TARGET_ENV || "TEST";
        var getProductList = "/OCAL-ap90-war/rpc/products?ageUnder28=";
        var answerNo = "n";
        var answerYes = "y";
        // const ENVIRONMENTS = {
        //   "TEST2"   : "https://app.easybanking.test2access.qabnpparibasfortis.be",
        //   "TEST"  : "https://easybanking.testaccess.qabnpparibasfortis.be",
        //   "QA"    : "https://easybanking.qabnpparibasfortis.be",
        //   "QA+1"  : "https://p1.easybanking.qabnpparibasfortis.be",
        //   "QA-1"  : "https://m1.easybanking.qabnpparibasfortis.be"
        // };
    
        this.When(/^I try get try to get a product according to my age (.*)$/, function (callback) {
            function chooseAnswer(){
                var Answer = "";
                if under28 = "YES"
                    Answer = "y";
                 else under28 = "NO";
                    Answer = "n";
                }
            }
            var choosenAnswer = chooseAnswer();
            
            var reqOptions = {
                url: "http://sdwl0314:9092"+getProductList+choosenAnswer,
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
    
        this.Then(/^I should be able to get product list (.*)$/, function (callback) {
            // Fields validated
            var errorList = [];
            if(queryResponse.id === null || queryResponse.id === undefined || typeof(queryResponse.id) != "string"){
                errorList.push("id : " + queryResponse.id);
            }

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
    module.exports = getProductList;