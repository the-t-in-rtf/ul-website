/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../");
require("./lib/");

fluid.defaults("gpii.tests.ul.website.search.caseHolder", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Test the search interface...",
        tests: [
            {
                name: "Perform a simple search (no pagination controls expected)...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, "jaws", gpii.webdriver.Key.ENTER]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-listing"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-listing a"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The first search result should be correct...", "{arguments}.0", "getText", "Jaws For Windows"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElements",
                        args: [{ id: ".search-topnav .nav-link"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementsComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["There should be no pagination controls...", [], "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.search.environment", {
    gradeNames: ["gpii.test.ul.website.testEnvironment.withLucene"],
    endpoint:   "/api/search",
    components: {
        caseHolder: {
            type: "gpii.tests.ul.website.search.caseHolder"
        },
        accessibilityReports: {
            type: "gpii.test.ul.website.caseHolder.accessibilityReports"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.search.environment" });


fluid.defaults("gpii.tests.ul.website.search.caseHolder.whetstone", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Test the paging and sorting controls...",
        tests: [
            {
                name: "Use the paging controls to navigate back and forth...",
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
                        args:     ["The first search result should be from the first page...", "{arguments}.0", "getText", "Whetstone 000"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                       // use the "skip to content" link
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, // tab past "options", "search form", "go"
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, // tab past "previous", "1", "2"
                            gpii.webdriver.Key.ENTER                                                // Open the second page of results
                        ]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-listing"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-listing a"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The first search result should now be from the second page...", "{arguments}.0", "getText", "Whetstone 025"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.navigateHelper",
                        args: ["back"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
                        listener: "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-listing"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-listing a"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The first search result should be from the first page again...", "{arguments}.0", "getText", "Whetstone 000"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            },
            {
                name: "Test the sorting controls...",
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
                        args:     ["The first search result should be the first alphabetical entry...", "{arguments}.0", "getText", "Whetstone 000"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                                               // use the "skip to content" link
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                                               // tab to "options", hit "enter" to open it
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, // three tabs to "products per page", one more to "sort records".
                            "b", gpii.webdriver.Key.ENTER                                                                   // hit "b" to select the next menu item
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
                        args:     ["The first search result should now be the last alphabetical entry...", "{arguments}.0", "getText", "Whetstone 499"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.navigateHelper",
                        args: ["back"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
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
                        args:     ["The first search result should be the first alphabetical entry again...", "{arguments}.0", "getText", "Whetstone 000"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.search.environment.whetstone", {
    gradeNames: ["gpii.test.ul.website.testEnvironment.withLucene"],
    endpoint:   "/api/search?q=%22whetstone%22",
    components: {
        caseHolder: {
            type: "gpii.tests.ul.website.search.caseHolder.whetstone"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.search.environment.whetstone" });

fluid.defaults("gpii.tests.ul.website.search.caseHolder.status", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Test the paging and sorting controls...",
        tests: [
            {
                name: "Test the status controls...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.wait",
                        args: [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".search-products p"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".search-products p"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["There should be no search results with the default statuses...", "{arguments}.0", "getText", "No products found.  Please update your search terms."] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                                               // use the "skip to content" link
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                                               // tab to "options", hit "enter" to open it
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, // three tabs to "products per page", one more to "sort records".
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, // four more tabs to get to the last "status" control (deleted).
                            gpii.webdriver.Key.SPACE                                                                        // hit space to activate the control
                        ]}]
                    },
                    // We have to manually wait because the same markup (with different results) is already present and we would pick up the old results otherwise.
                    // TODO:  Update this once we have some way of knowing when the client component is finished.
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.sleep",
                        args:     [10000]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onSleepComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-listing a"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The first search result should now be a deleted record...", "{arguments}.0", "getText", "Deleted record"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.search.environment.status", {
    gradeNames: ["gpii.test.ul.website.testEnvironment.withLucene"],
    endpoint:   "/api/search?q=%22deleted%22",
    components: {
        caseHolder: {
            type: "gpii.tests.ul.website.search.caseHolder.status"
        }
    }
});

// TODO:  Reenable these once chromedriver supports sending space keys again: https://bugs.chromium.org/p/chromedriver/issues/detail?id=1502&q=&colspec=ID%20Status%20Pri%20Owner%20Summary
// gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.search.environment.status" });
