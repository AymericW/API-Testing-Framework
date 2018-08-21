var fs=require('fs');
var tv4 = require('tv4');
var _ = require('underscore');
var path = require('path');

var myBeforeHooks = function () {
    this.Before(function (scenario) {
        var data=fs.readFileSync(path.resolve("./configuration/apiDefinition.json"));
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
        console.log(operations.length);
        operations.forEach(function(operation) {
            // console.log(operation);
            // var call = world.swaggerSpecs.paths[operation].post.operationId,
            //     responseDefinitionName = world.swaggerSpecs.paths[operation].post.responses[200].schema.$ref,
            //     responseSchemaName = responseDefinitionName.substring(14);
            var call, responseDefinitionName, responseSchemaName;
            if(world.swaggerSpecs.paths[operation].post !== undefined){
                call = world.swaggerSpecs.paths[operation].post.operationId;
                responseDefinitionName = world.swaggerSpecs.paths[operation].post.responses[200].schema.$ref;
                responseSchemaName = responseDefinitionName.substring(14);
            }else if(world.swaggerSpecs.paths[operation].get !== undefined){
                call = world.swaggerSpecs.paths[operation].get.operationId;
                responseDefinitionName = world.swaggerSpecs.paths[operation].get.responses[200].schema.$ref;
                responseSchemaName = responseDefinitionName.substring(14);
            }else if (world.swaggerSpecs.paths[operation].delete !== undefined){
                call = world.swaggerSpecs.paths[operation].delete.operationId;
                responseDefinitionName = world.swaggerSpecs.paths[operation].delete.responses[200].schema.$ref;
                responseSchemaName = responseDefinitionName.substring(14);
            }else if(world.swaggerSpecs.paths[operation].put !== undefined){
                call = world.swaggerSpecs.paths[operation].put.operationId;
                responseDefinitionName = world.swaggerSpecs.paths[operation].put.responses[200].schema.$ref;
                responseSchemaName = responseDefinitionName.substring(14);
            }
            map[call] = responseSchemaName;
            tv4.addSchema(responseSchemaName, {definitions: world.swaggerSpecs.definitions});
        })

            

        world.setSchemeMap(map);
    }

};
module.exports = myBeforeHooks;
