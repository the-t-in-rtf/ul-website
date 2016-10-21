/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.module.register("ul-website", __dirname, require);

require("./src/js/server/harness");

// Provide a function to optionally load test support.
fluid.registerNamespace("gpii.ul.website");
gpii.ul.website.loadTestingSupport = function () {
    require("./tests/js/lib/");
};

module.exports = gpii.ul.website;
