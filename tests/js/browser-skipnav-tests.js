/*

    Test “skip to content” in static templates and templates we have overridden in other packages, namely:

    /
    /api/
    /api/user/login
    /api/user/forgot
    /api/user/signup
    /contributors
    /databases
    /manufacturers
    /notfound (testing the "404" page)

*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../");
require("./lib");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.ul.website.skipNav");

gpii.tests.ul.website.skipNav.checkElementFocus = function (page, webElement) {
    jqUnit.assertNotUndefined("The #main element should be in focus on page '" + page + "...", webElement);
};

fluid.defaults("gpii.tests.ul.website.skipNav.caseHolder", {
    gradeNames: ["gpii.test.ul.website.caseHolder"],
    rawModules: [{
        name: "Testing the 'skip to content' control...",
        tests: [
            {
                name: "We should be able to use the keyboard to skip the navigation menu...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.actionsHelper",
                        args: [{ fn: "sendKeys", args: [gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: "#main:focus"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.tests.ul.website.skipNav.checkElementFocus",
                        args:     ["{testEnvironment}.options.startUrl", "{arguments}.0"] // page, webElement
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.ul.website.skipNav.environment.base", {
    gradeNames: ["gpii.test.ul.website.testEnvironment"],
    startUrl:   {
        expander: {
            func: "fluid.stringTemplate",
            args: ["%apiUrl%endpoint", { apiUrl: "{that}.options.urls.api", endpoint: "{that}.options.endpoint" }]
        }
    },
    components: {
        caseHolder: {
            type: "gpii.tests.ul.website.skipNav.caseHolder"
        }
    }
});

fluid.defaults("gpii.tests.ul.website.skipNav.environment.root", {
    gradeNames: ["gpii.tests.ul.website.skipNav.environment.base"],
    endpoint:   "/"
});
gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.skipNav.environment.root" });

fluid.defaults("gpii.tests.ul.website.skipNav.environment.fourohfour", {
    gradeNames: ["gpii.tests.ul.website.skipNav.environment.base"],
    endpoint:   "/notfound"
});
gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.skipNav.environment.fourohfour" });

fluid.defaults("gpii.tests.ul.website.skipNav.environment.docs", {
    gradeNames: ["gpii.tests.ul.website.skipNav.environment.base"],
    endpoint:   "/api/"
});
gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.skipNav.environment.docs" });

fluid.defaults("gpii.tests.ul.website.skipNav.environment.login", {
    gradeNames: ["gpii.tests.ul.website.skipNav.environment.base"],
    endpoint:   "/api/user/login"
});
gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.skipNav.environment.login" });

fluid.defaults("gpii.tests.ul.website.skipNav.environment.forgot", {
    gradeNames: ["gpii.tests.ul.website.skipNav.environment.base"],
    endpoint:   "/api/user/forgot"
});
gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.skipNav.environment.forgot" });

fluid.defaults("gpii.tests.ul.website.skipNav.environment.signup", {
    gradeNames: ["gpii.tests.ul.website.skipNav.environment.base"],
    endpoint:   "/api/user/signup"
});
gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.skipNav.environment.signup" });

fluid.defaults("gpii.tests.ul.website.skipNav.environment.contribute", {
    gradeNames: ["gpii.tests.ul.website.skipNav.environment.base"],
    endpoint:   "/contribute"
});
gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.skipNav.environment.contribute" });


fluid.defaults("gpii.tests.ul.website.skipNav.environment.contributors", {
    gradeNames: ["gpii.tests.ul.website.skipNav.environment.base"],
    endpoint:   "/contributors"
});
gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.skipNav.environment.contributors" });

fluid.defaults("gpii.tests.ul.website.skipNav.environment.databases", {
    gradeNames: ["gpii.tests.ul.website.skipNav.environment.base"],
    endpoint:   "/databases"
});
gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.skipNav.environment.databases" });

fluid.defaults("gpii.tests.ul.website.skipNav.environment.manufacturers", {
    gradeNames: ["gpii.tests.ul.website.skipNav.environment.base"],
    endpoint:   "/manufacturers"
});
gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.ul.website.skipNav.environment.manufacturers" });
