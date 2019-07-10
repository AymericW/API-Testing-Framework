var validate = require('jsonschema').validate;

module.exports = {
    validate: (schema, instance) => validate(instance, schema).valid
}