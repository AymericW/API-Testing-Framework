var request = require('request-promise');
var chai = require('chai').assert;

var prospectTestGET = function () {
    var queryResponse;
    var TARGET_ENV = process.env.TARGET_ENV || "QA+1";
    var getProspect = "/OCPL-pr90/rpc/v1/prospects";

    this.When(/^I try retrieve data from previously created prospect$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
      });
};
  module.exports = prospectTestGET;