/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../");
require("./lib/");

fluid.defaults("gpii.tests.ul.website.suggest.caseHolder.anonymous", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Try to suggest a change without logging in...",
        tests: [
            {
                name: "Open the suggest page without logging in...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: ".alert"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["We should see a permission error.", "{arguments}.0", "getText", "You must be logged in to use this API endpoint."] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.suggest.caseHolder.loggedIn", {
    gradeNames: ["gpii.test.ul.website.caseHolder.loggedIn"],
    rawModules: [{
        name: "Suggest changes as a contributor...",
        tests: [
            {
                name: "Attempt to suggest an invalid change...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,   // Use the "skip to content" link to skip to the form.
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB,     // Tab to the "name" field.
                            gpii.webdriver.Key.DELETE, gpii.webdriver.Key.ENTER // delete the value, then attempt to submit the form by hitting "Enter"
                        ]}]
                    },
                    // TODO: Come up with a better way of detecting markup changes or component events.
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.sleep",
                        args:     [2000]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onSleepComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".alert.fieldError"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["There should be a validation error onscreen...", "{arguments}.0", "getText", "You must provide the name of the product."] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            },
            {
                name: "Suggest a change...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,   // Use the "skip to content" link to skip to the form.
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB,     // Tab to the "name" field.
                            "AAA suggested product change", gpii.webdriver.Key.ENTER // delete the value, then attempt to submit the form by hitting "Enter"
                        ]}]
                    },
                    // TODO: Come up with a better way of detecting markup changes or component events.
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.sleep",
                        args:     [2000]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onSleepComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".success"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["A success message should be displayed.", "{arguments}.0", "getText", "Record updated."] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.myContributionsUrl"]
                    },
                    {
                        event: "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.wait",
                        args: [gpii.webdriver.until.elementLocated({css: ".product-listing"})]
                    },
                    {
                        event: "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args: [{css: ".product-listing a"}]
                    },
                    {
                        event: "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args: ["Our suggested change should be listed on our contributions page...", "{arguments}.0", "getText", "AAA suggested product change"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.suggest.environment", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    endpoint:   "/suggest/1421059432806-826608318",
    myContributionsUrl:   {
        expander: {
            func: "fluid.stringTemplate",
            args: ["%apiUrl%endpoint", { apiUrl: "{that}.options.urls.api", endpoint: "/api/products?sources=%5B%22~existing%22%5D&unified=false" }]
        }
    },
    components: {
        // accessibilityReports: {
        //     type: "gpii.test.ul.website.caseHolder.accessibilityReports",
        //     options: {
        //         gradeNames: ["gpii.test.ul.website.caseHolder.loggedIn"]
        //     }
        // },
        anonymousCaseHolder: {
            type: "gpii.tests.ul.website.suggest.caseHolder.anonymous"
        },
        loggedInCaseHolder: {
            type: "gpii.tests.ul.website.suggest.caseHolder.loggedIn"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.suggest.environment" });

fluid.defaults("gpii.tests.ul.website.suggest.caseHolder.noUid", {
    gradeNames: ["gpii.test.ul.website.caseHolder.loggedIn"],
    rawModules: [{
        name: "Try to suggest an update without a UID...",
        tests: [
            {
                name: "Open the 'suggest' interface without supplying a uid...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: ".alert p"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["A 'suggest' button should be displayed...", "{arguments}.0", "getText", "The JSON you have provided is not valid."] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.suggest.environment.noUid", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    endpoint:   "/suggest/",
    components: {
        caseHolder: {
            type: "gpii.tests.ul.website.suggest.caseHolder.noUid"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.suggest.environment.noUid" });
