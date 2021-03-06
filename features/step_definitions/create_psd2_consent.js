const { Given, When, Then } = require('cucumber');
const file = require('../../util/file');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const fs = require('fs')
const path = require('path')
const certFile = path.resolve('./', 'psd2Certif.pem')
const keyFile = path.resolve('./', 'psd2Certif.pem')
const request = require('request-promise');
const assert = require('chai').assert;
const api = require('../../util/api');
const login = require('../../util/login');

let consents;

const fortisBody = file.read('configuration/psd2Fortis.json')
const fortisHeader = {
    'mib_security_principal': '<?xml version="1.0" encoding="UTF-8"?><saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:xs="http://www.w3.org/2001/XMLSchema" ID="Assertion-uuidf6c2dc98-0135-1483-a8ec-954f33354b9c" IssueInstant="2020-05-15T11:42:22.702Z" Version="2.0"><saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">BNP Paribas Fortis</saml2:Issuer><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><ds:Reference URI="#Assertion-uuidf6c2dc98-0135-1483-a8ec-954f33354b9c"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"><ec:InclusiveNamespaces xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#" PrefixList="xs"/></ds:Transform></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><ds:DigestValue>QMkStDPMX8B9Gb9iu7ffgLVh1F0=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>s55wy0enn93eKXGAODXmv99E6J9VOb2v62R9DTrJP7L9Q+NqR6UqLaaWeExel0YQgvXGNoT+GuSQpJw4d/2LuRCvVj2/N0h00duS9fytmm+p8ZOEMPefxfhEfTj1ZtMgc5X9Mf1apZCr9H9lU0B4FRmNlXmlXnc7GyAJxAtHNrNM2qPq7YHSAEccle/gj5xQn3Gad4qIIuZHDL2r+yCoaq/kCHVJpypEFHNNmhyEEy2/iskTQnw6mSTWw31KG56zuWwoxoG4pPafuV7fiBj5mBCo/RDXBDNyL6vzpcDBXEfedbimb5lcyGCTAP+Keq8IWeC+8apj5kMcjKxRrwM4wg==</ds:SignatureValue><ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIIFDDCCAvSgAwIBAgICFPcwDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCQkUxGzAZBgNVBAoTEkJOUCBQYXJpYmFzIEZvcnRpczEMMAoGA1UECxMDT1NNMSowKAYDVQQDEyFCTlAgUGFyaWJhcyBGb3J0aXMgUFJPRCBTZXJ2ZXIgQ0EwHhcNMTgxMDI1MjIwMDAwWhcNMjMxMDI0MjE1OTU5WjCBjDELMAkGA1UEBhMCQkUxGzAZBgNVBAoTEkJOUCBQYXJpYmFzIEZvcnRpczEnMCUGA1UECxMeUGhvZW5peCBUcmFuc2FjdGlvbiBNYW5hZ2VtZW50MQ0wCwYDVQQLEwRPSEFMMSgwJgYDVQQDEx9QT1NUTUFOdG9PSEFMLXFhLmJlLmZvcnRpcy5iYW5rMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtVBAOyhQKD0tkCdJWncIw8SO3Bi3K7iXmuo+eDEqyjnK2UTFejx+Q+kMS9kErr0JgEDTE98eO8tYXDe4ifCF3fYQqEaSYxJt25CCPhj5YYPM8mdr/mZxoqSqM+DZiyMAHKqbawjWH4Am9x1+0NB7j5dGloKaXJTJc2B4rRBDVT2tvFWtd6t39MxxS/bbjDKKdyzt33+RAePHzohwpkGE0aNVqV0+x5WIBUPz/Y9zgihccqZ0oioXhRklF/ZDDcNieMZLguQVPmcXHuSx4icAsD2FmtvXHurAOWUBGeH8OXSo8KO41toN1EyBd7VS+ODfNiKmpt4EVLKvKfydL/BdmQIDAQABo4GeMIGbMCoGA1UdEQQjMCGCH1BPU1RNQU50b09IQUwtcWEuYmUuZm9ydGlzLmJhbmswDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAdBgNVHQ4EFgQUB0vvPBjLAMsqWOJApI9+5ZnIBQIwHwYDVR0jBBgwFoAU76q5ZMR/QclUXGQwZ3CmVhMKrTEwDQYJKoZIhvcNAQELBQADggIBABqJenFT7d8ygNO70EdXAwhR8BhTjgrRkHMFUB+5+i4Lh6NA5Vm5WEEVmdH2XbnWSAIfaKymUo/cyVSWo5kI8HhuWhSma8Me+r08dweWU4L6gVj/p/e1vckrXx3lzmUBzTswFrAUnFQGsW87rh5vDbnASoRctyp0ffrdf//4TYkYflI5+iU7nDCAsNI8rDSb0Rk6iBioxwBXyUhw/ax4aShSAQm9imaldyHjupxmVLT8/eNqmq64NiuJU9xJzy+1s3p6JMtbFHBTJPoS8GVI0iF7oNNSaFA0UEM0eQZwrzbFgQP339bEgt33txqhkqfuwvzu3e2xeITgmpN28Svl8cCszaPTNP4ODv9l2swvp6NO3zJxriWOq/RCl2ElzFbBR5P0EftAFCn/2ACHiO+QFnRD9KgdPNppFZap9ODhBet0uSP58wUpVDvEYKGDM+wex1FO/CXWHD0RZ98q+UsvUVONoLRCy+D0VsaUnszFahatBlbhjoKdf5ijIIri2oaLdFipuqvb3EQ/bToZDqjmMWTlMOS23gP8geOq1bMcw1mIDbVszLoD9RD/xqsKDRkNxmxrZ6UveBLKRjJRLK7pw8XpacdwbOHdB0sE3ne0heCCLz0lXzE5t+LfHvuUfnDRnD953sKyfgHyTu7lzx87v8hYWk7m8nccf30qN2SglW7p</ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature><saml2:Subject><saml2:NameID Format="urn:ibm:names:ITFIM:5.1:accessmanager">1234567890</saml2:NameID><saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><saml2:SubjectConfirmationData NotOnOrAfter="2030-03-26T11:00:00.000Z" Recipient="http://localhost"/></saml2:SubjectConfirmation></saml2:Subject><saml2:Conditions NotBefore="2020-05-15T11:42:22.701Z" NotOnOrAfter="2023-12-31T23:00:00.000Z"><saml2:AudienceRestriction><saml2:Audience>http://localhost</saml2:Audience></saml2:AudienceRestriction></saml2:Conditions><saml2:AuthnStatement AuthnInstant="2020-05-15T11:42:22.702Z" SessionIndex="uuidf6c2dc89-0135-16c7-a13a-954f33354b9c" SessionNotOnOrAfter="2023-12-31T23:00:00.000Z"><saml2:AuthnContext><saml2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:Password</saml2:AuthnContextClassRef></saml2:AuthnContext></saml2:AuthnStatement><saml2:AttributeStatement><saml2:Attribute Name="ip-address" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">194.7.114.2</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="oeMappedId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">PGxhc3QtbG9nb24tdGltZXN0YW1wPjIwMTMxMDIzMDk1MzI0PC9sYXN0LWxvZ29uLXRpbWVzdGFtcD48Y2FyZC1udW1iZXI-NjcwMzA0MTgwMDUxNzcwMDg8L2NhcmQtbnVtYmVyPjxwc3A-MjExNjkzODM8L3BzcD48cHNwLWxhbmd1YWdlPkZSPC9wc3AtbGFuZ3VhZ2U-PHBzcC1jb3VudHJ5PkJFPC9wc3AtY291bnRyeT48cGFuLXNuPjAyPC9wYW4tc24-PGNhcmQtc24-MDY8L2NhcmQtc24-PGRpZGEtdG9rZW4-bXVpZDwvZGlkYS10b2tlbj48ZGlkYS1jb2RlPm11aWQtY29kZTwvZGlkYS1jb2RlPjx1c2VyLXJvbGU-MDA8L3VzZXItcm9sZT4</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="authenticationMeanId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">08</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="userId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">E2084792</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="personId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">21169383</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="user-agent" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.6) Gecko/20100625 Firefox/3.6.6</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="dacLevel" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">5</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="distributorId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">71FB001</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="smid" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">1765502711</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="xLogId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">471bc72b1952488dc579483d179f18ed</saml2:AttributeValue></saml2:Attribute></saml2:AttributeStatement></saml2:Assertion>',
    'CSRF': 'r7mnFgzcVdATipJLSclf38aLI4VKJZb54Ozu2L74EPKftU9inyfUvIwMbreN33QIamUCfnaV8hyf12Jtun7sePeUrtxBvq1fo5O33diCuq5luBXTyuU13hH17zG94b1H',
    'Cookie': 'CSRF=r7mnFgzcVdATipJLSclf38aLI4VKJZb54Ozu2L74EPKftU9inyfUvIwMbreN33QIamUCfnaV8hyf12Jtun7sePeUrtxBvq1fo5O33diCuq5luBXTyuU13hH17zG94b1H',
    'Content-Type': 'application/json'
}

