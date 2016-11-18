/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.require("%gpii-webdriver");
gpii.webdriver.loadTestingSupport();

fluid.require("%gpii-express");
gpii.express.loadTestingSupport();

fluid.registerNamespace("gpii.test.ul.website");

gpii.test.ul.website.loadPageNoFocus = [
    {
        func: "console.log",
        args: ["URL:", "{testEnvironment}.options.startUrl"]
    },
    {
        func: "{testEnvironment}.webdriver.get",
        args: ["{testEnvironment}.options.startUrl"]
    },
    {
        event:    "{testEnvironment}.webdriver.events.onGetComplete",
        listener: "fluid.identity"
    }
];

gpii.test.ul.website.loadPageNoFocusStartSequence = gpii.test.express.standardSequenceStart.concat(gpii.test.ul.website.loadPageNoFocus);

fluid.defaults("gpii.test.ul.website.caseHolder.noFocus", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    sequenceStart: gpii.test.ul.website.loadPageNoFocusStartSequence
});


gpii.test.ul.website.loadPageAndFocus = [
    {
        func: "{testEnvironment}.webdriver.get",
        args: ["{testEnvironment}.options.startUrl"]
    },
    {
        event:    "{testEnvironment}.webdriver.events.onGetComplete",
        listener: "fluid.identity"
    }
];

// The base, combined with the harness startup steps from gpii-express
gpii.test.ul.website.anonymousPageStartSequence = gpii.test.express.standardSequenceStart.concat(gpii.test.ul.website.loadPageAndFocus);


// End sequence steps to collect coverage data
gpii.test.ul.website.coverageCollectionSequence = [
    {
        func: "{testEnvironment}.webdriver.executeScript",
        args: [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "window.__coverage__"]
    },
    {
        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
        listener: "gpii.tests.ul.website.coverage.saveCoverageData",
        args:     ["{testEnvironment}", "{arguments}.0"]
    },
    { func: "{testEnvironment}.events.stopFixtures.fire", args: [] },
    { listener: "fluid.identity", event: "{testEnvironment}.events.onFixturesStopped"}
];


/*

 A caseHolder that opens a given page anonymously.  Before each test, it:

 - Starts the API, including a lucene and pouchdb instance.
 - Starts the test browser.
 - Navigates to the starting URL for this caseHolder.
 - Clicks a known element in the document (to ensure that tab navigation tests are consistent in Firefox, where the first tab hits the search bar rather than the first focusable element).

 After each test, it cleanly shuts down all test fixtures, including the browser.

 */
fluid.defaults("gpii.test.ul.website.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    sequenceStart: gpii.test.ul.website.anonymousPageStartSequence,
    sequenceEnd: gpii.test.ul.website.coverageCollectionSequence
});


// Additional sequence steps for tests that need to be run when we're logged in.
gpii.test.ul.website.loginSequence = [
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
];

// The full set of login steps, including opening the test page afterward.
gpii.test.ul.website.loginAndOpenPage = gpii.test.ul.website.loginSequence.concat(gpii.test.ul.website.loadPageAndFocus);

// The full set of login steps, combined with the harness startup steps from gpii-express
gpii.test.ul.website.loggedInPageStartSequence = gpii.test.express.standardSequenceStart.concat(gpii.test.ul.website.loginAndOpenPage);

// A caseholder for tests that require the user to be logged in.
fluid.defaults("gpii.test.ul.website.caseHolder.loggedIn", {
    gradeNames:    ["gpii.test.webdriver.caseHolder"],
    sequenceStart: gpii.test.ul.website.loggedInPageStartSequence,
    username:      "existing",
    password:      "password"
});

// A caseholder that runs the aXe and axs accessibility checks and flags any errors as test failures.
fluid.defaults("gpii.test.ul.website.caseHolder.accessibilityReports", {
    gradeNames: ["gpii.test.webdriver.caseHolder", "gpii.tests.webDriver.hasScriptContent"],
    scriptPaths: {
        axe: "%ul-website/node_modules/axe-core/axe.js",
        axs: "%ul-website/node_modules/accessibility-developer-tools/dist/js/axs_testing.js"
    },
    sequenceStart: gpii.test.ul.website.anonymousPageStartSequence,
    axeOptions: { rules: [{ id: "color-contrast", enabled: false }]}, // We use UIOptions to handle high contrast
    rawModules: [{
        name: "Building accessibility reports...",
        tests: [
            {
                name: "Running aXe report...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args: ["{that}.options.scriptContent.axe"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args: [gpii.test.webdriver.axe.runAxe]
                    },
                    {
                        event: "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "gpii.test.webdriver.axe.checkResults",
                        args: ["{arguments}.0", "{that}.options.axeOptions"]
                    }
                ]
            }
            // TODO: Test this more heavily and get it working here again.
            // {
            //     name: "Running accessibility developer tools audit...",
            //     type: "test",
            //     sequence: [
            //         {
            //             func: "{testEnvironment}.webdriver.executeScript",
            //             args: ["{that}.options.scriptContent.axs"]
            //         },
            //         {
            //             event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
            //             listener: "{testEnvironment}.webdriver.executeScript",
            //             args:     [gpii.test.webdriver.axs.runAxs]
            //         },
            //         {
            //             event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
            //             listener: "gpii.test.webdriver.axs.checkResults",
            //             args:     ["{arguments}.0"]
            //         }
            //     ]
            // }
        ]
    }]
});

fluid.defaults("gpii.test.ul.website.testEnvironment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment", "gpii.tests.ul.website.harness.instrumented"],
    hangWait: 20000, // pouchdb-lucene needs longer to start up.
    endpoint: "/",
    startUrl:   {
        expander: {
            func: "fluid.stringTemplate",
            args: ["%apiUrl%endpoint", { apiUrl: "{that}.options.urls.api", endpoint: "{that}.options.endpoint" }]
        }
    },
    events: {
        onFixturesConstructed: {
            events: {
                apiReady:      "apiReady",
                pouchStarted:  "pouchStarted",
                onDriverReady: "onDriverReady"
            }
        },
        onFixturesStopped: {
            events: {
                apiStopped:    "apiStopped",
                pouchStopped:  "pouchStopped",
                onDriverStopped: "onDriverStopped"
            }
        }
    }
});

fluid.defaults("gpii.test.ul.website.testEnvironment.withLucene", {
    gradeNames: ["gpii.test.ul.website.testEnvironment", "gpii.tests.ul.website.harness.withLucene"],
    events: {
        onFixturesConstructed: {
            events: {
                apiReady:      "apiReady",
                luceneStarted: "luceneStarted",
                pouchStarted:  "pouchStarted",
                onDriverReady: "onDriverReady"
            }
        },
        onFixturesStopped: {
            events: {
                apiStopped:    "apiStopped",
                luceneStopped: "luceneStopped",
                pouchStopped:  "pouchStopped",
                onDriverStopped: "onDriverStopped"
            }
        }
    }
});
