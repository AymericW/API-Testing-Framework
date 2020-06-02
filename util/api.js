const request = require('request-promise').defaults({ jar: true });
const tough = require('tough-cookie');


let cookie = new tough.Cookie({
    key: "CSRF",
    value: "7J2vNthZH8qrMarOBTirxJZT9IT0aTeKEftAQvHT1Q0zzwK5V8tzobkb6vxoCch0ixLknFdv6qkmUrGrdLu0imsAuTamQBiwAEKBCPWX15oPhTI7Ag8w17OIPNul6phI",
    domain: 'i-net800-qa.be.fortis.bank',
    httpOnly: true,
    maxAge: 31536000
});

let cookie2 = new tough.Cookie({
    key: "PD-S-SESSION-ID",
    value: "1_2_1_N3yUA0erocTptIn8nkxgJnHuJfsYD2X8aWkONr9GyL8HQ9+T",
    domain: 'i-net800-qa.be.fortis.bank',
    httpOnly: true,
    maxAge: 31536000
});

//Put cookie in an jar which can be used across multiple requests
var cookiejar = request.jar();
cookiejar.setCookie(cookie.toString(), 'https://i-net800-qa.be.fortis.bank');
cookiejar.setCookie(cookie2.toString(), 'https://i-net800-qa.be.fortis.bank');

const ENV_URL = {
    "TEST2": "https://app.easybanking.test2access.qabnpparibasfortis.be",
    "TEST": "https://easybanking.testaccess.qabnpparibasfortis.be",
    "QA": "https://easybanking.qabnpparibasfortis.be",
    "QA+1": "https://p1.easybanking.qabnpparibasfortis.be",
    "QA-1": "https://m1.easybanking.qabnpparibasfortis.be"
};

module.exports = {

    get: (url) => request({
        url: url,
        json: true,
        resolveWithFullResponse: true,
        simple: false,
        rejectUnauthorized: false,
        proxy: "http://nwbcproxy.res.sys.shared.fortis:8080"
    }),

    get: (url, headers) => request({
        url: url,
        json: true,
        resolveWithFullResponse: true,
        simple: false,
        rejectUnauthorized: false,
        headers,
        proxy: "http://nwbcproxy.res.sys.shared.fortis:8080",
        insecure: true,
        jar: cookiejar
    }),

    post: (url, body) => request({
        url: url,
        body,
        method: 'POST',
        json: true,
        resolveWithFullResponse: true,
        simple: false,
        rejectUnauthorized: false,
        proxy: "http://nwbcproxy.res.sys.shared.fortis:8080"
    }),

    postForm: (url, body, headers) => request({
        url: url,
        body,
        method: 'POST',
        json: false,
        resolveWithFullResponse: true,
        simple: false,
        rejectUnauthorized: false,
        proxy: "http://nwbcproxy.res.sys.shared.fortis:8080",
        headers,
        insecure: true,
        jar: cookiejar
    }),

    post: (url, body, headers) => request({
        url: url,
        body,
        method: 'POST',
        json: true,
        resolveWithFullResponse: true,
        simple: false,
        rejectUnauthorized: false,
        proxy: "http://nwbcproxy.res.sys.shared.fortis:8080",
        headers,
        insecure: true,
        jar: cookiejar
    })

}