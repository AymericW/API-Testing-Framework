const bypass = require('./bypass');

let test = bypass();


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

sleep(3000).then(() => console.log(test + "AZERTYUIOPMLKJHGFDSERT"));