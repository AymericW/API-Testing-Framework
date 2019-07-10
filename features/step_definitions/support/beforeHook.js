const myBeforeHooks = function () {
    this.Before(function (scenario) {
        console.log(scenario);
    });
};

module.exports = myBeforeHooks;
