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
        url: url,
        json: true,
        resolveWithFullResponse: true,
        simple: false,
        rejectUnauthorized: false
    }),

    post: (url, body) => request({
        url: url,
        body,
        method:'POST',
        json: true,
        resolveWithFullResponse: true,
        simple: false,
        rejectUnauthorized: false
    })

}