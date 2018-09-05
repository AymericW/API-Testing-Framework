const request = require('request-promise');

const ENV_URL = {
    "TEST2"   : "https://app.easybanking.test2access.qabnpparibasfortis.be",
    "TEST"  : "https://easybanking.testaccess.qabnpparibasfortis.be",
    "QA"    : "https://easybanking.qabnpparibasfortis.be",
    "QA+1"  : "https://p1.easybanking.qabnpparibasfortis.be",
    "QA-1"  : "https://m1.easybanking.qabnpparibasfortis.be"
};

module.exports = {

    get: (url) =>  request({ 
        url: ENV_URL[process.env.TARGET_ENV || "QA+1"] + url,
        json: true,
        resolveWithFullResponse: true,
        simple: false
    })

}