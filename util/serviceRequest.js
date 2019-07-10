var serviceRequest = {
    getContext:{
        'firstName':'foo',
        'lastName':'bar',
        'brand':'FB',
        'language':'FR',
        'email':'abc@abc.com'
      },
    getCountry:{
        'brand':'FB',
        'language':'fr'
      },
    validateNewCustomer:{
      "gsn": null,
      "address" :{
        "city": "saint josse ten noode",
        "postalCode": "1210",
        "streetName" : "rue du progres",
        "houseNumber" : "55",
        "countryCode": "BE"

      },
      "firstName": "Nicolas",
      "lastName" : "Cueto",
      "nationality": "Belge",
      "birthPlace": "uccle",
      "birthDate" :"18NOV1990",
      "gender": "M",
      "idCardNumber" : "590123457380",
      "idCardExpirationDate": "02.03.2027",
      "nationalRegistryNumber": "90111865197"
    },
    createCustomerAccount:{
      "firstName":"foo",
      "lastName":"bar",
      "brand":"FB",
      "language":"FR",
      "email":"abc@abc.com"
    },
    getStatus:{
      "firstName":"foo",
      "lastName":"bar",
      "brand":"FB",
      "language":"FR",
      "email":"abc@abc.com"
    },
    retrieveCustomerProductList:{
        'ageUnder28':'N',
        'brand':'FB',
        'language':'fr',
        'personalDetailsDTO':{
          'dateOfBirth': '01010111'
        }
    }
};

module.exports = serviceRequest;