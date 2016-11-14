/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../");
require("./lib/");

fluid.defaults("gpii.tests.ul.website.checkboxPanel.caseHolder.qunit", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Run our QUnit tests...",
        tests: [
            {
                name: "Examine our browser tests and report the results...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args: [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "gpii.webdriver.QUnitHarness.instance.results"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "gpii.tests.ul.website.qunit.reportResults",
                        args:     ["{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.checkboxPanel.environment.qunit", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    startUrl:   {
        expander: {
            func: "fluid.stringTemplate",
            args: ["%apiUrl/checkboxPanel-qunit-tests", { apiUrl: "{that}.options.urls.api" }]
        }
    },
    components: {
        caseHolder: {
            type: "gpii.tests.ul.website.checkboxPanel.caseHolder.qunit"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.checkboxPanel.environment.qunit" });

fluid.defaults("gpii.tests.ul.website.checkboxPanel.caseHolder.functional", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Test keyboard navigation...",
        tests: [
            {
                name: "Set checkbox values using only keyboard navigation...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER, gpii.webdriver.Key.TAB, gpii.webdriver.Key.SPACE]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "stringComponent.model.checkboxValue"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The primary model should have been updated...", ["a string value"], "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args: [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "secondStringComponent.model.checkboxValue"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The secondary model should not have been updated...", [], "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.checkboxPanel.environment.functional", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    startUrl:   {
        expander: {
            func: "fluid.stringTemplate",
            args: ["%apiUrl/checkboxPanel-functional-tests", { apiUrl: "{that}.options.urls.api" }]
        }
    },
    components: {
        // Activating a control with a space will not work until this bug is resolved: https://bugs.chromium.org/p/chromedriver/issues/detail?id=1502
        // TODO:  Continue monitoring the issue and reenable this ASAP
        // caseHolder: {
        //     type: "gpii.tests.ul.website.checkboxPanel.caseHolder.functional"
        // },
        // TODO:  Reenable these once https://issues.gpii.net/browse/GPII-2128 is resolved
        // accessibilityReports: {
        //     type: "gpii.test.ul.website.caseHolder.accessibilityReports"
        // }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.checkboxPanel.environment.functional" });
