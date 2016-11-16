/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../");
require("./lib/");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.ul.website.updates");
gpii.tests.ul.website.updates.hasMatchingElement = function (message, elements, elementFn, expected, shouldNotMatch) {
    shouldNotMatch = shouldNotMatch || false;
    var matches = false;

    var promises = [];
    fluid.each(elements, function (element) {
        var elementPromise = element[elementFn]();
        promises.push(elementPromise);
        elementPromise.then(function (result) {
            if (result === expected) {
                matches = true;
            }
        });
    });

    var sequence = fluid.promise.sequence(promises);
    sequence.then(function () {
        jqUnit.assertEquals(message, shouldNotMatch, matches);
    });
};

fluid.defaults("gpii.tests.ul.website.updates.caseHolder.anonymous", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Load the updates interface without logging in...",
        tests: [
            {
                name: "Check the default results...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.wait",
                        args: [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-listing"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-listing a"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The first matching update should be as expected...", "{arguments}.0", "getText", "FULLMEASURE - MAAVIS"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElements",
                        args: [{ css: ".ul-updates-sources-control option"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementsComplete",
                        listener: "gpii.tests.ul.website.updates.hasMatchingElement",
                        args:     ["There should not be the option to select a private source...", "{arguments}.0", "getText", "~existing", false] // message, elements, elementFn, expected, shouldNotMatch
                    }
                ]
            },
            {
                name: "Test filtering by date...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.wait",
                        args: [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-listing"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElements",
                        args:     [{ css: ".product-listing"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementsComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["There should be three results by default...", 3, "{arguments}.0.length"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER, // use the "skip to content" link
                            gpii.webdriver.Key.TAB, "01", "01", "2012"        // tab to the date field and type it in.
                        ]}]
                    },
                    // We have to manually wait because the same markup (with different results) is already present and we would pick up the old results otherwise.
                    // TODO:  Update this once we have some way of knowing when the client component is finished.
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.sleep",
                        args:     [2500]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onSleepComplete",
                        listener: "{testEnvironment}.webdriver.findElements",
                        args:     [{ css: ".product-listing"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementsComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["There should now be two results...", 2, "{arguments}.0.length"]
                    }
                    // TODO:  Currently we have no way of clearing the results other than clicking a chrome-specific visual element.  When we have a new date component, add tests for clearing the value.
                ]
            },
            {
                name: "Test the older/newer toggle...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.wait",
                        args: [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-listing"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElements",
                        args:     [{ css: ".product-listing"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementsComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["There should be three results by default...", 3, "{arguments}.0.length"]
                    },
                    /*
                     tab + enter to skip nav
                     5 x tab to get to older/newer control.
                     down arrow, confirm update

                     */
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                                                                       // use the "skip to content" link
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, // tab to the older/newer radio group
                            gpii.webdriver.Key.ARROW_DOWN                                                                                           // use the arrow key to change the value
                        ]}]
                    },
                    // We have to manually wait because the same markup (with different results) is already present and we would pick up the old results otherwise.
                    // TODO:  Update this once we have some way of knowing when the client component is finished.
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.sleep",
                        args:     [2500]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onSleepComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-listing a"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The first matching update should be as expected...", "{arguments}.0", "getText", "Jaws For Windows"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.ARROW_UP // use the arrow key to change the value back
                        ]}]
                    },
                    // We have to manually wait because the same markup (with different results) is already present and we would pick up the old results otherwise.
                    // TODO:  Update this once we have some way of knowing when the client component is finished.
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.sleep",
                        args:     [2500]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onSleepComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-listing"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The first matching update should be as expected...", "{arguments}.0", "getText", "FULLMEASURE - MAAVIS"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.updates.environment.anonymous", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    endpoint:   "/updates",
    components: {
        anonymousCaseHolder: {
            type: "gpii.tests.ul.website.updates.caseHolder.anonymous"
        },
        accessibilityReports: {
            type: "gpii.test.ul.website.caseHolder.accessibilityReports"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.updates.environment.anonymous" });

fluid.defaults("gpii.tests.ul.website.updates.caseHolder.loggedIn", {
    gradeNames: ["gpii.test.ul.website.caseHolder.loggedIn"],
    rawModules: [{
        name: "Load the updates interface while logged in...",
        tests: [
            {
                name: "Check the default results (logged in)...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.wait",
                        args: [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-listing"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElements",
                        args:     [{ css: ".product-listing a"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementsComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["There should now be four results...", 4, "{arguments}.0.length"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElements",
                        args: [{ css: ".ul-updates-sources-control option"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementsComplete",
                        listener: "gpii.tests.ul.website.updates.hasMatchingElement",
                        args:     ["There should be the option to select our private source...", "{arguments}.0", "getText", "~existing", true] // message, elements, elementFn, expected, shouldNotMatch
                    }
                ]
            },
            {
                name: "Limit the results to our personal source...",
                type: "test",
                sequence: [
                    // tab + enter to skip navigation
                    // 4 x tab to get to source control
                    // ~ to set source to ~existing
                    {
                        func: "{testEnvironment}.webdriver.wait",
                        args: [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-listing"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElements",
                        args:     [{ css: ".product-listing a"}]
                    },
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                                               // use the "skip to content" link
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, // tab to the "source" controls
                            "~"                                                                                             // select our source (~existing)
                        ]}]
                    },
                    // TODO: Update this when we have a cleaner way of waiting for an element to update.
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.sleep",
                        args:     [2500]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onSleepComplete",
                        listener: "{testEnvironment}.webdriver.findElements",
                        args:     [{ css: ".product-listing"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementsComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["There should now be one result...", 1, "{arguments}.0.length"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.updates.environment.loggedIn", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    endpoint:   "/updates",
    components: {
        loggedInCaseHolder: {
            type: "gpii.tests.ul.website.updates.caseHolder.loggedIn"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.updates.environment.loggedIn" });
