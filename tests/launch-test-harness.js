// A "test harness" that launches the website, API, along with a preconfigured gpii-pouchdb and gpii-pouchdb-lucene instance.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

var gpii  = fluid.registerNamespace("gpii");
require("../");

require("gpii-launcher");

gpii.ul.website.loadTestingSupport();

fluid.defaults("gpii.tests.ul.website.harness.launchOnCreation", {
    gradeNames: ["gpii.tests.ul.website.harness"],
    listeners: {
        "onCreate.constructFixtures": {
            func: "{that}.events.constructFixtures.fire"
        }
    }
});

fluid.defaults("gpii.tests.ul.website.launcher", {
    gradeNames: ["gpii.launcher"],
    includeOptions: false,
    listeners: {
        "onOptionsMerged.launch": {
            funcName: "gpii.tests.ul.website.harness.launchOnCreation",
            args:     ["{arguments}.0"]
        }
    }
});

gpii.tests.ul.website.launcher();
