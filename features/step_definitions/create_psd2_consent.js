const { Given, When, Then } = require('cucumber');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const fs = require('fs')
const path = require('path')
const certFile = path.resolve('./', 'psd2Certif.pem')
const keyFile = path.resolve('./', 'psd2Certif.pem')
const request = require('request-promise');
const assert = require('chai').assert;

Given('I get the list of accounts of a user', () => {
    const options = {
        url: "https://i-net4018a-qa.be.fortis.bank:50990/PYIA-pa02/v1/filter-accounts/INFO",
        headers: {
            'mib_security_principal': '<?xml version="1.0" encoding="UTF-8"?><saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:xs="http://www.w3.org/2001/XMLSchema" ID="Assertion-uuidf6c2dc98-0135-1483-a8ec-954f33354b9c" IssueInstant="2020-03-09T14:10:21.865Z" Version="2.0"><saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">BNP Paribas Fortis</saml2:Issuer><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><ds:Reference URI="#Assertion-uuidf6c2dc98-0135-1483-a8ec-954f33354b9c"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"><ec:InclusiveNamespaces xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#" PrefixList="xs"/></ds:Transform></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><ds:DigestValue>gKGSMOuFHZLtxuQC2qIl7B26yF4=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>FZkRcWzEmIMQwv0EoMcEEehg2rlPpEmNWU1QGrWOo98jypeKrh2Y7sikbcovWL6WdPDAcK2eeMj02c6WlhQ7je5Oz2dc/QfnfN7souEt7UBYVo8ndA8qWOVX0a4J0IlV4K68QbUP4kGSqOAmtDXT++MytL8qIl6V2KOFCszAmXXg+nrriQpbz5k1NVuGBS7mnMX0x0hwfbQsTjd/21KrJQqqNbCnl57lqZwQ6qV03EWGNjcRBCF6Dy1+eL1vSRBo0WsQ0nz7T1HvlamVdTZ9Xrp9dH7fV4pL6xtLQfs9I2yrrcIEp+EqxlTBEGioyoYkbInJJJwms4Q6XQzHHenrqQ==</ds:SignatureValue><ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIIFDDCCAvSgAwIBAgICFPcwDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCQkUxGzAZBgNVBAoTEkJOUCBQYXJpYmFzIEZvcnRpczEMMAoGA1UECxMDT1NNMSowKAYDVQQDEyFCTlAgUGFyaWJhcyBGb3J0aXMgUFJPRCBTZXJ2ZXIgQ0EwHhcNMTgxMDI1MjIwMDAwWhcNMjMxMDI0MjE1OTU5WjCBjDELMAkGA1UEBhMCQkUxGzAZBgNVBAoTEkJOUCBQYXJpYmFzIEZvcnRpczEnMCUGA1UECxMeUGhvZW5peCBUcmFuc2FjdGlvbiBNYW5hZ2VtZW50MQ0wCwYDVQQLEwRPSEFMMSgwJgYDVQQDEx9QT1NUTUFOdG9PSEFMLXFhLmJlLmZvcnRpcy5iYW5rMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtVBAOyhQKD0tkCdJWncIw8SO3Bi3K7iXmuo+eDEqyjnK2UTFejx+Q+kMS9kErr0JgEDTE98eO8tYXDe4ifCF3fYQqEaSYxJt25CCPhj5YYPM8mdr/mZxoqSqM+DZiyMAHKqbawjWH4Am9x1+0NB7j5dGloKaXJTJc2B4rRBDVT2tvFWtd6t39MxxS/bbjDKKdyzt33+RAePHzohwpkGE0aNVqV0+x5WIBUPz/Y9zgihccqZ0oioXhRklF/ZDDcNieMZLguQVPmcXHuSx4icAsD2FmtvXHurAOWUBGeH8OXSo8KO41toN1EyBd7VS+ODfNiKmpt4EVLKvKfydL/BdmQIDAQABo4GeMIGbMCoGA1UdEQQjMCGCH1BPU1RNQU50b09IQUwtcWEuYmUuZm9ydGlzLmJhbmswDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAdBgNVHQ4EFgQUB0vvPBjLAMsqWOJApI9+5ZnIBQIwHwYDVR0jBBgwFoAU76q5ZMR/QclUXGQwZ3CmVhMKrTEwDQYJKoZIhvcNAQELBQADggIBABqJenFT7d8ygNO70EdXAwhR8BhTjgrRkHMFUB+5+i4Lh6NA5Vm5WEEVmdH2XbnWSAIfaKymUo/cyVSWo5kI8HhuWhSma8Me+r08dweWU4L6gVj/p/e1vckrXx3lzmUBzTswFrAUnFQGsW87rh5vDbnASoRctyp0ffrdf//4TYkYflI5+iU7nDCAsNI8rDSb0Rk6iBioxwBXyUhw/ax4aShSAQm9imaldyHjupxmVLT8/eNqmq64NiuJU9xJzy+1s3p6JMtbFHBTJPoS8GVI0iF7oNNSaFA0UEM0eQZwrzbFgQP339bEgt33txqhkqfuwvzu3e2xeITgmpN28Svl8cCszaPTNP4ODv9l2swvp6NO3zJxriWOq/RCl2ElzFbBR5P0EftAFCn/2ACHiO+QFnRD9KgdPNppFZap9ODhBet0uSP58wUpVDvEYKGDM+wex1FO/CXWHD0RZ98q+UsvUVONoLRCy+D0VsaUnszFahatBlbhjoKdf5ijIIri2oaLdFipuqvb3EQ/bToZDqjmMWTlMOS23gP8geOq1bMcw1mIDbVszLoD9RD/xqsKDRkNxmxrZ6UveBLKRjJRLK7pw8XpacdwbOHdB0sE3ne0heCCLz0lXzE5t+LfHvuUfnDRnD953sKyfgHyTu7lzx87v8hYWk7m8nccf30qN2SglW7p</ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature><saml2:Subject><saml2:NameID Format="urn:ibm:names:ITFIM:5.1:accessmanager">1234567890</saml2:NameID><saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><saml2:SubjectConfirmationData NotOnOrAfter="2030-03-26T11:00:00.000Z" Recipient="http://localhost"/></saml2:SubjectConfirmation></saml2:Subject><saml2:Conditions NotBefore="2020-03-09T14:10:21.864Z" NotOnOrAfter="2023-12-31T23:00:00.000Z"><saml2:AudienceRestriction><saml2:Audience>http://localhost</saml2:Audience></saml2:AudienceRestriction></saml2:Conditions><saml2:AuthnStatement AuthnInstant="2020-03-09T14:10:21.865Z" SessionIndex="uuidf6c2dc89-0135-16c7-a13a-954f33354b9c" SessionNotOnOrAfter="2023-12-31T23:00:00.000Z"><saml2:AuthnContext><saml2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:Password</saml2:AuthnContextClassRef></saml2:AuthnContext></saml2:AuthnStatement><saml2:AttributeStatement><saml2:Attribute Name="ip-address" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">194.7.114.2</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="oeMappedId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">PGxhc3QtbG9nb24tdGltZXN0YW1wPjIwMTMxMDIzMDk1MzI0PC9sYXN0LWxvZ29uLXRpbWVzdGFtcD48Y2FyZC1udW1iZXI-NjcwMzA0MTgwMDUxNzcwMDg8L2NhcmQtbnVtYmVyPjxwc3A-MjExNjkzODM8L3BzcD48cHNwLWxhbmd1YWdlPk5MPC9wc3AtbGFuZ3VhZ2U-PHBzcC1jb3VudHJ5PkJFPC9wc3AtY291bnRyeT48cGFuLXNuPjAyPC9wYW4tc24-PGNhcmQtc24-MDY8L2NhcmQtc24-PGRpZGEtdG9rZW4-bXVpZDwvZGlkYS10b2tlbj48ZGlkYS1jb2RlPm11aWQtY29kZTwvZGlkYS1jb2RlPjx1c2VyLXJvbGU-MDA8L3VzZXItcm9sZT4</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="authenticationMeanId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">08</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="userId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">E2084792</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="personId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">21169383</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="user-agent" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.6) Gecko/20100625 Firefox/3.6.6</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="dacLevel" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">5</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="distributorId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">71FB001</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="smid" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">1765502711</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="xLogId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">471bc72b1952488dc579483d179f18ed</saml2:AttributeValue></saml2:Attribute></saml2:AttributeStatement></saml2:Assertion>',
            'CSRF': 'r7mnFgzcVdATipJLSclf38aLI4VKJZb54Ozu2L74EPKftU9inyfUvIwMbreN33QIamUCfnaV8hyf12Jtun7sePeUrtxBvq1fo5O33diCuq5luBXTyuU13hH17zG94b1H',
            'Cookie': 'CSRF=r7mnFgzcVdATipJLSclf38aLI4VKJZb54Ozu2L74EPKftU9inyfUvIwMbreN33QIamUCfnaV8hyf12Jtun7sePeUrtxBvq1fo5O33diCuq5luBXTyuU13hH17zG94b1H',
            'Content-Type': 'application/json'
        },
        cert: fs.readFileSync(certFile),
        key: fs.readFileSync(keyFile),
        passphrase: 'oS1U5USKMJqMMH3flgQe'
    };

    request(options);
});