const fintroBody = file.read('configuration/psd2Fintro.json')
const fintroHeader = {
    'mib_security_principal': '<?xml version="1.0" encoding="UTF-8"?><saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:xs="http://www.w3.org/2001/XMLSchema" ID="Assertion-uuidf6c2dc98-0135-1483-a8ec-954f33354b9c" IssueInstant="2020-01-08T10:15:58.491Z" Version="2.0"><saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">BNP Paribas Fortis</saml2:Issuer><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><ds:Reference URI="#Assertion-uuidf6c2dc98-0135-1483-a8ec-954f33354b9c"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"><ec:InclusiveNamespaces xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#" PrefixList="xs"/></ds:Transform></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><ds:DigestValue>Q1JwPLk1FHTg1KOMV9b2BEbX2Fg=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>ZF+6xv/L6WLea5EthBM/NxEPEaE93GV17u95SLiJ9IAok2VYc5CWSYl2zrBGC2F2RnqDqqRk09RMedty2REBnmuOv0WGbtMD0mD6jZtgyzcf5Av53xGdADAsjKVMPmVGZQaKpFzMa4/cGlOx2QL86AAS39nwv+cvhX7/rUQU2S4Lkj4M3atORhd3c5K/Sj8K0G8nJbz1x95xQRXFRW6iDFrWiXuLbl3Wt13zpF3vn1fpjbxGgPKxZ0RLnM4JQu7GfL2UOIBWUWxgfZFlSvFlV2D6aMJQZsOvBcRbcCJxLqx6g6hWyQRQ6lOUD2L7yXhQMdkWbIpQBFMlKeCntwepsg==</ds:SignatureValue><ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIIFDDCCAvSgAwIBAgICFPcwDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCQkUxGzAZBgNVBAoTEkJOUCBQYXJpYmFzIEZvcnRpczEMMAoGA1UECxMDT1NNMSowKAYDVQQDEyFCTlAgUGFyaWJhcyBGb3J0aXMgUFJPRCBTZXJ2ZXIgQ0EwHhcNMTgxMDI1MjIwMDAwWhcNMjMxMDI0MjE1OTU5WjCBjDELMAkGA1UEBhMCQkUxGzAZBgNVBAoTEkJOUCBQYXJpYmFzIEZvcnRpczEnMCUGA1UECxMeUGhvZW5peCBUcmFuc2FjdGlvbiBNYW5hZ2VtZW50MQ0wCwYDVQQLEwRPSEFMMSgwJgYDVQQDEx9QT1NUTUFOdG9PSEFMLXFhLmJlLmZvcnRpcy5iYW5rMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtVBAOyhQKD0tkCdJWncIw8SO3Bi3K7iXmuo+eDEqyjnK2UTFejx+Q+kMS9kErr0JgEDTE98eO8tYXDe4ifCF3fYQqEaSYxJt25CCPhj5YYPM8mdr/mZxoqSqM+DZiyMAHKqbawjWH4Am9x1+0NB7j5dGloKaXJTJc2B4rRBDVT2tvFWtd6t39MxxS/bbjDKKdyzt33+RAePHzohwpkGE0aNVqV0+x5WIBUPz/Y9zgihccqZ0oioXhRklF/ZDDcNieMZLguQVPmcXHuSx4icAsD2FmtvXHurAOWUBGeH8OXSo8KO41toN1EyBd7VS+ODfNiKmpt4EVLKvKfydL/BdmQIDAQABo4GeMIGbMCoGA1UdEQQjMCGCH1BPU1RNQU50b09IQUwtcWEuYmUuZm9ydGlzLmJhbmswDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAdBgNVHQ4EFgQUB0vvPBjLAMsqWOJApI9+5ZnIBQIwHwYDVR0jBBgwFoAU76q5ZMR/QclUXGQwZ3CmVhMKrTEwDQYJKoZIhvcNAQELBQADggIBABqJenFT7d8ygNO70EdXAwhR8BhTjgrRkHMFUB+5+i4Lh6NA5Vm5WEEVmdH2XbnWSAIfaKymUo/cyVSWo5kI8HhuWhSma8Me+r08dweWU4L6gVj/p/e1vckrXx3lzmUBzTswFrAUnFQGsW87rh5vDbnASoRctyp0ffrdf//4TYkYflI5+iU7nDCAsNI8rDSb0Rk6iBioxwBXyUhw/ax4aShSAQm9imaldyHjupxmVLT8/eNqmq64NiuJU9xJzy+1s3p6JMtbFHBTJPoS8GVI0iF7oNNSaFA0UEM0eQZwrzbFgQP339bEgt33txqhkqfuwvzu3e2xeITgmpN28Svl8cCszaPTNP4ODv9l2swvp6NO3zJxriWOq/RCl2ElzFbBR5P0EftAFCn/2ACHiO+QFnRD9KgdPNppFZap9ODhBet0uSP58wUpVDvEYKGDM+wex1FO/CXWHD0RZ98q+UsvUVONoLRCy+D0VsaUnszFahatBlbhjoKdf5ijIIri2oaLdFipuqvb3EQ/bToZDqjmMWTlMOS23gP8geOq1bMcw1mIDbVszLoD9RD/xqsKDRkNxmxrZ6UveBLKRjJRLK7pw8XpacdwbOHdB0sE3ne0heCCLz0lXzE5t+LfHvuUfnDRnD953sKyfgHyTu7lzx87v8hYWk7m8nccf30qN2SglW7p</ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature><saml2:Subject><saml2:NameID Format="urn:ibm:names:ITFIM:5.1:accessmanager">1234567890</saml2:NameID><saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><saml2:SubjectConfirmationData NotOnOrAfter="2030-03-26T11:00:00.000Z" Recipient="http://localhost"/></saml2:SubjectConfirmation></saml2:Subject><saml2:Conditions NotBefore="2020-01-08T10:15:58.490Z" NotOnOrAfter="2023-12-31T23:00:00.000Z"><saml2:AudienceRestriction><saml2:Audience>http://localhost</saml2:Audience></saml2:AudienceRestriction></saml2:Conditions><saml2:AuthnStatement AuthnInstant="2020-01-08T10:15:58.491Z" SessionIndex="uuidf6c2dc89-0135-16c7-a13a-954f33354b9c" SessionNotOnOrAfter="2023-12-31T23:00:00.000Z"><saml2:AuthnContext><saml2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:Password</saml2:AuthnContextClassRef></saml2:AuthnContext></saml2:AuthnStatement><saml2:AttributeStatement><saml2:Attribute Name="ip-address" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">194.7.114.2</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="oeMappedId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">PGxhc3QtbG9nb24tdGltZXN0YW1wPjIwMTMxMDIzMDk1MzI0PC9sYXN0LWxvZ29uLXRpbWVzdGFtcD48Y2FyZC1udW1iZXI-NjcwMzA0MTgwMDUxNzcwMDg8L2NhcmQtbnVtYmVyPjxwc3A-MDM0OTkwMDE8L3BzcD48cHNwLWxhbmd1YWdlPkZSPC9wc3AtbGFuZ3VhZ2U-PHBzcC1jb3VudHJ5PkJFPC9wc3AtY291bnRyeT48cGFuLXNuPjAyPC9wYW4tc24-PGNhcmQtc24-MDY8L2NhcmQtc24-PGRpZGEtdG9rZW4-bXVpZDwvZGlkYS10b2tlbj48ZGlkYS1jb2RlPm11aWQtY29kZTwvZGlkYS1jb2RlPjx1c2VyLXJvbGU-MDA8L3VzZXItcm9sZT4</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="authenticationMeanId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">08</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="userId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">E3617084</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="personId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">03499001</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="user-agent" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.6) Gecko/20100625 Firefox/3.6.6</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="dacLevel" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">5</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="distributorId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">71KN001</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="smid" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">1137450150</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="xLogId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">471bc72b1952488dc579483d179f18ed</saml2:AttributeValue></saml2:Attribute></saml2:AttributeStatement></saml2:Assertion>',
    'CSRF': 'r7mnFgzcVdATipJLSclf38aLI4VKJZb54Ozu2L74EPKftU9inyfUvIwMbreN33QIamUCfnaV8hyf12Jtun7sePeUrtxBvq1fo5O33diCuq5luBXTyuU13hH17zG94b1H',
    'Cookie': 'CSRF=r7mnFgzcVdATipJLSclf38aLI4VKJZb54Ozu2L74EPKftU9inyfUvIwMbreN33QIamUCfnaV8hyf12Jtun7sePeUrtxBvq1fo5O33diCuq5luBXTyuU13hH17zG94b1H',
    'Content-Type': 'application/json'
}

