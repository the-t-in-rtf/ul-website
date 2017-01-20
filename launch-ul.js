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
            "cacheDir":     "The full or package-relative path to the directory in which we should store generated thumbnails of full-sized images.",
            "originalsDir": "The full or package-relative path to the directory in which full-sized images are stored.",
            "ports.api":    "The port the API should listen to.",
            "ports.couch":  "When running in production mode, the port on which CouchDB is running.  When running in dev mode, the port which PouchDB should listen to.",
            "ports.lucene": "When running in production mode, the port on which couchdb-lucene is running.  When running in dev mode, the port which gpii-pouchdb-lucene should listen to.",
            "setLogging":   "The level of log information to output to the console. Defaults to `false` (only warnings and errors)."
        },
        coerce: {
            setLogging: JSON.parse
        },
        help: true,
        defaults: {
            "optionsFile": "%ul-website/configs/dev.json"
        }
    }
});

gpii.ul.website.launcher();
