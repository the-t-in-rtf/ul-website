/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../");
require("./lib/");


fluid.defaults("gpii.tests.ul.website.docs.caseHolder", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Testing our documentation...",
        tests: [
            {
                name: "Load the documentation...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: "#unified-listing-api"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The API documentation should be displayed onscreen...", "{arguments}.0", "getText", "Unified Listing API"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.docs.environment", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    endpoint: "/api/docs",
    components: {
        caseHolder: {
            type: "gpii.tests.ul.website.docs.caseHolder"
        },
        accessibilityReports: {
            type: "gpii.test.ul.website.caseHolder.accessibilityReports"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.docs.environment" });