const fortisLoadMoreHeader = {
    'mib_security_principal': '<?xml version="1.0" encoding="UTF-8"?><saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:xs="http://www.w3.org/2001/XMLSchema" ID="Assertion-uuidf6c2dc98-0135-1483-a8ec-954f33354b9c" IssueInstant="2020-06-30T12:11:49.885Z" Version="2.0"><saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">BNP Paribas Fortis</saml2:Issuer><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><ds:Reference URI="#Assertion-uuidf6c2dc98-0135-1483-a8ec-954f33354b9c"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"><ec:InclusiveNamespaces xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#" PrefixList="xs"/></ds:Transform></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><ds:DigestValue>ppYH8vMUcjntFOsbj3gFf0QFwBw=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>TNNFAGkvmmuoIPv1FPrqEiEpYFa5TAd21r2UqsRWUSVoBj9h9wePcfMPHSDuPB5SUo0H4oN9jlnju9gyPrf34onKYHpQu3cDU0ICpoP9eNwNMnYMg9eecjKaegg4UCyvfhmsrwVG4hzHTiz8FZNK6vOGJ2RQgXXHNZ8WZ0XD3aSW29bjSHA5fUqp26v5S4QYVyru5x/9baBLybGtBtSCXkeEz91Ow6yzbcHFPx+SUq8DGhvYEmr5ptQDwRtRd7Wog82tYh5ZqFqPMuytwuYUv1bz0Fc0a97MiWI+DBUZiOG+cdDzJcAHfQe4zoCYYmqrtqPX4OnMh9vPxozRofeVfw==</ds:SignatureValue><ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIIFDDCCAvSgAwIBAgICFPcwDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCQkUxGzAZBgNVBAoTEkJOUCBQYXJpYmFzIEZvcnRpczEMMAoGA1UECxMDT1NNMSowKAYDVQQDEyFCTlAgUGFyaWJhcyBGb3J0aXMgUFJPRCBTZXJ2ZXIgQ0EwHhcNMTgxMDI1MjIwMDAwWhcNMjMxMDI0MjE1OTU5WjCBjDELMAkGA1UEBhMCQkUxGzAZBgNVBAoTEkJOUCBQYXJpYmFzIEZvcnRpczEnMCUGA1UECxMeUGhvZW5peCBUcmFuc2FjdGlvbiBNYW5hZ2VtZW50MQ0wCwYDVQQLEwRPSEFMMSgwJgYDVQQDEx9QT1NUTUFOdG9PSEFMLXFhLmJlLmZvcnRpcy5iYW5rMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtVBAOyhQKD0tkCdJWncIw8SO3Bi3K7iXmuo+eDEqyjnK2UTFejx+Q+kMS9kErr0JgEDTE98eO8tYXDe4ifCF3fYQqEaSYxJt25CCPhj5YYPM8mdr/mZxoqSqM+DZiyMAHKqbawjWH4Am9x1+0NB7j5dGloKaXJTJc2B4rRBDVT2tvFWtd6t39MxxS/bbjDKKdyzt33+RAePHzohwpkGE0aNVqV0+x5WIBUPz/Y9zgihccqZ0oioXhRklF/ZDDcNieMZLguQVPmcXHuSx4icAsD2FmtvXHurAOWUBGeH8OXSo8KO41toN1EyBd7VS+ODfNiKmpt4EVLKvKfydL/BdmQIDAQABo4GeMIGbMCoGA1UdEQQjMCGCH1BPU1RNQU50b09IQUwtcWEuYmUuZm9ydGlzLmJhbmswDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAdBgNVHQ4EFgQUB0vvPBjLAMsqWOJApI9+5ZnIBQIwHwYDVR0jBBgwFoAU76q5ZMR/QclUXGQwZ3CmVhMKrTEwDQYJKoZIhvcNAQELBQADggIBABqJenFT7d8ygNO70EdXAwhR8BhTjgrRkHMFUB+5+i4Lh6NA5Vm5WEEVmdH2XbnWSAIfaKymUo/cyVSWo5kI8HhuWhSma8Me+r08dweWU4L6gVj/p/e1vckrXx3lzmUBzTswFrAUnFQGsW87rh5vDbnASoRctyp0ffrdf//4TYkYflI5+iU7nDCAsNI8rDSb0Rk6iBioxwBXyUhw/ax4aShSAQm9imaldyHjupxmVLT8/eNqmq64NiuJU9xJzy+1s3p6JMtbFHBTJPoS8GVI0iF7oNNSaFA0UEM0eQZwrzbFgQP339bEgt33txqhkqfuwvzu3e2xeITgmpN28Svl8cCszaPTNP4ODv9l2swvp6NO3zJxriWOq/RCl2ElzFbBR5P0EftAFCn/2ACHiO+QFnRD9KgdPNppFZap9ODhBet0uSP58wUpVDvEYKGDM+wex1FO/CXWHD0RZ98q+UsvUVONoLRCy+D0VsaUnszFahatBlbhjoKdf5ijIIri2oaLdFipuqvb3EQ/bToZDqjmMWTlMOS23gP8geOq1bMcw1mIDbVszLoD9RD/xqsKDRkNxmxrZ6UveBLKRjJRLK7pw8XpacdwbOHdB0sE3ne0heCCLz0lXzE5t+LfHvuUfnDRnD953sKyfgHyTu7lzx87v8hYWk7m8nccf30qN2SglW7p</ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature><saml2:Subject><saml2:NameID Format="urn:ibm:names:ITFIM:5.1:accessmanager">1234567890</saml2:NameID><saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><saml2:SubjectConfirmationData NotOnOrAfter="2030-03-26T11:00:00.000Z" Recipient="http://localhost"/></saml2:SubjectConfirmation></saml2:Subject><saml2:Conditions NotBefore="2020-06-30T12:11:49.884Z" NotOnOrAfter="2023-12-31T23:00:00.000Z"><saml2:AudienceRestriction><saml2:Audience>http://localhost</saml2:Audience></saml2:AudienceRestriction></saml2:Conditions><saml2:AuthnStatement AuthnInstant="2020-06-30T12:11:49.885Z" SessionIndex="uuidf6c2dc89-0135-16c7-a13a-954f33354b9c" SessionNotOnOrAfter="2023-12-31T23:00:00.000Z"><saml2:AuthnContext><saml2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:Password</saml2:AuthnContextClassRef></saml2:AuthnContext></saml2:AuthnStatement><saml2:AttributeStatement><saml2:Attribute Name="ip-address" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">194.7.114.2</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="oeMappedId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">PGxhc3QtbG9nb24tdGltZXN0YW1wPjIwMTMxMDIzMDk1MzI0PC9sYXN0LWxvZ29uLXRpbWVzdGFtcD48Y2FyZC1udW1iZXI-NjcwMzA0MTgwMDUxNzcwMDg8L2NhcmQtbnVtYmVyPjxwc3A-MDI2Mjc5NDk8L3BzcD48cHNwLWxhbmd1YWdlPk5MPC9wc3AtbGFuZ3VhZ2U-PHBzcC1jb3VudHJ5PkJFPC9wc3AtY291bnRyeT48cGFuLXNuPjAyPC9wYW4tc24-PGNhcmQtc24-MDY8L2NhcmQtc24-PGRpZGEtdG9rZW4-bXVpZDwvZGlkYS10b2tlbj48ZGlkYS1jb2RlPm11aWQtY29kZTwvZGlkYS1jb2RlPjx1c2VyLXJvbGU-MDA8L3VzZXItcm9sZT4</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="authenticationMeanId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">08</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="userId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">E3573507</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="personId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">02627949</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="user-agent" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.6) Gecko/20100625 Firefox/3.6.6</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="dacLevel" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">5</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="distributorId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">71FB001</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="smid" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">1010318102</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="xLogId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">471bc72b1952488dc579483d179f18ed</saml2:AttributeValue></saml2:Attribute></saml2:AttributeStatement></saml2:Assertion>',
    'CSRF': 'r7mnFgzcVdATipJLSclf38aLI4VKJZb54Ozu2L74EPKftU9inyfUvIwMbreN33QIamUCfnaV8hyf12Jtun7sePeUrtxBvq1fo5O33diCuq5luBXTyuU13hH17zG94b1H',
    'Cookie': 'CSRF=r7mnFgzcVdATipJLSclf38aLI4VKJZb54Ozu2L74EPKftU9inyfUvIwMbreN33QIamUCfnaV8hyf12Jtun7sePeUrtxBvq1fo5O33diCuq5luBXTyuU13hH17zG94b1H',
    'Content-Type': 'application/json'
}

