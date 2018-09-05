const fs = require('fs')

module.exports = {

    read    : (path) =>  JSON.parse(fs.readFileSync(path)),
    write   : (path, json) => fs.writeFileSync(path, json)

}