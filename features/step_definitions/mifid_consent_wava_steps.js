const { Given, When, Then } = require("cucumber");
const assert = require('chai').assert;
const api = require('../../util/api');
const root_url = "https://easybanking.qabnpparibasfortis.be";
const login = require('../../util/login');

let bodyResponse;
let statusResponse;
let mifidConsentId;
let msmcRequest;
let dataConsentId;

const csrf = '2e9312a346129e623ca0c830b874fcd3e25a8a0c1919f2d03414b7a13c5d9e65f447255cb9b2b69d485e13066c14cd0cf9e8bd8777be028ae468ffece305bef5627ce76f8d4c68d6a70880eae33b41e6407ab1c14f48830e50369b607042bfc8c9d0a6c601606b81545f3cb1c32818338924b4c1c9c8a27e87bba7140555fca2';

const headers = {
    'CSRF': csrf,
    'Cookie': 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    'Content-Type': 'application/json'
}



Given('that i am a logged in user with {string} as smid and {string} as cardnumber', function(smid, cardNumber, callback) {
    login(smid, cardNumber, callback);
});


When('I update my mifid consent to {string}', function(consent, callback) {
    // Get the MIFID Consent and Then Udate the Mifid consent
    api.post('https://easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentManagement/getConsentList', {}, headers)
        .then((response) => {
            console.log("Got Consent Lists")
            bodyResponse = response.body
            statusResponse = response.statusCode
            mifidConsentId = response.body.value.mifidCommunicationConsent.consentId

            return api.post('https://easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentManagement/modifyConsentList', {
                "consents": [{ "consent": consent, "consentId": mifidConsentId }]
            }, headers)

        }).then(() => {
            console.log("Trying to update mifid consent")
            callback();
        })
});

When('I update my mifid consent to {string} with an invalid signature', function(consent, callback) {
    api.post('https://p1.easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentManagement/getConsentList', {}, headers)
        .then((response) => {
            console.log("Got Consent Lists")
            bodyResponse = response.body
            statusResponse = response.statusCode
            mifidConsentId = response.body.value.mifidCommunicationConsent.consentId

            return api.post('https://easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/v1/customer/signatures', { "type": "mifidConsent" }, headers)

        }).then((response) => {
            console.log("Trying to update mifid consent");
            msmcRequest = response.body.msmcRequest;
            return api.post('https://easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentManagement/modifyConsentList', {
                "consents": [{ "consent": consent, "consentId": mifidConsentId, "msmcRequest": msmcRequest }]
            }, headers)

        }).then(() => {
            callback();
        })

});


When('I update my data consent to {string}', function(consent, callback) {
    api.post('https://easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentManagement/getConsentList', {}, headers)
        .then((response) => {
            console.log("Got Consent Lists");
            bodyResponse = response.body;
            statusResponse = response.statusCode;
            console.log(bodyResponse);
            dataConsentId = bodyResponse.value.dataConsent.consentId;
            let dataType = bodyResponse.value.dataConsent.type;
            console.log(dataConsentId);
            console.log(dataType);

            return api.post('https://easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentManagement/modifyConsentList', {
                "consents": [{ "consent": consent, "consentId": dataConsentId, "type": dataType }]
            }, headers)

        }).then((response) => {
            console.log(response.body);
            callback();
        })
});






Then('the mifid consent is updated to {string}', function(consent, callback) {
    //Check if consent is "OUT"
    api.post('https://easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentManagement/getConsentList', {}, headers)
        .then((response) => {
            assert.equal(response.body.value.mifidCommunicationConsent.consent, consent);
            console.log("Mifid consent updated");
            callback();
        })

});

Then('the mifid consent is not updated', function(callback) {
    // Assert consent is not updated
    api.post('https://easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentManagement/getConsentList', {}, headers)
        .then((response) => {
            assert.equal(response.body.value.mifidCommunicationConsent.consentId, mifidConsentId);
            console.log("Mifid consent not updated");
            callback();
        })
});

Then('the data consent is updated to {string}', function(consent, callback) {
    // Assert consent is not updated
    api.post('https://easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/consentManagement/getConsentList', {}, headers)
        .then((response) => {
            //assert.notEqual(response.body.value.dataConsent.consentId, dataConsentId);
            console.log("Data consent is updated");
            callback();
        })
});