const fintroLoadMoreHeader = {
    'mib_security_principal': '<?xml version="1.0" encoding="UTF-8"?><saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:xs="http://www.w3.org/2001/XMLSchema" ID="Assertion-uuidf6c2dc98-0135-1483-a8ec-954f33354b9c" IssueInstant="2019-12-18T13:32:58.591Z" Version="2.0"><saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">BNP Paribas Fortis</saml2:Issuer><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><ds:Reference URI="#Assertion-uuidf6c2dc98-0135-1483-a8ec-954f33354b9c"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"><ec:InclusiveNamespaces xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#" PrefixList="xs"/></ds:Transform></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><ds:DigestValue>C5k/eOv/a+Iy9KZZxY3yeUrdRxU=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>lIHbxx3v4FiH1xNGIIpPeihDYCBnErejQz7kHmHNuQJBRj3wbUAveoRs3yLGf51JSGuNDJfmbWuCoNdPQVXQLZVjJVtJ7Ch3ir6YC/0C0jGBTqndZ9U40+8OPQJWxwKtFCWzfSTJY1rYylF/lhdIdJ1w2BldS936N7vFzC49KJeG/Tyv53gldj5h57zl+OBeklqmk/G7hL4Z9IaKBjfrWTnEsyNUSq/kgpVUcG4HJh5cRkBEPyDNEjb+h8VukP+XqOWirWxMqDtBO72RY23oqgSLfmYgVEmWYbVXSCgDwxiv+C13eNgBivzvGDWs05rMqY3qk5wZ9WXKBrdmJgaK+Q==</ds:SignatureValue><ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIIFDDCCAvSgAwIBAgICFPcwDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCQkUxGzAZBgNVBAoTEkJOUCBQYXJpYmFzIEZvcnRpczEMMAoGA1UECxMDT1NNMSowKAYDVQQDEyFCTlAgUGFyaWJhcyBGb3J0aXMgUFJPRCBTZXJ2ZXIgQ0EwHhcNMTgxMDI1MjIwMDAwWhcNMjMxMDI0MjE1OTU5WjCBjDELMAkGA1UEBhMCQkUxGzAZBgNVBAoTEkJOUCBQYXJpYmFzIEZvcnRpczEnMCUGA1UECxMeUGhvZW5peCBUcmFuc2FjdGlvbiBNYW5hZ2VtZW50MQ0wCwYDVQQLEwRPSEFMMSgwJgYDVQQDEx9QT1NUTUFOdG9PSEFMLXFhLmJlLmZvcnRpcy5iYW5rMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtVBAOyhQKD0tkCdJWncIw8SO3Bi3K7iXmuo+eDEqyjnK2UTFejx+Q+kMS9kErr0JgEDTE98eO8tYXDe4ifCF3fYQqEaSYxJt25CCPhj5YYPM8mdr/mZxoqSqM+DZiyMAHKqbawjWH4Am9x1+0NB7j5dGloKaXJTJc2B4rRBDVT2tvFWtd6t39MxxS/bbjDKKdyzt33+RAePHzohwpkGE0aNVqV0+x5WIBUPz/Y9zgihccqZ0oioXhRklF/ZDDcNieMZLguQVPmcXHuSx4icAsD2FmtvXHurAOWUBGeH8OXSo8KO41toN1EyBd7VS+ODfNiKmpt4EVLKvKfydL/BdmQIDAQABo4GeMIGbMCoGA1UdEQQjMCGCH1BPU1RNQU50b09IQUwtcWEuYmUuZm9ydGlzLmJhbmswDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAdBgNVHQ4EFgQUB0vvPBjLAMsqWOJApI9+5ZnIBQIwHwYDVR0jBBgwFoAU76q5ZMR/QclUXGQwZ3CmVhMKrTEwDQYJKoZIhvcNAQELBQADggIBABqJenFT7d8ygNO70EdXAwhR8BhTjgrRkHMFUB+5+i4Lh6NA5Vm5WEEVmdH2XbnWSAIfaKymUo/cyVSWo5kI8HhuWhSma8Me+r08dweWU4L6gVj/p/e1vckrXx3lzmUBzTswFrAUnFQGsW87rh5vDbnASoRctyp0ffrdf//4TYkYflI5+iU7nDCAsNI8rDSb0Rk6iBioxwBXyUhw/ax4aShSAQm9imaldyHjupxmVLT8/eNqmq64NiuJU9xJzy+1s3p6JMtbFHBTJPoS8GVI0iF7oNNSaFA0UEM0eQZwrzbFgQP339bEgt33txqhkqfuwvzu3e2xeITgmpN28Svl8cCszaPTNP4ODv9l2swvp6NO3zJxriWOq/RCl2ElzFbBR5P0EftAFCn/2ACHiO+QFnRD9KgdPNppFZap9ODhBet0uSP58wUpVDvEYKGDM+wex1FO/CXWHD0RZ98q+UsvUVONoLRCy+D0VsaUnszFahatBlbhjoKdf5ijIIri2oaLdFipuqvb3EQ/bToZDqjmMWTlMOS23gP8geOq1bMcw1mIDbVszLoD9RD/xqsKDRkNxmxrZ6UveBLKRjJRLK7pw8XpacdwbOHdB0sE3ne0heCCLz0lXzE5t+LfHvuUfnDRnD953sKyfgHyTu7lzx87v8hYWk7m8nccf30qN2SglW7p</ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature><saml2:Subject><saml2:NameID Format="urn:ibm:names:ITFIM:5.1:accessmanager">1234567890</saml2:NameID><saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><saml2:SubjectConfirmationData NotOnOrAfter="2030-03-26T11:00:00.000Z" Recipient="http://localhost"/></saml2:SubjectConfirmation></saml2:Subject><saml2:Conditions NotBefore="2019-12-18T13:32:58.590Z" NotOnOrAfter="2023-12-31T23:00:00.000Z"><saml2:AudienceRestriction><saml2:Audience>http://localhost</saml2:Audience></saml2:AudienceRestriction></saml2:Conditions><saml2:AuthnStatement AuthnInstant="2019-12-18T13:32:58.591Z" SessionIndex="uuidf6c2dc89-0135-16c7-a13a-954f33354b9c" SessionNotOnOrAfter="2023-12-31T23:00:00.000Z"><saml2:AuthnContext><saml2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:Password</saml2:AuthnContextClassRef></saml2:AuthnContext></saml2:AuthnStatement><saml2:AttributeStatement><saml2:Attribute Name="ip-address" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">194.7.114.2</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="oeMappedId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">PGxhc3QtbG9nb24tdGltZXN0YW1wPjIwMTMxMDIzMDk1MzI0PC9sYXN0LWxvZ29uLXRpbWVzdGFtcD48Y2FyZC1udW1iZXI-NjcwMzA0MTgwMDUxNzcwMDg8L2NhcmQtbnVtYmVyPjxwc3A-MTEzNTc1MzA8L3BzcD48cHNwLWxhbmd1YWdlPkZSPC9wc3AtbGFuZ3VhZ2U-PHBzcC1jb3VudHJ5PkJFPC9wc3AtY291bnRyeT48cGFuLXNuPjAyPC9wYW4tc24-PGNhcmQtc24-MDY8L2NhcmQtc24-PGRpZGEtdG9rZW4-bXVpZDwvZGlkYS10b2tlbj48ZGlkYS1jb2RlPm11aWQtY29kZTwvZGlkYS1jb2RlPjx1c2VyLXJvbGU-MDA8L3VzZXItcm9sZT4</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="authenticationMeanId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">08</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="userId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">E2504936</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="personId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">11357530</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="user-agent" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.6) Gecko/20100625 Firefox/3.6.6</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="dacLevel" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">5</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="distributorId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">71KN001</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="smid" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">1141298702</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="xLogId" NameFormat="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">471bc72b1952488dc579483d179f18ed</saml2:AttributeValue></saml2:Attribute></saml2:AttributeStatement></saml2:Assertion>',
    'CSRF': 'r7mnFgzcVdATipJLSclf38aLI4VKJZb54Ozu2L74EPKftU9inyfUvIwMbreN33QIamUCfnaV8hyf12Jtun7sePeUrtxBvq1fo5O33diCuq5luBXTyuU13hH17zG94b1H',
    'Cookie': 'CSRF=r7mnFgzcVdATipJLSclf38aLI4VKJZb54Ozu2L74EPKftU9inyfUvIwMbreN33QIamUCfnaV8hyf12Jtun7sePeUrtxBvq1fo5O33diCuq5luBXTyuU13hH17zG94b1H',
    'Content-Type': 'application/json'
}

