// Test our "toggle" control.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../");
require("./lib/");

fluid.defaults("gpii.tests.ul.website.toggle.caseHolder.functional", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [
        {
            name: "Test the toggle controls using the keyboard...",
            tests: [
                {
                    name: "Toggle a 'short notation' component using the keyboard...",
                    type: "test",
                    sequence: [
                        {
                            func: "{testEnvironment}.webdriver.actionsHelper",
                            args: [{ fn: "sendKeys", args: [
                                gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER, // use the "skip to content" link
                                gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER  // Tab to the first toggle, trigger it using the "enter" key.
                            ]}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                            listener: "{testEnvironment}.webdriver.findElement",
                            args:     [{ css: ".first-short-toggle-viewport .toToggle"}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                            listener: "gpii.test.webdriver.inspectElement",
                            args:     ["The first toggle panel should be hidden...", "{arguments}.0", "isDisplayed", false] // message, element, elementFn, expectedValue, jqUnitFn
                        },
                        {
                            func: "{testEnvironment}.webdriver.findElement",
                            args: [{ css: ".second-short-toggle-viewport .toToggle"}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                            listener: "gpii.test.webdriver.inspectElement",
                            args:     ["The second toggle panel should still be visible...", "{arguments}.0", "isDisplayed", true] // message, element, elementFn, expectedValue, jqUnitFn
                        }
                    ]
                },
                {
                    name: "Toggle a 'long notation' component using the keyboard...",
                    type: "test",
                    sequence: [
                        {
                            func: "{testEnvironment}.webdriver.actionsHelper",
                            args: [{ fn: "sendKeys", args: [
                                gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                       // use the "skip to content" link
                                gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, // Tab to the first "long notation" toggle
                                gpii.webdriver.Key.ENTER                                                // trigger it using the "enter" key.
                            ]}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                            listener: "{testEnvironment}.webdriver.findElement",
                            args:     [{ css: ".first-long-toggle-viewport .toToggle.toggleClass1.toggleClass2"}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                            listener: "jqUnit.assert",
                            args:     ["Our custom classes should have been applied to our toggle panel..."]
                        },
                        {
                            func: "{testEnvironment}.webdriver.findElements",
                            args: [{ css: ".second-long-toggle-viewport .toToggle.toggleClass1.toggleClass2"}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onFindElementsComplete",
                            listener: "jqUnit.assertDeepEq",
                            args:     ["Our custom classes should not have been applied to another toggle panel...", [], "{arguments}.0"]
                        }
                    ]
                }
            ]
        },
        {
            name: "Test the toggle controls using the mouse...",
            tests: [
                {
                    name: "Toggle a 'short notation' component using the mouse...",
                    type: "test",
                    sequence: [
                        {
                            func: "{testEnvironment}.webdriver.findElement",
                            args: [{ css: ".first-short-toggle-viewport .toggle"}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                            listener: "{testEnvironment}.webdriver.actionsHelper",
                            args:     [{ fn: "click", args: ["{arguments}.0"]}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                            listener: "{testEnvironment}.webdriver.findElement",
                            args:     [{ css: ".first-short-toggle-viewport .toToggle"}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                            listener: "gpii.test.webdriver.inspectElement",
                            args:     ["The first toggle panel should be hidden...", "{arguments}.0", "isDisplayed", false] // message, element, elementFn, expectedValue, jqUnitFn
                        },
                        {
                            func: "{testEnvironment}.webdriver.findElement",
                            args: [{ css: ".second-short-toggle-viewport .toToggle"}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                            listener: "gpii.test.webdriver.inspectElement",
                            args:     ["The second toggle panel should still be visible...", "{arguments}.0", "isDisplayed", true] // message, element, elementFn, expectedValue, jqUnitFn
                        }
                    ]
                },
                {
                    name: "Toggle a 'long notation' component using the mouse...",
                    type: "test",
                    sequence: [
                        {
                            func: "{testEnvironment}.webdriver.findElement",
                            args: [{ css: ".first-long-toggle-viewport .toggle"}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                            listener: "{testEnvironment}.webdriver.actionsHelper",
                            args:     [{ fn: "click", args: ["{arguments}.0"]}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                            listener: "{testEnvironment}.webdriver.findElement",
                            args:     [{ css: ".first-long-toggle-viewport .toToggle.toggleClass1.toggleClass2"}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                            listener: "jqUnit.assert",
                            args:     ["Our custom classes should have been applied to our toggle panel..."]
                        },
                        {
                            func: "{testEnvironment}.webdriver.findElements",
                            args: [{ css: ".second-long-toggle-viewport .toToggle.toggleClass1.toggleClass2"}]
                        },
                        {
                            event:    "{testEnvironment}.webdriver.events.onFindElementsComplete",
                            listener: "jqUnit.assertDeepEq",
                            args:     ["Our custom classes should not have been applied to another toggle panel...", [], "{arguments}.0"]
                        }
                    ]
                }
            ]
        }
    ]
});

fluid.defaults("gpii.tests.ul.website.toggle.environment.functional", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    endpoint: "/toggle-functional-tests",
    components: {
        caseHolder: {
            type: "gpii.tests.ul.website.toggle.caseHolder.functional"
        },
        accessibilityReports: {
            type: "gpii.test.ul.website.caseHolder.accessibilityReports"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.toggle.environment.functional" });
