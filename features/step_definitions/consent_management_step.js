const { Given, When, Then } = require("cucumber");
const assert = require('chai').assert;
const api = require('../../util/api');
const login = require('../../util/login');

//Login variables
const csrf = '2e9312a346129e623ca0c830b874fcd3e25a8a0c1919f2d03414b7a13c5d9e65f447255cb9b2b69d485e13066c14cd0cf9e8bd8777be028ae468ffece305bef5627ce76f8d4c68d6a70880eae33b41e6407ab1c14f48830e50369b607042bfc8c9d0a6c601606b81545f3cb1c32818338924b4c1c9c8a27e87bba7140555fca2';
const headers = {
    'CSRF': csrf,
    'Cookie': 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    'Content-Type': 'application/json'
}

//URLS
const EASYBANKING_URL = 'https://p1.easybanking.qabnpparibasfortis.be';
const OCPL_PR01 = EASYBANKING_URL + '/OCPL-pr01';

//ContactPointURLS
const GET_CONTACTPOINT_LIST_URL = OCPL_PR01 + '/rpc/consentData/getContactPointList';
const DELETE_CONTACTPOINT_URL = OCPL_PR01 + '/rpc/consentData/deleteContactPoint';
const INSERT_CONCTACTPOINT_URL = OCPL_PR01 + '/rpc/consentData/insertContactPoint';
const MODIFY_CONTACTPOINT_URL = OCPL_PR01 + '/rpc/consentData/modifyContactPoint';

//ConsentURLS
const GET_CONSENT_LIST_URL = OCPL_PR01 + '/rpc/consentManagement/getConsentList';
const MODIFY_CONSENT_LIST_URL = OCPL_PR01 + '/rpc/consentManagement/modifyConsentList';



Given('I reset my emails to none', (callback) => {
    api.post(GET_CONTACTPOINT_LIST_URL, {}, headers)
        .then((response) => {
            const emails = response.body.value.eMailAddressList;
            const emailPromises = emails.map(email =>
                api.post(DELETE_CONTACTPOINT_URL, {
                    "id": email.id
                }, headers)
            );
            Promise.all(emailPromises).then(() => callback())
        })
})


Given('I reset my phone numbers to none', (callback) => {
    api.post(GET_CONTACTPOINT_LIST_URL, {}, headers)
        .then((response) => {
            const phoneNumbers = response.body.value.mobilePhoneList;

            const phonePromises = phoneNumbers.map(number =>
                api.post(DELETE_CONTACTPOINT_URL, {
                    "id": number.id
                }, headers)
            );
            Promise.all(phonePromises).then(() => callback())
        })
})

Given('I check I have at least one contact point for each type {string} {string} {string}', (email, gsm, phone, callback) => {
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
        "type": "02",
        "value": phone
    }, headers).then(() => {
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
            "type": "06",
            "value": gsm
        }, headers).then(() => {
            api.post(INSERT_CONCTACTPOINT_URL, {
                "consents": [{
                    "value": "IN",
                }],
                "type": "03",
                "value": email,
            }, headers).then(() => {
                callback();
            })
        })
    })
})

Given('My general consent is optout', (callback) => {
    //TODO
    api.post(GET_CONSENT_LIST_URL, {}, headers)
        .then((response) => {
            console.log(response.body);
            const consentId = response.body.value.dataConsent.consentId;
            if (response.body.value.dataConsent.consent == "IN"){
            api.post(MODIFY_CONSENT_LIST_URL, {
                    "consents": [{ "consent": "OU", "consentId": consentId }]
                }, headers)
                .then(() => callback())
            }
            else {
                console.log("Consent is already " + response.body.value.dataConsent.consent);
                callback();
            }
        })

})

Given('My general consent is optin', (callback) => {
    //TODO
    api.post(GET_CONSENT_LIST_URL, {}, headers)
        .then((response) => {
            console.log(response.body);
            const consentId = response.body.value.dataConsent.consentId;
            if (response.body.value.dataConsent.consent == "OU"){
                api.post(MODIFY_CONSENT_LIST_URL, {
                    "consents": [{ "consent": "IN", "consentId": consentId }]
                }, headers)
                    .then(() => callback())
            }
            else {
                console.log("Consent is already " + response.body.value.dataConsent.consent);
                callback();
            }
        })

});


Given('All my consents are on NC', (callback) => {
    api.post(GET_CONSENT_LIST_URL, {}, headers)
        .then((response) => {
            const consentId = response.body.value.dataConsent.consentId;
            if (response.body.value.dataConsent.consent == "OU"){
                api.post(MODIFY_CONSENT_LIST_URL, {
                    "consents": [{ "consent": "IN", "consentId": consentId }]
                }, headers)
                    .then(() => callback())
            }
            else {
                api.post(MODIFY_CONSENT_LIST_URL, {
                    "consents": [{ "consent": "OU", "consentId": consentId }]
                }, headers)
                    .then(() => {
                        api.post(GET_CONSENT_LIST_URL, {}, headers)
                            .then((response) => {
                                const consentID2 = response.body.value.dataConsent.consentId;
                                api.post(MODIFY_CONSENT_LIST_URL, {
                                    "consents": [{ "consent": "IN", "consentId": consentID2 }]
                                }, headers)
                                    .then(() => callback())
                            })
                    })
                callback();
            }

        })
})

When('I change my general consent to optin', (callback) => {
    api.post(GET_CONSENT_LIST_URL, {}, headers)
        .then((response) => {
            const consentState = response.body.value.dataConsent.consent;
            const consentId = response.body.value.dataConsent.consentId;
            console.log(consentState);

            api.post(MODIFY_CONSENT_LIST_URL, {
                "consents": [{ "consent": "IN", "consentId": consentId }]
            }, headers)
                .then((response) => {
                    console.log(response.body);
                    console.log("Consent updates");
                    callback();
                })
        })
})


When('I change my general consent to optout', (callback) => {
    api.post(GET_CONSENT_LIST_URL, {}, headers)
        .then((response) => {
            const consentState = response.body.value.dataConsent.consent;
            const consentId = response.body.value.dataConsent.consentId;
            console.log(consentState);

            api.post(MODIFY_CONSENT_LIST_URL, {
                "consents": [{ "consent": "OU", "consentId": consentId }]
            }, headers)
                .then((response) => {
                    console.log(response.body);
                    console.log("Consent updates");
                    callback();
                })
        })
})

When('I give consent to the email contact point', (callback) => {
    api.post(GET_CONSENT_LIST_URL, {}, headers)
        .then((response) => {
            const consentId = response.body.value.emailAddressList[0].consentId

            api.post(MODIFY_CONSENT_LIST_URL, {
                "consents": [{ "consent": "IN", "consentId": consentId }]
            }, headers)
                .then((response) => {
                    console.log(response.body);
                    callback();
                })

        })
})


Then('All my consents are set to {string}', (state, callback) => {
    api.post(GET_CONSENT_LIST_URL, {}, headers)
        .then((response) => {
            assert.equal(response.body.value.emailAddressList[0].consent, state);
            callback();
        })
});

Then('there is an error', (callback) => {
    //OK
    callback();
});

Then('The consent of the selected contact point is set to {string}', (state, callback) => {
    api.post(GET_CONSENT_LIST_URL, {}, headers)
        .then((response) => {
            assert.equal(response.body.value.emailAddressList[0].consent, state);
            callback();
        })
})


