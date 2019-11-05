/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("../../");
require("./lib/");

fluid.defaults("gpii.tests.ul.website.fourohfour.caseHolder", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Testing our 404 page...",
        tests: [
            {
                name: "Request a page that doesn't exist...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: ".alert"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["There should be an error message onscreen...", "{arguments}.0", "getText", "The page you requested could not be found."] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.fourohfour.environment", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    endpoint:   "/notfound",
    components: {
        caseHolder: {
            type: "gpii.tests.ul.website.fourohfour.caseHolder"
        }
        // TODO: Reenable
        //accessibilityReports: {
        //    type: "gpii.test.ul.website.caseHolder.accessibilityReports"
        //}
    }
});

fluid.test.runTests("gpii.tests.ul.website.fourohfour.environment");
