var fs=require('fs');
var tv4 = require('tv4');
var _ = require('underscore');

var myBeforeHooks = function () {
    this.Before(function (scenario) {
        var data=fs.readFileSync("/Users/naveenanandhan/Documents/API_Testing/api-testing/configuration/apiDefinition.json");
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
            var call = world.swaggerSpecs.paths[operation].post.operationId,
                responseDefinitionName = world.swaggerSpecs.paths[operation].post.responses[200].schema.$ref,
                responseSchemaName = responseDefinitionName.substring(14);
            map[call] = responseSchemaName;
            tv4.addSchema(responseSchemaName, {definitions: world.swaggerSpecs.definitions});
        })
        world.setSchemeMap(map);
    }

};
module.exports = myBeforeHooks;
