/*

    Confirm that our CORS headers are working as expected.  We could test this with Testem, but as the rest of our tests
    use gpii-webdriver, we pass through test failures/successes from the browser test rather than running two sets of
    tests.

*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");

require("../../");
require("./lib");

// For whatever reason, I can't get this to expand if I do it in an @expand block below.  Seems like the resolver isn't aware of %ul-website at the right time.
var startUrl = gpii.test.webdriver.resolveFileUrl("%ul-website/tests/static/cors-tests.html");

fluid.defaults("gpii.tests.ul.website.cors.caseHolder", {
    gradeNames: ["gpii.test.ul.website.caseHolder.noFocus"],
    rawModules: [{
        name: "Testing our CORS headers...",
        tests: [
            {
                name: "Examine our browser tests and report the results...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args: [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "gpii.webdriver.QUnitHarness.instance.results"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "gpii.tests.ul.website.qunit.reportResults",
                        args:     ["{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.cors.environment", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    startUrl:   startUrl,
    components: {
        caseHolder: {
            type: "gpii.tests.ul.website.cors.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.cors.environment" });
