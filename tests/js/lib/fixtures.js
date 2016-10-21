/* eslint-env node */
"use strict";
require("gpii-webdriver");
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
gpii.webdriver.loadTestingSupport();

// An environment for tests that also require a gpii-webdriver browser.
fluid.registerNamespace("gpii.test.ul.api.testEnvironment.withBrowser");
gpii.test.ul.api.testEnvironment.withBrowser.stopFixtures = function (that) {
    gpii.tests.ul.api.harness.stopServer(that);
    that.browser.end();
};
fluid.defaults("gpii.test.ul.api.testEnvironment.withBrowser", {
    gradeNames: ["gpii.test.browser.environment", "gpii.tests.ul.api.harness"],
    events: {
        onFixturesConstructed: {
            events: {
                apiReady:      "apiReady",
                luceneStarted: "luceneStarted",
                pouchStarted:  "pouchStarted",
                onDriverReady: "onDriverReady"
            }
        },
        onFixturesStopped: {
            events: {
                apiStopped:    "apiStopped",
                luceneStopped: "luceneStopped",
                pouchStopped:  "pouchStopped",
                onDriverStopped: "onDriverStopped"
            }
        }
    },
    invokers: {
        stopFixtures: {
            funcName: "gpii.test.ul.api.testEnvironment.withBrowser.stopFixtures",
            args:     ["{that}"]
        }
    }
});
