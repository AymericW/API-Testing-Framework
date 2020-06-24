const querystring = require('querystring');
const api = require('./api');
const root_url = "https://p1.easybanking.qabnpparibasfortis.be";
const Shell = require('node-powershell');
//const execute = require('execute-shell-promise');
const { exec, spawn } = require("child_process");
let child;
let command;


const distributorId = '52FB001';
let ucrToken;
let ucrTokenFinal;
let errorlog;
let seea_server_cookies;
let agreementId;
const csrf = '2e9312a346129e623ca0c830b874fcd3e25a8a0c1919f2d03414b7a13c5d9e65f447255cb9b2b69d485e13066c14cd0cf9e8bd8777be028ae468ffece305bef5627ce76f8d4c68d6a70880eae33b41e6407ab1c14f48830e50369b607042bfc8c9d0a6c601606b81545f3cb1c32818338924b4c1c9c8a27e87bba7140555fca2';
let tempCookieHeader;

const headers = {
    'CSRF': csrf,
    'Cookie': 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    'Content-Type': 'application/json'
}


const login = (smid, cardNumber, callback) => {
    tempCookieHeader = 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';';
    return api.post(root_url + '/EBIA-pr01/rpc/identAuth/retrieveLoginProfiles', { distributorId }, headers)
        .then((response) => {

            response.headers['set-cookie'].forEach(header => {
                tempCookieHeader += header + ';'

            });

            return api.post(root_url + '/EBIA-pr01/rpc/identAuth/initiateLoginTransaction', {
                saveAlias: '0',
                distributorId,
                smid: smid,
                authenticationFactorId: cardNumber,
                minimumDacLevel: '5',
                language: 'EN'
            }, headers)

        }).then((response) => {
            agreementId = response.body.value.channelAgreements[0].agreementId;
            response.headers['set-cookie'].forEach(header => {
                tempCookieHeader += header + ';'

            });

            return api.post(root_url + '/EBIA-pr01/rpc/identAuth/getLoginMeans', {
                distributorId,
                smid: smid,
                minimumDacLevel: '5'
            }, headers)

        }).then((response) => {
            const requestedMeanId = response.body.value.authenticationMeans[0].authenticationMeanId;
            response.headers['set-cookie'].forEach(header => {
                tempCookieHeader += header + ';'
            });

            return api.post(root_url + '/EBIA-pr01/rpc/identAuth/executeLoginTransaction', {
                distributorId,
                smid: smid,
                requestedMeanId,
                agreementId
            }, headers)

        }).then((response) => {
            response.headers['set-cookie'].forEach(header => {
                tempCookieHeader += header + ';'

            });
            const ps = new Shell({
                executionPolicy: 'Bypass',
                noProfile: true
            })

            //ps.addCommand('./../bypass.ps1');
            ps.addCommand("powershell -command '& { . ./../bypass.ps1; MyUcrbypass "+smid+"}'")


            return ps.invoke().then((output) => {
                console.log(output)
                ucrToken = JSON.parse(output)
                errorlog = ucrToken.errorArea;


                ucrTokenFinal = ucrToken.token;


                console.log("!!!!!!!!!!!!!!!!!!!!!UCR TOKEN!!!!!!!!!!!!!!!!!");
                console.log(ucrTokenFinal);
                console.log(errorlog);
                ps.dispose();

                seea_server_cookies = headers.Cookie;

                return api.post(root_url + '/EBIA-pr01/rpc/identAuth/checkLoginResult', {
                    smid: smid,
                    distributorId,
                    ucr: {
                        signature: ucrTokenFinal
                    }
                }, headers)
            }).then((response) => {
                console.log("check login result");
                console.log(response.body);
                response.headers['set-cookie'].forEach(header => {
                    tempCookieHeader += header + ';'

                });

                var auth = "";
                auth += "<DIST_ID>52FB001</DIST_ID>";
                auth += "<MEAN_ID>UCRS</MEAN_ID>";
                auth += "<EAI_AUTH_TYPE>UCRS</EAI_AUTH_TYPE>";
                auth += "<EBANKING_USER_ID><SMID>" + smid + "</SMID></EBANKING_USER_ID>";
                auth += "<EBANKING_USER_AUTHENTICITY_VALIDATION>";
                auth += "<AUTHENTICATION_MEAN_ID>08</AUTHENTICATION_MEAN_ID>";
                auth += "</EBANKING_USER_AUTHENTICITY_VALIDATION>";

                var encoded = encodeURIComponent(auth);
                var auth_string = "AUTH=" + encoded;
                var formData = querystring.stringify(auth_string);
                return api.postForm(root_url + '/SEEA-pa01/SEEAServer',
                    auth_string, {
                        'CSRF': csrf,
                        'Cookie': seea_server_cookies,
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    })


            }).then((response) => {
                response.headers['set-cookie'].forEach(header => {
                    tempCookieHeader += header + ';'
                });
                if (response.statusCode == "302") {
                    console.log("response code");
                    console.log(response.statusCode);
                    console.log(response.headers['location']);
                    return api.get(response.headers['location'], headers)
                        .then((response) => {
                            response.headers['set-cookie'].forEach(header => {
                                tempCookieHeader += header + ';'
                            })
                            headers.Cookie = tempCookieHeader;
                            callback();
                        });


                } else {
                    callback();
                }
                //     


                //callback();
            })


        })

}

// const logout = async(callback) => {
//     const response = await api.get(root_url + '/SEPLJ00/sps/authsvc/policy/ebew_web_logout_qap1?auth=web-banking', headers);
//     console.log(response.headers['location']);
//     callback;
// }

module.exports = login;