When('I create a psd2 consent', () => {
    const options = {
        method: 'POST',
        url: "https://i-net4018a-qa.be.fortis.bank:50990/PYIA-pa02/v1/authorizations/cbpi",
        headers: {
            'mib_security_principal': '<?xml version="1.0" encoding="UTF-8"?><saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:xs="http://www.w3.org/2001/XMLSchema" ID="Assertion-uuidf6c2dc98-0135-1483-a8ec-954f33354b9c" IssueInstant="2020-03-09T14:10:21.865Z" Version="2.0"><saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">BNP Paribas Fortis</saml2:Issuer><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><ds:Reference URI="#Assertion-uuidf6c2dc98-0135-1483-a8ec-954f33354b9c"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"><ec:InclusiveNamespaces xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#" PrefixList="xs"/></ds:Transform></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><ds:DigestValue>gKGSMOuFHZLtxuQC2qIl7B26yF4=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>FZkRcWzEmIMQwv0EoMcEEehg2rlPpEmNWU1QGrWOo98jypeKrh2Y7sikbcovWL6WdPDAcK2eeMj02c6WlhQ7je5Oz2dc/QfnfN7souEt7UBYVo8ndA8qWOVX0a4J0IlV4K68QbUP4kGSqOAmtDXT++MytL8qIl6V2KOFCszAmXXg+nrriQpbz5k1NVuGBS7mnMX0x0hwfbQsTjd/21KrJQqqNbCnl57lqZwQ6qV03EWGNjcRBCF6Dy1+eL1vSRBo0WsQ0nz7T1HvlamVdTZ9Xrp9dH7fV4pL6xtLQfs9I2yrrcIEp+EqxlTBEGioyoYkbInJJJwms4Q6XQzHHenrqQ==</ds:SignatureValue><ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIIFDDCCAvSgAwIBAgICFPcwDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCQkUxGzAZBgNVBAoTEkJOUCBQYXJpYmFzIEZvcnRpczEMMAoGA1UECxMDT1NNMSowKAYDVQQDEyFCTlAgUGFyaWJhcyBGb3J0aXMgUFJPRCBTZXJ2ZXIgQ0EwHhcNMTgxMDI1MjIwMDAwWhcNMjMxMDI0MjE1OTU5WjCBjDELMAkGA1UEBhMCQkUxGzAZBgNVBAoTEkJOUCBQYXJpYmFzIEZvcnRpczEnMCUGA1UECxMeUGhvZW5peCBUcmFuc2FjdGlvbiBNYW5hZ2VtZW50MQ0wCwYDVQQLEwRPSEFMMSgwJgYDVQQDEx9QT1NUTUFOdG9PSEFMLXFhLmJlLmZvcnRpcy5iYW5rMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtVBAOyhQKD0tkCdJWncIw8SO3Bi3K7iXmuo+eDEqyjnK2UTFejx+Q+kMS9kErr0JgEDTE98eO8tYXDe4ifCF3fYQqEaSYxJt25CCPhj5YYPM8mdr/mZxoqSqM+DZiyMAHKqbawjWH4Am9x1+0NB7j5dGloKaXJTJc2B4rRBDVT2tvFWtd6t39MxxS/bbjDKKdyzt33+RAePHzohwpkGE0aNVqV0+x5WIBUPz/Y9zgihccqZ0oioXhRklF/ZDDcNieMZLguQVPmcXHuSx4icAsD2FmtvXHurAOWUBGeH8OXSo8KO41toN1EyBd7VS+ODfNiKmpt4EVLKvKfydL/BdmQIDAQABo4GeMIGbMCoGA1UdEQQjMCGCH1BPU1RNQU50b09IQUwtcWEuYmUuZm9ydGlzLmJhbmswDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAdBgNVHQ4EFgQUB0vvPBjLAMsqWOJApI9+5ZnIBQIwHwYDVR0jBBgwFoAU76q5ZMR/QclUXGQwZ3CmVhMKrTEwDQYJKoZIhvcNAQELBQADggIBABqJenFT7d8ygNO70EdXAwhR8BhTjgrRkHMFUB+5+i4Lh6NA5Vm5WEEVmdH2XbnWSAIfaKymUo/cyVSWo5kI8HhuWhSma8Me+r08dweWU4L6gVj/p/e1vckrXx3lzmUBzTswFrAUnFQGsW87rh5vDbnASoRctyp0ffrdf//4TYkYflI5+iU7nDCAsNI8rDSb0Rk6iBioxwBXyUhw/ax4aShSAQm9imaldyHjupxmVLT8/eNqmq64NiuJU9xJzy+1s3p6JMtbFHBTJPoS8GVI0iF7oNNSaFA0UEM0eQZwrzbFgQP339bEgt33txqhkqfuwvzu3e2xeITgmpN28Svl8cCszaPTNP4ODv9l2swvp6NO3zJxriWOq/RCl2ElzFbBR5P0EftAFCn/2ACHiO+QFnRD9KgdPNppFZap9ODhBet0uSP58wUpVDvEYKGDM+wex1FO/CXWHD0RZ98q+UsvUVONoLRCy+D0VsaUnszFahatBlbhjoKdf5ijIIri2oaLdFipuqvb3EQ/bToZDqjmMWTlMOS23gP8geOq1bMcw1mIDbVszLoD9RD/xqsKDRkNxmxrZ6UveBLKRjJRLK7pw8XpacdwbOHdB0sE3ne0heCCLz0lXzE5t+LfHvuUfnDRnD953sKyfgHyTu7lzx87v8hYWk7m8nccf30qN2SglW7p</ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature><saml2:Subject><saml2:NameID Format="urn:ibm:names:ITFIM:5.1:accessmanager">1234567890</saml2:NameID><saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><saml2:SubjectConfirmationData NotOnOrAfter="2030-03-26T11:00:00.000Z" Recipient="http://localhost"/></saml2:SubjectConfirmation></saml2:Subject><saml2:Conditions NotBefore="2020-03-09T14:10:21.864Z" NotOnOrAfter="2023-12-31T23:00:00.000Z"><saml2:AudienceRestriction><saml2:Audience>http://localhost</saml2:Audience></saml2:AudienceRestriction></saml2:Conditions><saml2:AuthnStatement AuthnInstant="2020-03-09T14:10:21.865Z" SessionIndex="uuidf6c2dc89-0135-16c7-a13a-954f33354b9c" SessionNotOnOrAfter="2023-12-31T23:00:00.000Z"><saml2:AuthnContext><saml2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:Password</saml2:AuthnContextClassRef></saml2:AuthnContext></saml2:AuthnStatement><saml2:AttributeStatement><saml2:Attribute Name="ip-address" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">194.7.114.2</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="oeMappedId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">PGxhc3QtbG9nb24tdGltZXN0YW1wPjIwMTMxMDIzMDk1MzI0PC9sYXN0LWxvZ29uLXRpbWVzdGFtcD48Y2FyZC1udW1iZXI-NjcwMzA0MTgwMDUxNzcwMDg8L2NhcmQtbnVtYmVyPjxwc3A-MjExNjkzODM8L3BzcD48cHNwLWxhbmd1YWdlPk5MPC9wc3AtbGFuZ3VhZ2U-PHBzcC1jb3VudHJ5PkJFPC9wc3AtY291bnRyeT48cGFuLXNuPjAyPC9wYW4tc24-PGNhcmQtc24-MDY8L2NhcmQtc24-PGRpZGEtdG9rZW4-bXVpZDwvZGlkYS10b2tlbj48ZGlkYS1jb2RlPm11aWQtY29kZTwvZGlkYS1jb2RlPjx1c2VyLXJvbGU-MDA8L3VzZXItcm9sZT4</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="authenticationMeanId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">08</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="userId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">E2084792</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="personId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">21169383</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="user-agent" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.6) Gecko/20100625 Firefox/3.6.6</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="dacLevel" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">5</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="distributorId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">71FB001</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="smid" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">1765502711</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="xLogId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">471bc72b1952488dc579483d179f18ed</saml2:AttributeValue></saml2:Attribute></saml2:AttributeStatement></saml2:Assertion>',
            'CSRF': 'r7mnFgzcVdATipJLSclf38aLI4VKJZb54Ozu2L74EPKftU9inyfUvIwMbreN33QIamUCfnaV8hyf12Jtun7sePeUrtxBvq1fo5O33diCuq5luBXTyuU13hH17zG94b1H',
            'Cookie': 'CSRF=r7mnFgzcVdATipJLSclf38aLI4VKJZb54Ozu2L74EPKftU9inyfUvIwMbreN33QIamUCfnaV8hyf12Jtun7sePeUrtxBvq1fo5O33diCuq5luBXTyuU13hH17zG94b1H',
            'Content-Type': 'application/json'
        },
        cert: fs.readFileSync(certFile),
        key: fs.readFileSync(keyFile),
        passphrase: 'oS1U5USKMJqMMH3flgQe',
        body: {
            "clientId":"k4QztmnS20",
            "purposeAndAttributeValues":[  
                {  
                    "purposeValue":"BE62001653031661",
                    "listOfAttributes":[  
                        {  
                        "attributeName":"CURRENCY",
                        "attributeValue":"EUR"
                        }
                    ]
                },
                {  
                    "purposeValue":"BE77001743268842",
                    "listOfAttributes":[  
                        {  
                        "attributeName":"CURRENCY",
                        "attributeValue":"EUR"
                        }
                    ]
                },
                {  
                    "purposeValue":"BE91001835975176",
                    "listOfAttributes":[  
                        {  
                        "attributeName":"CURRENCY",
                        "attributeValue":"EUR"
                        }
                    ]
                },
                {  
                    "purposeValue":"BE36001806128781",
                    "listOfAttributes":[  
                        {  
                        "attributeName":"CURRENCY",
                        "attributeValue":"EUR"
                        }
                    ]
                }
            ]
        },
        json: true
    };

    request(options)
    .catch(function (err) {
    });
});

Then('The psd2 consent is created', () => {
    // OK
});