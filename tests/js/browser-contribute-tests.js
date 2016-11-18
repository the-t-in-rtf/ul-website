/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../");
require("./lib/");

fluid.defaults("gpii.tests.ul.website.contribute.caseHolder.anonymous", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Load the contribute interface without logging in...",
        tests: [
            {
                name: "Load the contribute interface without logging in...",
                type: "test",
                sequence: [
                    {
                        func:     "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".alert"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".alert"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["We should be instructed to log in...", "{arguments}.0", "getText", "You must log in to contribute a new record to the Unified Listing."] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.contribute.caseHolder.loggedIn", {
    gradeNames: ["gpii.test.ul.website.caseHolder.loggedIn"],
    rawModules: [{
        name: "Load a unified record as a contributor...",
        tests: [
            {
                name: "Contribute a valid new record...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{
                            fn: "sendKeys", args: [
                                gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                               // use the "skip to content" link
                                gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, "AAA contributed product name", // navigate to and fill out the product name
                                gpii.webdriver.Key.TAB, "contributed product description",                      // navigate to and fill out the product description
                                gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB,         // navigate to the manufacture name
                                "contributed manufacturer name", gpii.webdriver.Key.ENTER                       // fill out the manufacturer name and hit enter to submit the form
                            ]
                        }]
                    },
                    // TODO: Update this when we have a cleaner way of waiting for an element to update.
                    {
                        event: "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.sleep",
                        args: [2500]
                    },
                    {
                        event: "{testEnvironment}.webdriver.events.onSleepComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args: [{css: ".success"}]
                    },
                    {
                        event: "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args: ["We should see an entry indicating that our record was saved...", "{arguments}.0", "getText", "Your submission has been saved. You may continue revising this or close the window."] // message, element, elementFn, expectedValue, jqUnitFn
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
                        args: ["Our new contribution should be listed on our contributions page...", "{arguments}.0", "getText", "AAA contributed product name"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            },
            {
                name: "Attempt to contribute an invalid new record...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{
                            fn: "sendKeys", args: [
                                gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                         // use the "skip to content" link
                                gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER  // Attempt to submit the form with no data.
                            ]
                        }]
                    },
                    // TODO: Update this when we have a cleaner way of waiting for an element to update.
                    {
                        event: "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.sleep",
                        args: [2500]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onSleepComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{css: ".fieldError"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:    ["A validation error should be displayed onscreen..", "{arguments}.0", "getText", "A name is required."] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.contribute.environment", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    endpoint:   "/contribute",
    myContributionsUrl:   {
        expander: {
            func: "fluid.stringTemplate",
            args: ["%apiUrl%endpoint", { apiUrl: "{that}.options.urls.api", endpoint: "/api/products?sources=%5B%22~existing%22%5D&unified=false" }]
        }
    },
    components: {
        anonymousCaseHolder: {
            type: "gpii.tests.ul.website.contribute.caseHolder.anonymous"
        },
        loggedInCaseHolder: {
            type: "gpii.tests.ul.website.contribute.caseHolder.loggedIn"
        },
        accessibilityReports: {
            type: "gpii.test.ul.website.caseHolder.accessibilityReports",
            options: {
                gradeNames: ["gpii.test.ul.website.caseHolder.loggedIn"]
            }
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.contribute.environment" });
