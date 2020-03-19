const { Given, When, Then } = require("cucumber");
const api = require('../../util/api');
const root_url = "https://p1.easybanking.qabnpparibasfortis.be"
const Shell = require('node-powershell');
const distributorId = '52FB001'
let ucrToken;
let ucrTokenFinal;
let errorlog;
const user = {
    smid: "7151929767",
    cardnumber: "67030417223625475",
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

const ps = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true
})

const csrf = randHex(128);
let agreementId;

const headers = {
    'CSRF': csrf,
    'Cookie': 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    'Content-Type': 'application/json'
}

function processcallback(response) {
    console.log(response.body);
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
            response.headers['set-cookie'].forEach(header => {
                headers.Cookie += header + ';'

            });


            ps.addCommand('../../bypass.ps1');


            ps.invoke().then((output) => {
                console.log(output)
                ucrToken = JSON.parse(output)
                errorlog = ucrToken.errorArea;


                ucrTokenFinal = ucrToken.token;


                console.log("!!!!!!!!!!!!!!!!!!!!!UCR TOKEN!!!!!!!!!!!!!!!!!");
                console.log(ucrTokenFinal);
                console.log(errorlog);
                return api.post(root_url + '/EBIA-pr01/rpc/identAuth/checkLoginResult', {
                    smid: user.smid,
                    distributorId,
                    ucr: {
                        signature: ucrTokenFinal
                    }
                }, headers)
            }).then((response) => {

                var auth = "";
                auth += "<DIST_ID>52FB001</DIST_ID>";
                auth += "<MEAN_ID>UCR</MEAN_ID>";
                auth += "<EAI_AUTH_TYPE>UCR</EAI_AUTH_TYPE>";
                auth += "<EBANKING_USER_ID><SMID>" + user.smid + "</SMID></EBANKING_USER_ID>";
                auth += "<EBANKING_USER_AUTHENTICITY_VALIDATION>";
                auth += "<VALIDATION_DATE></VALIDATION_DATE>";
                auth += "<VALID></VALID>";
                auth += "<AUTHENTICATION_MEAN_ID>08</AUTHENTICATION_MEAN_ID>";
                auth += "</EBANKING_USER_AUTHENTICITY_VALIDATION>";

                var encoded = encodeURIComponent(encodeURIComponent(auth));
                var auth_string = "AUTH=" + encoded;

                return api.post(root_url + '/SEEA-pa01/SEEAServer', {

                    auth_string

                }, {
                    'CSRF': csrf,
                    'Cookie': 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded'
                })


            }).then((response) => { console.log(response.body) });;


        }).then((response) => {});

});


When('I retrieve my contactpoints', function(callback) {
    // Write code here that turns the phrase above into concrete actions
    return api.post("https://p1.easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentData/getContactPointList", {}).then(response => { console.log(response.body) });
});



Then('status code is {string}', function(status, callback) {
    // Write code here that turns the phrase above into concrete actions
    //console.log(callback);
    //callback.then(processcallback);
});