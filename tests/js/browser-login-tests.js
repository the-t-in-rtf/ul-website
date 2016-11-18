/*

    Test the login/logout sequence steps we use in other tests in isolation.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../");
require("./lib/");

fluid.defaults("gpii.tests.ul.website.login.caseHolder", {
    gradeNames: ["gpii.test.ul.website.caseHolder.loggedIn"],
    rawModules: [{
        name: "Test our login sequence steps...",
        tests: [
            {
                name: "Open the home page after logging in...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.wait",
                        args: [gpii.webdriver.until.elementLocated({ css: ".user-controls-toggle .button"})]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The username of the logged in user should appear onscreen...", "{arguments}.0", "getText", "existing"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.login.environment", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.ul.website.login.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.login.environment" });
