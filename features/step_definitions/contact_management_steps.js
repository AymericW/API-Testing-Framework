const { Given, When, Then } = require("cucumber");
var querystring = require('querystring');
const api = require('../../util/api');
const root_url = "https://p1.easybanking.qabnpparibasfortis.be"
const Shell = require('node-powershell');
const distributorId = '52FB001'
let ucrToken;
let ucrTokenFinal;
let errorlog;
var seea_server_cookies;



const user = {
    smid: "1180546302",
    cardnumber: "67030417188221005",
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

//const csrf = randHex(128);
const csrf = '2e9312a346129e623ca0c830b874fcd3e25a8a0c1919f2d03414b7a13c5d9e65f447255cb9b2b69d485e13066c14cd0cf9e8bd8777be028ae468ffece305bef5627ce76f8d4c68d6a70880eae33b41e6407ab1c14f48830e50369b607042bfc8c9d0a6c601606b81545f3cb1c32818338924b4c1c9c8a27e87bba7140555fca2';
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

            console.log('The response for get login means');
            console.log(response.body.value.authenticationMeans[0]);
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
            const ps = new Shell({
                executionPolicy: 'Bypass',
                noProfile: true
            })

            ps.addCommand('../../bypass.ps1');


            ps.invoke().then((output) => {
                console.log(output)
                ucrToken = JSON.parse(output)
                errorlog = ucrToken.errorArea;


                ucrTokenFinal = ucrToken.token;


                console.log("!!!!!!!!!!!!!!!!!!!!!UCR TOKEN!!!!!!!!!!!!!!!!!");
                console.log(ucrTokenFinal);
                console.log(errorlog);
                ps.dispose();
                console.log("check login result cookie");
                seea_server_cookies = headers.Cookie;
                console.log(headers.Cookie);
                console.log("SEEA_SERVER_COOKIES");
                console.log(seea_server_cookies);
                return api.post(root_url + '/EBIA-pr01/rpc/identAuth/checkLoginResult', {
                    smid: user.smid,
                    distributorId,
                    ucr: {
                        signature: ucrTokenFinal
                    }
                }, headers)
            }).then((response) => {
                console.log("check login result");
                console.log(response.body);
                response.headers['set-cookie'].forEach(header => {
                    headers.Cookie += header + ';'
              
                });
          
                var auth = "";
                 auth += "<DIST_ID>52FB001</DIST_ID>";
                 auth += "<MEAN_ID>UCRS</MEAN_ID>";
                 auth += "<EAI_AUTH_TYPE>UCRS</EAI_AUTH_TYPE>";
                 auth += "<EBANKING_USER_ID><SMID>" + user.smid + "</SMID></EBANKING_USER_ID>";
                 auth += "<EBANKING_USER_AUTHENTICITY_VALIDATION>";
                 auth += "<AUTHENTICATION_MEAN_ID>08</AUTHENTICATION_MEAN_ID>";
                 auth += "</EBANKING_USER_AUTHENTICITY_VALIDATION>";

                var encoded = encodeURIComponent(auth);
                var auth_string = "AUTH=" + encoded;
                var formData = querystring.stringify(auth_string); 
                return api.postForm(root_url + '/SEEA-pa01/SEEAServer', 
                     auth_string,
                 {
                    'CSRF': csrf,
                    'Cookie': seea_server_cookies,
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded'
                })


            }).then((response) => {
                response.headers['set-cookie'].forEach(header => {
                    headers.Cookie += header + ';'
            
                });

                console.log("response code");
                console.log(response.statusCode);
                console.log(response.headers['location']);

                // return api.post("https://p1.easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentData/getContactPointList", {}, headers);


            }).then((response) => {
                //console.log(response.body);
            })


        }).then((response) => {


        });
        

});


When('I retrieve my contactpoints', function(callback) {
    // Write code here that turns the phrase above into concrete actions

});



Then('status code is {string}', function(status, callback) {
    // Write code here that turns the phrase above into concrete actions
    //console.log(callback);
    //callback.then(processcallback);
});