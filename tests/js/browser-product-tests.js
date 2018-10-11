/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);
var gpii = fluid.registerNamespace("gpii");

require("../../");
require("./lib/");

fluid.defaults("gpii.tests.ul.website.product.caseHolder.unified.anonymous", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Load a unified record without logging in...",
        tests: [
            {
                name: "View a unified record without logging in...",
                type: "test",
                sequence: [
                    {
                        func:     "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-view-control-panel .button"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-view-control-panel a.button"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["A 'login' button should be displayed...", "{arguments}.0", "getText", "Log in to Suggest a Change"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: ".product-view h3"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["A product title should be displayed...", "{arguments}.0", "getText", "sample product 1"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.product.caseHolder.unified.contributor", {
    gradeNames: ["gpii.test.ul.website.caseHolder.loggedIn"],
    rawModules: [{
        name: "Load a unified record as a contributor...",
        tests: [
            {
                name: "View a unified record as a contributor...",
                type: "test",
                sequence: [
                    {
                        func:     "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-view-control-panel .button"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-view-control-panel a.button"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["A 'suggest' button should be displayed...", "{arguments}.0", "getText", "Suggest a Change"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: ".product-view h3"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["A product title should be displayed...", "{arguments}.0", "getText", "sample product 1"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.product.caseHolder.unified.reviewer", {
    gradeNames: ["gpii.test.ul.website.caseHolder.loggedIn"],
    username: "reviewer",
    rawModules: [{
        name: "Load a unified record as a reviewer...",
        tests: [
            {
                name: "View a unified record as a reviewer...",
                type: "test",
                sequence: [
                    {
                        func:     "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-view-control-panel .button"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-view-control-panel a.button"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["A 'suggest' button should be displayed...", "{arguments}.0", "getText", "Suggest a Change"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: ".product-edit-button"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["An 'edit' button should be displayed...", "{arguments}.0", "getText", "Edit Record"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: ".product-view h3"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["A product title should be displayed...", "{arguments}.0", "getText", "sample product 1"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            },
            {
                name: "Update a unified record...",
                type: "test",
                sequence: [
                    {
                        func:     "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-view-control-panel"))]
                    },
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER, // use the "skip to content" link
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER, // Tab to "edit" button, open form.
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB,   // Tab to title
                            "updated title", gpii.webdriver.Key.ENTER         // change it, then submit the form by hitting "Enter"
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
                        args:     [{ css: ".product-view h3"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The title should have been updated onscreen...", "{arguments}.0", "getText", "updated title"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.navigateHelper",
                        args: ["refresh"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{css: ".product-view h3"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The title should still be updated after a reload...", "{arguments}.0", "getText", "updated title"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            },
            {
                name: "Attempt to update a unified record with invalid data...",
                type: "test",
                sequence: [
                    {
                        func:     "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-view-control-panel"))]
                    },
                    {
                        event:     "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener:  "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,   // use the "skip to content" link
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,   // Tab to "edit" button, open form.
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB,     // Tab to title
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
                    },
                    {
                        func: "{testEnvironment}.webdriver.navigateHelper",
                        args: ["refresh"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{css: ".product-view h3"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The title should not be updated after a reload...", "{arguments}.0", "getText", "sample product 1"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.product.environment.unified", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    endpoint:   "/api/product/unified/unifiedNewer",
    components: {
        // TODO:  Figure out why we cannot safely run these in combination with the rest of the reports.
        // accessibilityReports: {
        //     type: "gpii.test.ul.website.caseHolder.accessibilityReports"
        // },
        anonymousCaseHolder: {
            type: "gpii.tests.ul.website.product.caseHolder.unified.anonymous"
        },
        contributorCaseHolder: {
            type: "gpii.tests.ul.website.product.caseHolder.unified.contributor"
        },
        reviewerCaseHolder: {
            type: "gpii.tests.ul.website.product.caseHolder.unified.reviewer"
        }
    },
    listeners: {
        "onCreate.logOptions": {
            funcName: "console.log",
            args:    ["ENVIRONMENT OPTIONS:", "@expand:JSON.stringify({that}.options, null, 2)"]
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.product.environment.unified" });

fluid.defaults("gpii.tests.ul.website.product.caseHolder.contributions.anonymous", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Load a contributed record without logging in...",
        tests: [
            {
                name: "View a contributed record...",
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

fluid.defaults("gpii.tests.ul.website.product.caseHolder.contributions.loggedIn", {
    gradeNames: ["gpii.test.ul.website.caseHolder.loggedIn"],
    rawModules: [{
        name: "Load a user's contributed record while logged in...",
        tests: [
            {
                name: "View a user's contributed record while logged in...",
                type: "test",
                sequence: [
                    {
                        func:     "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-view-control-panel"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".product-view h3"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The product title should be displayed...", "{arguments}.0", "getText", "sample product 5"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: ".product-view-control-panel .button"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["An 'edit' button should be displayed...", "{arguments}.0", "getText", "Edit Record"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            },
            {
                name: "Update a contributed record...",
                type: "test",
                sequence: [
                    {
                        func:     "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css(".product-view-control-panel"))]
                    },
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER,                         // use the "skip to content" link
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER, // Tab to "edit" button, open form.
                            gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB,                           // Tab to title
                            "updated title", gpii.webdriver.Key.ENTER                                 // change it, then submit the form by hitting "Enter"
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
                        args:     [{ css: ".product-view h3"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The title should have been updated onscreen...", "{arguments}.0", "getText", "updated title"] // message, element, elementFn, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.navigateHelper",
                        args: ["refresh"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{css: ".product-view h3"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["The title should still be updated after a reload...", "{arguments}.0", "getText", "updated title"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.product.environment.contributions", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    endpoint:   "/api/product/~existing/contrib5",
    components: {
        anonymousCaseHolder: {
            type: "gpii.tests.ul.website.product.caseHolder.contributions.anonymous"
        },
        loggedInCaseHolder: {
            type: "gpii.tests.ul.website.product.caseHolder.contributions.loggedIn"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.product.environment.contributions" });
