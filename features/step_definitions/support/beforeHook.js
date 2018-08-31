var fs = require('fs');
var tv4 = require('tv4');
var _ = require('underscore');
var path = require('path');

var myBeforeHooks = function () {
    this.Before(function (scenario) {
        var data;
        switch (scenario.getName()) {
            case 'getCountries':
                data=fs.readFileSync(path.resolve("./configuration/countriesApi.json"));
                break;

            case 'getProducts':
                data=fs.readFileSync(path.resolve("./configuration/productsApi.json"));
                break;

            case 'postProspect':
            case 'getProspect with id':
                data=fs.readFileSync(path.resolve("./configuration/prospectsApi.json"));
                break;
        
            default:
                break;
        }
        
        var swaggerSpecs=JSON.parse(data);
        fixNullability(swaggerSpecs.definitions);
        this.setSwaggerSpecs(swaggerSpecs);
        initializeValidationSchemaMap(this);
    });

    var fixNullability = function(schema) {
        if (schema.type && schema['x-isnullable']) {
            schema.type = [schema.type, 'null'];
        }
        _.keys(schema).forEach(function(key) {
            if (_.isObject(schema[key])) fixNullability(schema[key]);
        });
    }

    var initializeValidationSchemaMap = function(world) {
        var map = {};
        var operations = _.keys(world.swaggerSpecs.paths);
        operations.forEach(function(operation) {
            // console.log("operation is: " + operation);
            // console.log("responseDefinitionName is: " + responseDefinitionName);
            var call, responseDefinitionName, responseSchemaName;
            const operationPaths = world.swaggerSpecs.paths[operation];
            if(operationPaths.post !== undefined){
                call = operationPaths.post.operationId;
                responseDefinitionName = fetchSchemaReference('post', operationPaths);
            }else if(operationPaths.get !== undefined){
                call = operationPaths.get.operationId;
                responseDefinitionName = fetchSchemaReference('get', operationPaths);
            }else if (operationPaths.delete !== undefined){
                call = operationPaths.delete.operationId;
                responseDefinitionName = fetchSchemaReference('delete', operationPaths);
            }else if(operationPaths.put !== undefined){
                call = operationPaths.put.operationId;
                responseDefinitionName = fetchSchemaReference('put', operationPaths);
            }
            responseSchemaName = responseDefinitionName.substring(14);
            map[call] = responseSchemaName;
            tv4.addSchema(responseSchemaName, {definitions: world.swaggerSpecs.definitions});
        })

        world.setSchemeMap(map);
    }

};

function fetchSchemaReference(methodType, operationPaths){
    var schemaPath;
    
    switch(methodType){
        case 'get':
        schemaPath = operationPaths.get.responses[200].schema;
        break;
        case 'post':
        schemaPath = operationPaths.post.responses[200].schema;
        break;
        case 'put':
        schemaPath = operationPaths.put.responses[200].schema;
        break;
        case 'delete':
        schemaPath = operationPaths.delete.responses[200].schema;
        break;
    }
    return (schemaPath.type === "array") ? schemaPath.items.$ref : schemaPath.$ref;
}

module.exports = myBeforeHooks;
