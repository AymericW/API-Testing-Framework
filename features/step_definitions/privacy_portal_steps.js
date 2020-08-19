const { Given, When, Then } = require("cucumber");
const assert = require('chai').assert;
const api = require('../../util/api');
const login = require('../../util/login');
const fs = require('fs');
const pdf = require('pdf-parse');
const parse = require('csv-parse');



//Login variables
const csrf = '2e9312a346129e623ca0c830b874fcd3e25a8a0c1919f2d03414b7a13c5d9e65f447255cb9b2b69d485e13066c14cd0cf9e8bd8777be028ae468ffece305bef5627ce76f8d4c68d6a70880eae33b41e6407ab1c14f48830e50369b607042bfc8c9d0a6c601606b81545f3cb1c32818338924b4c1c9c8a27e87bba7140555fca2';
const headers = {
    'CSRF': csrf,
    'Cookie': 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    'Content-Type': 'application/json',
    //'Host': 'p1.secure.qahellobank.be',
    //'Origin': 'https://p1.secure.qahellobank.be'
};


//URLS
const EASYBANKING_URL = 'https://p1.easybanking.qabnpparibasfortis.be';
const OCPL_PR01 = EASYBANKING_URL + '/OCPL-pr01';

const REQUEST_DSAR = OCPL_PR01 + "/rpc/dsarDocument";
const STATUS_DSAR_REQUEST = OCPL_PR01 + "/rpc/dsarDocument/status";
const RETRIEVE_DSAR_DOCUMENT = OCPL_PR01 + "/rpc/dsarDocument";


When("I download the pdf of my information", (callback) => {
    api.post(REQUEST_DSAR,
        {
            "format": "pdf"
        }, headers)
        .then(() => {
            api.get(STATUS_DSAR_REQUEST, headers)
                .then((response) => {
                    console.log(response.body);
                    api.getPdf(RETRIEVE_DSAR_DOCUMENT, headers)
                        .then((response) => {
                            let writeStream = fs.createWriteStream('privacy_portal_fortis.pdf');
                            writeStream.write(response.body, 'binary');
                            writeStream.on('finish', () => {
                                console.log('wrote all data to file');
                            });
                            writeStream.end();
                            callback();
                        })

                })
        })
});


When("I download the csv of my information", (callback) => {
    api.post(REQUEST_DSAR,
        {
            "format": "csv"
        }, headers)
        .then((response) => {
            api.get(STATUS_DSAR_REQUEST, headers)
                .then((response) => {
                    console.log(response.body);
                    api.getPdf(RETRIEVE_DSAR_DOCUMENT, headers)
                        .then((response) => {
                            let writeStream = fs.createWriteStream('privacy_portal_fortis.csv');
                            writeStream.write(response.body, 'binary');
                            writeStream.on('finish', () => {
                                console.log('wrote all data to file');
                            });
                            writeStream.end();
                            callback();
                        })

                })
        })
})


Then("I can view my information on the pdf", (callback) => {
    let dataBuffer = fs.readFileSync('./privacy_portal_fortis.pdf');

    pdf(dataBuffer).then(function (data) {

        // number of pages
        console.log(data.numpages);

        console.log("PDF TEXT: ");
        // PDF text
        console.log(data.text);

        assert.include(data.text, "1453637078", "PDF contains SMID");

        callback();
    });
});

Then("I can view my information on the CSV", (callback) => {
    const output = [];
    let dataBuffer = fs.readFileSync('./privacy_portal_fortis.csv');

    parse(dataBuffer)
        .on('readable', function () {
            let record;
            while (record = this.read()) {
                output.push(record);
            }
        })
        .on('end', function () {
            assert.include(output, "1453637078");
        });

    callback();
});
