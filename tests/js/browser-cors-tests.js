/*

    Confirm that our CORS headers are working as expected.  We could test this with Testem, but as the rest of our tests
    use gpii-webdriver, we pass through test failures/successes from the browser test rather than running two sets of
    tests.

*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

require("../../");
require("./lib");

require("gpii-webdriver");
gpii.webdriver.loadTestingSupport();

fluid.registerNamespace("gpii.tests.ul.website.cors");

gpii.tests.ul.website.cors.reportResults = function (results) {
    var testResults = results.filter(function (result) { return result.type === "log"; });
    jqUnit.expect(testResults.length);
    fluid.each(testResults, function (result) {
        jqUnit.assertTrue(result.data.message, result.data.result);
    });
};

fluid.defaults("gpii.tests.ul.website.cors.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%ul-website/tests/static/cors-tests.html",
    rawModules: [{
        name: "Testing our CORS headers...",
        tests: [
            {
                name: "Examine our browser tests and report the results...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "gpii.webdriver.QUnitHarness.instance.results"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "gpii.tests.ul.website.cors.reportResults",
                        args:     ["{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.cors.environment", {
    gradeNames: ["gpii.test.ul.api.testEnvironment.withBrowser"],
    components: {
        caseHolder: {
            type: "gpii.tests.ul.website.cors.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.cors.environment" });
