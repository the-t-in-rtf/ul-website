// A "test harness" that launches the website, API, along with a preconfigured gpii-pouchdb and gpii-pouchdb-lucene instance.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

var gpii  = fluid.registerNamespace("gpii");
require("./");

require("gpii-launcher");

fluid.defaults("gpii.ul.website.launcher", {
    gradeNames: ["gpii.launcher"],
    yargsOptions: {
        describe: {
            "ports": "The ports (ports.api, ports.couch, and ports.lucene) used by this instance."
        },
        help: true,
        defaults: {
            "optionsFile": "%ul-website/configs/dev.json"
        }
    }
});

gpii.ul.website.launcher();
