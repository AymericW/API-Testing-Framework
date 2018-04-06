"use strict";

module.exports = function () {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  this.setDefaultTimeout(20 * 1000);
};