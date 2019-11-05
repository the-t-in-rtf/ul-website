/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.require("%gpii-webdriver");
gpii.webdriver.loadTestingSupport();

fluid.require("%gpii-couchdb-test-harness");
gpii.test.couchdb.loadTestingSupport();

fluid.registerNamespace("gpii.test.ul.website");

fluid.defaults("gpii.test.ul.website.sequenceElements.startWebdriver", {
    gradeNames: "fluid.test.sequenceElement",
    sequence: [
        { func: "{testEnvironment}.events.createDriver.fire" },
        {
            event: "{testEnvironment}.events.onDriverReady",
            listener: "fluid.log",
            args: ["Webdriver component started."]
        }
    ]
});

fluid.defaults("gpii.test.ul.website.sequenceElements.stopWebdriver", {
    gradeNames: "fluid.test.sequenceElement",
    sequence: [
        { func: "{testEnvironment}.events.stopDriver.fire" },
        {
            event: "{testEnvironment}.events.onDriverStopped",
            listener: "fluid.log",
            args: ["Webdriver component stopped."]
        }
    ]
});

fluid.defaults("gpii.test.ul.website.sequenceElements.coverage", {
    gradeNames: "fluid.test.sequenceElement",
    sequence: [
        {
            func: "{testEnvironment}.webdriver.executeScript",
            args: [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "window.__coverage__"]
        },
        {
            event: "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
            listener: "gpii.tests.ul.website.coverage.saveCoverageData",
            args: ["{testEnvironment}", "{arguments}.0"]
        }
    ]
});

fluid.defaults("gpii.test.ul.website.sequences.base", {
    gradeNames: "gpii.test.couchdb.sequence",
    sequenceElements: {
        startDriver: {
            gradeNames: "gpii.test.ul.website.sequenceElements.startWebdriver",
            priority:   "before:sequence"
        },
        coverage: {
            gradeNames: "gpii.test.ul.website.sequenceElements.coverage",
            priority: "after:sequence"
        },
        stopDriver: {
            gradeNames: "gpii.test.ul.website.sequenceElements.stopWebdriver",
            priority:   "after:coverage"
        }
    }
});

fluid.defaults("gpii.test.ul.website.sequenceElements.loadPage", {
    gradeNames: "fluid.test.sequenceElement",
    sequence: [
        //{
        //    func: "fluid.log",
        //    args: ["URL:", "{testEnvironment}.options.startUrl"]
        //},
        {
            func: "{testEnvironment}.webdriver.get",
            args: ["{testEnvironment}.options.startUrl"]
        },
        {
            event:    "{testEnvironment}.webdriver.events.onGetComplete",
            listener: "fluid.identity"
        }
    ]
});

fluid.defaults("gpii.test.ul.website.sequences.loadPage", {
    gradeNames: "gpii.test.ul.website.sequences.base",
    sequenceElements: {
        loadPage: {
            gradeNames: "gpii.test.couchdb.sequenceElement.startHarness",
            priority:   "after:startDriver"
        }
    }
});


/*

 A caseHolder that opens a given page anonymously.  Before each test, it:

 - Starts the API, including a lucene and pouchdb instance.
 - Starts the test browser.
 - Navigates to the starting URL for this caseHolder.
 - Clicks a known element in the document (to ensure that tab navigation tests are consistent in Firefox, where the first tab hits the search bar rather than the first focusable element).

 After each test, it cleanly shuts down all test fixtures, including the browser.

 */
fluid.defaults("gpii.test.ul.website.caseHolder", {
    gradeNames: ["gpii.test.couchdb.caseHolder"],
    sequenceGrade: "gpii.test.ul.website.sequences.loadPage"
});


fluid.defaults("gpii.test.ul.website.sequenceElements.login", {
    gradeNames: "fluid.test.sequenceElement",
    sequence: [
        {
            func: "{testEnvironment}.webdriver.get",
            args: ["{testEnvironment}.options.urls.login"]
        },
        {
            event:    "{testEnvironment}.webdriver.events.onGetComplete",
            listener: "{testEnvironment}.webdriver.wait",
            args:     [gpii.webdriver.until.elementLocated({ css: ".login-form"})]
        },
        {
            event:    "{testEnvironment}.webdriver.events.onWaitComplete",
            listener: "{testEnvironment}.webdriver.actionsHelper",
            args:     [[{fn: "sendKeys", args: [gpii.webdriver.Key.TAB, gpii.webdriver.Key.ENTER, gpii.webdriver.Key.TAB, "{that}.options.username", gpii.webdriver.Key.TAB, "{that}.options.password", gpii.webdriver.Key.ENTER]}]]
        },
        {
            event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
            listener: "{testEnvironment}.webdriver.wait",
            args:     [gpii.webdriver.until.elementLocated({ css: ".login-success .success"})]
        },
        {
            func: "{testEnvironment}.webdriver.findElement",
            args: [{ css: ".login-success .success"}]
        },
        {
            event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
            listener: "gpii.test.webdriver.inspectElement",
            args:     ["A login success message should now be displayed...", "{arguments}.0", "getText", "You have successfully logged in."] // message, element, elementFn, expectedValue, jqUnitFn
        }
    ]
});

fluid.defaults("gpii.test.ul.website.sequences.login", {
    gradeNames: "gpii.test.ul.website.sequences.loadPage",
    sequenceElements: {
        login: {
            gradeNames: "gpii.test.ul.website.sequenceElements.login",
            priority:   "before:loadPage"
        }
    }
});

// Additional sequence steps for tests that need to be run when we're logged in.

// A caseholder for tests that require the user to be logged in.
fluid.defaults("gpii.test.ul.website.caseHolder.loggedIn", {
    gradeNames:    ["gpii.test.couchdb.caseHolder"],
    sequenceGrade: "gpii.test.ul.website.sequences.login",
    username:      "existing",
    password:      "password"
});

// TODO: Write new accessibility report checking.

fluid.defaults("gpii.test.ul.website.testEnvironment", {
    gradeNames: ["gpii.test.couchdb.lucene.environment"],
    hangWait:   7500,
    events: {
        createDriver: null,
        onDriverReady: null,
        onDriverStopped: null,
        stopDriver: null
    },
    databases: {
        users: { data: "%ul-api/tests/data/users.json" },
        ul:    {
            data: [
                "%ul-api/tests/data/deleted.json",
                "%ul-api/tests/data/duplicates.json",
                "%ul-api/tests/data/pilot.json",
                "%ul-api/tests/data/views.json"
            ]
        },
        images: {
            data: [
                "%ul-api/tests/data/galleries.json",
                "%ul-api/tests/data/images.json"
            ]
        }
    },
    components: {
        apiHarness: {
            type: "gpii.ul.website.harness",
            options: {
                ports: {
                    api:  "{testEnvironment}.options.ports.api",
                    couch:  25984,
                    lucene: 25985
                }
            }
        },
        webdriver: {
            createOnEvent: "createDriver",
            type: "gpii.webdriver",
            options: {
                browser: "{testEnvironment}.options.browser",
                events: {
                    onDriverReady: "{testEnvironment}.events.onDriverReady",
                    stopDriver:    "{testEnvironment.events.stopDriver"
                },
                listeners: {
                    onQuitComplete: { func: "{testEnvironment}.events.onDriverStopped.fire" },
                    stopDriver: { func: "{that}.quit" }
                }
            }
        }
    }
});