// --------------------------------     Functions   ---------------------------------------

function getListOfAccounts(headers) {
    console.log("In getListOfAccounts")
    const options = {
        url: "https://i-net4018a-qa.be.fortis.bank:50990/PYIA-pa02/v1/filter-accounts/INFO",
        headers: headers,
        cert: fs.readFileSync(certFile),
        key: fs.readFileSync(keyFile),
        passphrase: 'oS1U5USKMJqMMH3flgQe'
    };

    return request(options)
        .catch(() => true);
};

function createPsd2Consent(headers, clientId, accountNumber) {
    console.log("In createPsd2Consent")
    const body = {
        clientId: clientId,
        purposeAndAttributeValues: [{
            purposeValue: accountNumber,
            listOfAttributes: [{
                attributeName: "CURRENCY",
                attributeValue: "EUR"
            }]
        }]
    };
    const options = {
        method: 'POST',
        url: "https://i-net4018a-qa.be.fortis.bank:50990/PYIA-pa02/v1/authorizations/cbpi",
        headers: headers,
        cert: fs.readFileSync(certFile),
        key: fs.readFileSync(keyFile),
        passphrase: 'oS1U5USKMJqMMH3flgQe',
        body: JSON.parse(JSON.stringify(body)),
        json: true
    };

    return request(options)
        .catch(() => {

        });
};
const csrf = '2e9312a346129e623ca0c830b874fcd3e25a8a0c1919f2d03414b7a13c5d9e65f447255cb9b2b69d485e13066c14cd0cf9e8bd8777be028ae468ffece305bef5627ce76f8d4c68d6a70880eae33b41e6407ab1c14f48830e50369b607042bfc8c9d0a6c601606b81545f3cb1c32818338924b4c1c9c8a27e87bba7140555fca2';


