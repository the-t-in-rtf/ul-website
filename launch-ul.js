// A "test harness" that launches the website, API, along with a preconfigured gpii-pouchdb and gpii-pouchdb-lucene instance.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

var gpii  = fluid.registerNamespace("gpii");
require("./src/js/server/harness");

require("gpii-launcher");

fluid.defaults("gpii.ul.website.launcher", {
    gradeNames: ["gpii.launcher"],
    includeOptions: false,
    listeners: {
        "onOptionsMerged.launch": {
            funcName: "gpii.ul.website.harness",
            args:     ["{arguments}.0"]
        }
    }
});

gpii.ul.website.launcher();
