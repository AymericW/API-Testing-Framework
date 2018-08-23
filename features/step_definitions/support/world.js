var tv4 = require("tv4");
var fs = require('fs');

module.exports = function() {
    this.World = function MyWorld() {

        this.ENVIRONMENTS = {
            "TEST2"   : "https://app.easybanking.test2access.qabnpparibasfortis.be",
            "TEST"  : "https://easybanking.testaccess.qabnpparibasfortis.be",
            "QA"    : "https://easybanking.qabnpparibasfortis.be",
            "QA+1"  : "https://p1.easybanking.qabnpparibasfortis.be",
            "QA-1"  : "https://m1.easybanking.qabnpparibasfortis.be"
        };

        this.swaggerSpecs;

        this.validateApiDefinition = function(data, call) {
            var isValid = tv4.validate(data, this.getMasterSchemaDefinition(call));
            if (isValid) {
                return {
                    "isValid": true, 
                    "message": null, 
                    "schemaPath": null
                };
            } else {
                return {
                    "isValid": false, 
                    "message": tv4.error.message, 
                    "schemaPath": tv4.error.schemaPath
                };
            }
        }

        this.setSwaggerSpecs = function(specs) {
            this.swaggerSpecs = specs;
        }

        this.setSchemeMap = function(map) {
            this.schemeMap = map;
        }

        this.getMasterSchemaDefinition = function(call) {
            var definition = this.schemeMap[call];
            return tv4.getSchema(definition).definitions[definition];
        }

    };
}