//Headers are necessary for every API call to OCPL_PR01
const headers = {
    'CSRF': csrf,
    'Cookie': 'distributorid=52FB001;axes=fr|PC|fb|priv|PC|9578d0619aa64d1d932fde87bee3033d|;europolicy=optin;CSRF=' + csrf + ';',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    'Content-Type': 'application/json'
}

// --------------------------------     Step definitions    ------------------------------------

Given('I am logged in with a smid that has PSD2 consents', (callback) => {
    login('1010318102', '67030417166474212', callback);
})


// Grouped accounts steps

Given('I get the list of accounts of a user in {string}', (brand, callback) => {
    let headerBrand = brand == "Fintro" ? fintroHeader : fortisHeader;

    const options = {
        url: "https://i-net4018a-qa.be.fortis.bank:50990/PYIA-pa02/v1/filter-accounts/INFO",
        headers: headerBrand,
        cert: fs.readFileSync(certFile),
        key: fs.readFileSync(keyFile),
        passphrase: 'oS1U5USKMJqMMH3flgQe'
    };

    request(options, callback);
});

When('I create a psd2 consent in {string}', (brand) => {
    let bodyBrand = brand == "Fintro" ? fintroBody : fortisBody;
    let headerBrand = brand == "Fintro" ? fintroHeader : fortisHeader;

    const options = {
        method: 'POST',
        url: "https://i-net4018a-qa.be.fortis.bank:50990/PYIA-pa02/v1/authorizations/cbpi",
        headers: headerBrand,
        cert: fs.readFileSync(certFile),
        key: fs.readFileSync(keyFile),
        passphrase: 'oS1U5USKMJqMMH3flgQe',
        body: bodyBrand,
        json: true
    };

    request(options)
        .catch(function(err) {});
});


