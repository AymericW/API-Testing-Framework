const { Given, When, Then } = require("cucumber");
const api = require('../../util/api');
const root_url = "https://p1.easybanking.qabnpparibasfortis.be"
const distributorId = '52FB001'
const user = {
    smid: "7151929767",
    cardnumber: "67030417206822842",
    name: 'Demo User'
}
var randHex = function(len) {
    var maxlen = 8,
        min = Math.pow(16, Math.min(len, maxlen) - 1)
    max = Math.pow(16, Math.min(len, maxlen)) - 1,
        n = Math.floor(Math.random() * (max - min + 1)) + min,
        r = n.toString(16);
    while (r.length < len) {
        r = r + randHex(len - maxlen);
    }
    return r;
};

const csrf = randHex(128);
let agreementId;

const headers = {
    'CSRF': csrf,
    'Cookie': 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    'Content-Type': 'application/json'
}

function processcallback(response) {
    console.log(response.req);
}

Given('I am logged in as {string}', function(string) {
    // Write code here that turns the phrase above into concrete actions
    api.post(root_url + '/EBIA-pr01/rpc/identAuth/retrieveLoginProfiles', { distributorId }, headers)
        .then((response) => {

            response.headers['set-cookie'].forEach(header => {
                headers.Cookie += header + ';'

            });

            return api.post(root_url + '/EBIA-pr01/rpc/identAuth/initiateLoginTransaction', {
                saveAlias: '0',
                distributorId,
                smid: user.smid,
                authenticationFactorId: user.cardnumber,
                minimumDacLevel: '5',
                language: 'EN'
            }, headers)

        }).then((response) => {

            agreementId = response.body.value.channelAgreements[0].agreementId;

            response.headers['set-cookie'].forEach(header => {
                headers.Cookie += header + ';'

            });

            return api.post(root_url + '/EBIA-pr01/rpc/identAuth/getLoginMeans', {
                distributorId,
                smid: user.smid,
                minimumDacLevel: '5'
            }, headers)

        }).then((response) => {
            const requestedMeanId = response.body.value.authenticationMeans[0].authenticationMeanId;
            response.headers['set-cookie'].forEach(header => {
                headers.Cookie += header + ';'

            });

            return api.post(root_url + '/EBIA-pr01/rpc/identAuth/executeLoginTransaction', {
                distributorId,
                smid: user.smid,
                requestedMeanId,
                agreementId
            }, headers)

        }).then((response) => {
            return api.get('https://i-net800.be.fortis.bank/EBPGJ01/BE_FORTIS_EBPG-pr01-war/rpc/ucr/CalculateOTP')
                /*return api.post('https://i-net800.be.fortis.bank/EBPGJ01/BE_FORTIS_EBPG-pr01-war/rpc/ucr/CalculateOTP', {
                    clientNumber: user.smid,
                    callMode: '01',
                    previousWindowFlag: '0'
                }, {
                    Cookie: 'CSRF=7J2vNthZH8qrMarOBTirxJZT9IT0aTeKEftAQvHT1Q0zzwK5V8tzobkb6vxoCch0ixLknFdv6qkmUrGrdLu0imsAuTamQBiwAEKBCPWX15oPhTI7Ag8w17OIPNul6phI',
                    CSRF: '7J2vNthZH8qrMarOBTirxJZT9IT0aTeKEftAQvHT1Q0zzwK5V8tzobkb6vxoCch0ixLknFdv6qkmUrGrdLu0imsAuTamQBiwAEKBCPWX15oPhTI7Ag8w17OIPNul6phI',
                    'Content-Type': 'application/json'
                })*/

        }).then((response) => { console.log(response.body) });

});


When('I retrieve my contactpoints', function(callback) {
    // Write code here that turns the phrase above into concrete actions
    //api.post("https://p1.easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentData/getContactPointList", {}).then(processcallback);
});



Then('status code is {string}', function(status, callback) {
    // Write code here that turns the phrase above into concrete actions
    //console.log(callback);
    //callback.then(processcallback);
});