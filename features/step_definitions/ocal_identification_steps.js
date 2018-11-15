const { When, Then } = require('cucumber');

var assert = require('chai').assert;

/*############################################## Update prospect with ID card info ##############################################*/

When('I try to update prospect with generated random id card data', function () {
    // console.log(global.postData.id)
    var request = {
        url: "https://i-net1938a-test.be.fortis.bank:51088/OCAL-ap55-war/api/scan-id/identifications",
        body: {
            identificationprocess: {
                result: "SUCCESS",
                companyid: "fortispoc",
                filename: "b9de0329-d1ef-457e-8b63-64b647a2a2a4.zip",
                identificationtime: "2018-10-29T16:03:49+01:00",
                id: "TS3-CJRXN",
                href: "/api/v1/fortispoc/identifications/b9de0329-d1ef-457e-8b63-64b647a2a2a4.zip",
                type: "APP",
                transactionnumber: global.postData.id
            },
            customdata: {
                custom3: null,
                custom4: null,
                custom1: null,
                custom2: null,
                custom5: null
            },
            contactdata: {
                mobilephone: null,  
                email: null
            },
            userdata: {
                birthday: {
                    status: "NEW",
                    value: "1990-11-18"
                },
                firstname: {
                    status: "NEW",
                    value: "ALEXANDRE"
                },
                address: {
                    zipcode: {
                        status: "NEW",
                        value: "56100"
                    },
                    country: {
                        status: "NEW",
                        value: "FR"
                    },
                    city: {
                        status: "NEW",
                        value: "LORIENT"
                    },
                    street: {
                        status: "NEW",
                        value: "RUE ADOLPHE RONDEAUX"
                    },
                    streetnumber: {
                        status: "NEW",
                        value: "18"
                    }
                },
                birthplace: {
                    status: "NEW",
                    value: "LORIENT"
                },
                nationality: {
                    status: "NEW",
                    value: "FR"
                },
                lastname: {
                    status: "NEW",
                    value: "MAZURE"
                }
            },
            identificationdocument: {
                country: {
                    status: "NEW",
                    value: "FR"
                },
                number: {
                    status: "NEW",
                    value: "120656101292"
                },
                issuedby: {
                    status: "NEW",
                    value: "SOUS-PREFECTURE DE LORIENT (56)"
                },
                dateissued: {
                    status: "NEW",
                    value: "2012-06-12"
                },
                type: {
                    status: "NEW",
                    value: "IDCARD"
                },
                validuntil: {
                    status: "NEW",
                    value: "2022-06-11"
                }
            },
            attachments: {
                pdf: "b9de0329-d1ef-457e-8b63-64b647a2a2a4.pdf",
                xml: "b9de0329-d1ef-457e-8b63-64b647a2a2a4.xml",
                idbackside: "b9de0329-d1ef-457e-8b63-64b647a2a2a4_idbackside.jpg",
                idfrontside: "b9de0329-d1ef-457e-8b63-64b647a2a2a4_idfrontside.jpg",
                userface: "b9de0329-d1ef-457e-8b63-64b647a2a2a4_userface.jpg",
                livenessleft: "b9de0329-d1ef-457e-8b63-64b647a2a2a4_liveness_left.jpg",
                livenessright: "b9de0329-d1ef-457e-8b63-64b647a2a2a4_liveness_right.jpg"
            }
        },
        method:'POST',
        json: true,
        resolveWithFullResponse: true,
        simple: false
    }
    // console.log(request)
    return request;
});

/*############################################## Verify prospect updated with ID card ##############################################*/

Then('My prospect is updated with ID card information', function () {
    return 'pending';
});            