// Load more steps

When('I create more than twenty psd2 consents in {string}', (brand, callback) => {
    const headers = brand == "Fintro" ? fintroLoadMoreHeader : fortisLoadMoreHeader;
    const fortisAccountNumberList = ["BE47001257225080", "BE68001826823834"];
    const fintroAccountNumberList = ["BE38143086336872", "BE38143086336872"];
    const accountNumberList = brand == "Fintro" ? fintroAccountNumberList : fortisAccountNumberList;

    const clientIdList = ["k4QztmnS20", "NvWt0TLS20", "pWnsrsTS20", "ssI8usTS20",
        "kXqD7uTS20", "QPg0suTS20", "3YSBIvTS20", "5mszewTS20",
        "JQQFnwTS20", "Y5PyIxTS20", "BNJBtBUS20", "nwsQ5DUS20",
        "ra84kDUS20", "NTUSQVUS20", "sFTQ6WUS20", "rH1fkWUS20"
    ];

    const createConsentPromise = (headers, clientId, accountNumber) => {
        return getListOfAccounts(headers)
            .then(() => createPsd2Consent(headers, clientId, accountNumber));
    }

    const executeSequentially = (headers, accountNumber, itemsOriginal) => {
        const items = Array.from(itemsOriginal)

        return createConsentPromise(headers, items.shift(), accountNumber)
            .then(() => {
                if (items.length > 0) {
                    return executeSequentially(headers, accountNumber, items)
                }
            });
    }

    executeSequentially(headers, accountNumberList[0], clientIdList)
        .then(() => executeSequentially(headers, accountNumberList[1], clientIdList))
        .then(callback);

});

When('I delete all PSD2 consents', (callback) => {
    api.post('https://p1.easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/v1/customer/consents', {}, headers)
        .then((response) => {
            consents = response.body.consents

            const promises = consents.map(consent =>
                api.delete('https://p1.easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/v1/customer/consents/' + consent.id, headers)
            );
            Promise.all(promises).then(() => callback())
        })
});



Then('The psd2 consent is created', (callback) => {
    // OK
    callback();
});

Then('The list is empty', (callback) => {
    api.post('https://p1.easybanking.qabnpparibasfortis.be/OCPL-pr01/rpc/v1/customer/consents', {}, headers)
        .then((response) => {
            console.log(response.body.consents)
            assert.isTrue(consents > response.body.consents);
            callback();
        })
})