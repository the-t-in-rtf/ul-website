/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../");
require("./lib/");

fluid.defaults("gpii.tests.ul.website.products.caseHolder", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Test the products interface...",
        tests: [
            {
                name: "View a public source...",
                type: "test",
                sequence: [
                    {
                        func:     "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-listing"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-listing"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "jqUnit.assert",
                        args:     ["There should be product listings..."]
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: ".products-topnav .nav-link"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "jqUnit.assert",
                        args:     ["There should be pagination controls..."]
                    }
                ]
            },
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
                        args:     ["The first product should be from the first page...", "{arguments}.0", "getText", "A record ahead of its time."] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                       // use the "skip to content" link
                            gpii.webdriver.Key.TAB,                                                 // tab past "options"
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, // tab past "previous", "1", focus on "2"
                            gpii.webdriver.Key.ENTER                                                // Open the second page of results
                        ]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.sleep",
                        args:     [2000]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onSleepComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-listing a"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The first search result should now be from the second page...", "{arguments}.0", "getText", "Whetstone 016"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                    // TODO: Reenable this once the problems with gpii-location-bar-relay are resolved: https://issues.gpii.net/browse/GPII-2132
                    // {
                    //     func: "{testEnvironment}.webdriver.navigateHelper",
                    //     args: ["back"]
                    // },
                    // {
                    //     event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
                    //     listener: "{testEnvironment}.webdriver.sleep",
                    //     args:     [2000]
                    // },
                    // {
                    //     event:    "{testEnvironment}.webdriver.events.onSleepComplete",
                    //     listener: "{testEnvironment}.webdriver.findElement",
                    //     args:     [{ css: ".product-listing a"}]
                    // },
                    // {
                    //     event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                    //     listener: "gpii.test.webdriver.inspectElement",
                    //     args:     ["The first search result should be from the first page again...", "{arguments}.0", "getText", "A record ahead of its time."] // message, element, elementFn, expectedValue, jqUnitFn
                    // }
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
                        args:     ["The first search result should be the first alphabetical entry...", "{arguments}.0", "getText", "A record ahead of its time."] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER, // use the "skip to content" link
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER, // tab to "options", hit "enter" to open it
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB,   // one tab to "products per page", one more to "sort records".
                            "b", gpii.webdriver.Key.ENTER                     // hit "b" to select the next menu item
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
                    }
                    // // TODO: Reenable this once the problems with gpii-location-bar-relay are resolved: https://issues.gpii.net/browse/GPII-2132
                    // {
                    //     func: "{testEnvironment}.webdriver.navigateHelper",
                    //     args: ["back"]
                    // },
                    // {
                    //     event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
                    //     listener: "{testEnvironment}.webdriver.sleep",
                    //     args:     [2500]
                    // },
                    // {
                    //     event:    "{testEnvironment}.webdriver.events.onSleepComplete",
                    //     listener: "{testEnvironment}.webdriver.findElement",
                    //     args:     [{ css: ".product-listing a"}]
                    // },
                    // {
                    //     event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                    //     listener: "gpii.test.webdriver.inspectElement",
                    //     args:     ["The first search result should be the first alphabetical entry again...", "{arguments}.0", "getText", "A record ahead of its time."] // message, element, elementFn, expectedValue, jqUnitFn
                    // }
                ]
            }
            // TODO:  Reenable these once chromedriver supports sending space keys again: https://bugs.chromium.org/p/chromedriver/issues/detail?id=1502&q=&colspec=ID%20Status%20Pri%20Owner%20Summary
            // {
            //     name: "Test the status controls...",
            //     type: "test",
            //     sequence: [
            //         {
            //             func: "{testEnvironment}.webdriver.actionsHelper",
            //             args: [{ fn: "sendKeys", args: [
            //                 gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                                               // use the "skip to content" link
            //                 gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                                               // tab to "options", hit "enter" to open it
            //                 gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, // three tabs to "products per page", one more to "sort records".
            //                 gpii.webdriver.Key.TAB, gpii.webdriver.Key.SPACE                                                // Tab to, and untick the "new" status.
            //             ]}]
            //         },
            //         // We have to manually wait because the same markup (with different results) is already present and we would pick up the old results otherwise.
            //         // TODO:  Update this once we have some way of knowing when the client component is finished.
            //         {
            //             event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
            //             listener: "{testEnvironment}.webdriver.sleep",
            //             args:     [2500]
            //         },
            //         {
            //             event:    "{testEnvironment}.webdriver.events.onSleepComplete",
            //             listener: "{testEnvironment}.webdriver.findElement",
            //             args:     [{ css: ".product-listing a"}]
            //         },
            //         {
            //             event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
            //             listener: "gpii.test.webdriver.inspectElement",
            //             args:     ["The first product listing should now be a deleted record...", "{arguments}.0", "getText", "Deleted record"] // message, element, elementFn, expectedValue, jqUnitFn
            //         }
            //     ]
            // }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.products.environment", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    endpoint:   "/api/products?sources=%22unified%22",
    components: {
        caseHolder: {
            type: "gpii.tests.ul.website.products.caseHolder"
        },
        accessibilityReports: {
            type: "gpii.test.ul.website.caseHolder.accessibilityReports"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.products.environment" });

fluid.defaults("gpii.tests.ul.website.products.caseHolder.contributions.anonymous", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Load a user's contributed records without logging in...",
        tests: [
            {
                name: "View a user's contributed records...",
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
                        listener: "jqUnit.assert",
                        args:     ["There should be an error..."]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.products.caseHolder.contributions.loggedIn", {
    gradeNames: ["gpii.test.ul.website.caseHolder.loggedIn"],
    rawModules: [{
        name: "Load a user's contributed records while logged in...",
        tests: [
            {
                name: "View a user's contributed records while logged in...",
                type: "test",
                sequence: [
                    {
                        func:     "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-listing"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-listing"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "jqUnit.assert",
                        args:     ["There should be product listings..."]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.products.environment.contributions", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    endpoint:   "/api/products?sources=%22~existing%22",
    components: {
        anonymousCaseHolder: {
            type: "gpii.tests.ul.website.products.caseHolder.contributions.anonymous"
        },
        loggedInCaseHolder: {
            type: "gpii.tests.ul.website.products.caseHolder.contributions.loggedIn"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.products.environment.contributions" });
