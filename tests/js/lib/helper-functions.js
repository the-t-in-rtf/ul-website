/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");
var path   = require("path");
var fs     = require("fs");

fluid.registerNamespace("gpii.tests.ul.website.qunit");

require("../../../");


gpii.tests.ul.website.qunit.reportResults = function (results) {
    var testResults = results.filter(function (result) { return result.type === "log"; });
    jqUnit.expect(testResults.length);
    fluid.each(testResults, function (result) {
        jqUnit.assertTrue(result.data.message, result.data.result);
    });
};


fluid.registerNamespace("gpii.tests.ul.website.coverage");

/*

 Collect client-side code coverage data. Based on an approach outlined at:

 https://blog.engineyard.com/2015/measuring-clientside-javascript-test-coverage-with-istanbul

 */
gpii.tests.ul.website.coverage.saveCoverageData = function (that, coverageData) {
    if (coverageData) {
        var coverageDir = fluid.module.resolvePath("%ul-website/coverage");
        var fileName    = fluid.stringTemplate("coverage-%id-%timestamp.json", { id: that.id, timestamp: Date.now() });
        var fullPath    = path.resolve(coverageDir, fileName);
        fs.writeFileSync(fullPath, JSON.stringify(coverageData, null, 2), { encoding: "utf8"});
    }
};
