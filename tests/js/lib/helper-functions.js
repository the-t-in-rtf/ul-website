/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.ul.website.qunit");

gpii.tests.ul.website.qunit.reportResults = function (results) {
    var testResults = results.filter(function (result) { return result.type === "log"; });
    jqUnit.expect(testResults.length);
    fluid.each(testResults, function (result) {
        jqUnit.assertTrue(result.data.message, result.data.result);
    });
};


// TODO: Get instrumentation and code coverage reporting working.
/*

 https://blog.engineyard.com/2015/measuring-clientside-javascript-test-coverage-with-istanbul

 */

