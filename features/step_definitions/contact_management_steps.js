const { Given, When, Then } = require("cucumber");
const assert = require('chai').assert;
const querystring = require('querystring');
const api = require('../../util/api');
const login = require('../../util/login');

const csrf = '2e9312a346129e623ca0c830b874fcd3e25a8a0c1919f2d03414b7a13c5d9e65f447255cb9b2b69d485e13066c14cd0cf9e8bd8777be028ae468ffece305bef5627ce76f8d4c68d6a70880eae33b41e6407ab1c14f48830e50369b607042bfc8c9d0a6c601606b81545f3cb1c32818338924b4c1c9c8a27e87bba7140555fca2';
let responseBody;
let responseStatusCode;
let IncorrectContacpointBodyResponse;

//URLS
const EASYBANKING_URL = 'https://p1.easybanking.qabnpparibasfortis.be'
const OCPL_PR01 = EASYBANKING_URL + '/OCPL-pr01'


const GET_CONTACTPOINT_LIST_URL = OCPL_PR01 + '/rpc/consentData/getContactPointList';
const DELETE_CONTACTPOINT_URL = OCPL_PR01 + '/rpc/consentData/deleteContactPoint';
const INSERT_CONCTACTPOINT_URL = OCPL_PR01 + '/rpc/consentData/insertContactPoint';

const GET_CONSENT_LIST_URL = OCPL_PR01 + '/rpc/consentManagement/getConsentList';
const MODIFY_CONSENT_LIST_URL = OCPL_PR01 + '/rpc/consentManagement/modifyConsentList';



const headers = {
    'CSRF': csrf,
    'Cookie': 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    'Content-Type': 'application/json'
}



Given('I am logged with smid {string} and {string} as cardnumber', function(smid, cardnumber, callback) {
    login(smid, cardnumber, callback);
});

Given('my general consent is opt {string}', function(consent, callback) {
    api.post(GET_CONSENT_LIST_URL, {}, headers)
        .then((response) => {
            console.log(response.body);
            consentId = response.body.value.dataConsent.consentId
            if (response.body.value.dataConsent.consent == "NC" || response.body.value.dataConsent.consent == "OU") {
                api.post(MODIFY_CONSENT_LIST_URL, {
                        "consents": [{ consent, consentId }]
                    }, headers)
                    .then(() => callback())
            }
            callback();
        })
});

Given('I have no email contactpoints', function(callback) {
    api.post(GET_CONTACTPOINT_LIST_URL, {}, headers)
        .then((response) => {
            const emails = response.body.value.eMailAddressList;

            const promises = emails.map(email =>
                api.post(DELETE_CONTACTPOINT_URL, {
                    "id": email.id
                }, headers)
            );
            Promise.all(promises).then(() => callback())
        })
})

Given('I have no phone number contact points', function(callback) {
    api.post(GET_CONTACTPOINT_LIST_URL, {}, headers)
        .then((response) => {
            const phoneNumbers = response.body.value.mobilePhoneList;

            const promises = phoneNumbers.map(number =>
                api.post(DELETE_CONTACTPOINT_URL, {
                    "id": number.id
                }, headers)
            );
            Promise.all(promises).then(() => callback())
        })
})

Given('There is <phone_number> number in the list with type <type>', function(phoneNumber, type, callback) {
    api.post(INSERT_CONCTACTPOINT_URL, {
        "consents": [{
                "value": "NC",
                "usage": "SMS"
            },
            {
                "value": "NC",
                "usage": "CALL"
            }
        ],
        "type": type,
        "value": phoneNumber
    }, headers).then(() => callback())
});


When('I introduce a new email address {string} with private usage and communication consent to {string}', function(email, com_consent, callback) {
    api.post(INSERT_CONCTACTPOINT_URL, {
        "consents": [{
            "value": com_consent,
        }],
        "type": "03",
        "value": email,
    }, headers).then((response) => {
        IncorrectContacpointBodyResponse = response.body;
        callback();
    })
});

When('I introduce a new domestic phone number {string} with {string}', function(phone_number, type, callback) {
    api.post(INSERT_CONCTACTPOINT_URL, {
        "consents": [{
                "value": "NC",
                "usage": "SMS"
            },
            {
                "value": "NC",
                "usage": "CALL"
            }
        ],
        "type": type,
        "value": phone_number
    }, headers).then((response) => {
        console.log(response.body);
        callback();
    })
});

When('I retrieve my contactpoints', function(callback) {
    api.post(GET_CONSENT_LIST_URL, {}, headers)
        .then((response) => {
            responseBody = response.body;
            responseStatusCode = response.statusCode;
            console.log(responseStatusCode);
            callback();
        })
});

When('I delete all the mobile phones', function(callback) {
    api.post(GET_CONTACTPOINT_LIST_URL, {}, headers)
        .then((response) => {
            const phoneNumbers = response.body.value.mobilePhoneList;

            const promises = phoneNumbers.map(number =>
                api.post(DELETE_CONTACTPOINT_URL, {
                    "id": number.id
                }, headers)
            );
            Promise.all(promises).then(() => callback())
        })
});



Then('I see an error message', function(callback) {
    assert.isTrue(IncorrectContacpointBodyResponse.value != true);
    callback();
});


Then('I see {string} in the email list', function(expectedEmail, callback) {
    api.post(GET_CONTACTPOINT_LIST_URL, {}, headers)
        .then((response) => {
            const emails = response.body.value.eMailAddressList

            const filteredEmails = emails.filter(email => email.value == expectedEmail);

            assert.notEqual(filteredEmails.length, 0);
            callback();

        });
});


//TODO
Then('I see {string} in the phone number list with {string}', function(expectedPhoneNumber, expectedType, callback) {
    api.post(GET_CONTACTPOINT_LIST_URL, {}, headers)
        .then((response) => {
            //console.log(response.body);
            //console.log(response.body.value.mobilePhoneList);


            const phoneNumbers = response.body.value.mobilePhoneList;
            console.log('PHONENUMBERS');
            console.log(phoneNumbers);

            //We do the substring to remove the 0032 that the API adds
            // The substring on ExpectedPhone is to delete the "0" at the front. The API switches the 0 to 0032 during the insertion.
            const filteredNumbers = phoneNumbers.filter(phoneNumbers => phoneNumbers.value.substring(4) == expectedPhoneNumber.substring(1));
            console.log('FILTEREDNUMBERS');
            console.log(filteredNumbers);

            //     assert.isNotEmpty(filteredTypes);

            //    assert.isNotEmpty(filteredNumbers);
            callback();
        })
});

Then('status code is {string}', function(status, callback) {
    assert.equal(responseStatusCode, status);
    callback();
});

Then('I should not see any mobile phone in the list', function(callback) {
    api.post(GET_CONTACTPOINT_LIST_URL, {}, headers)
        .then((response) => {
            const phoneNumbers = response.body.value.mobilePhoneList;

            assert.isEmpty(phoneNumbers);

            callback();
        })
})