module.exports = function() {
    this.After(function (scenario, callback) {
        if (scenario.isFailed()) {
            // Do your after stuff here
            console.log("scenario failed");
            callback();
        }
        callback();
    });
};