// A "test harness" that launches the website, API, along with a preconfigured gpii-pouchdb and gpii-pouchdb-lucene instance.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);
fluid.logObjectRenderChars = 20480;

var gpii  = fluid.registerNamespace("gpii");
require("./");

require("gpii-launcher");

fluid.defaults("gpii.ul.website.launcher", {
    gradeNames: ["gpii.launcher"],
    filterKeys:false,
    yargsOptions: {
        env: true,
        describe: {
            "cacheDir":     "The full or package-relative path to the directory in which we should store generated thumbnails of full-sized images.",
            "originalsDir": "The full or package-relative path to the directory in which full-sized images are stored.",
            "hosts.api":    "The hostname the API is running on.",
            "hosts.couch":  "The hostname of the CouchDB instance.",
            "hosts.lucene": "The hostname of the couchdb-lucene instance.",
            "hosts.smtp":   "The hostname of the mail server.",
            "ports.api":    "The port the API should listen to.",
            "ports.couch":  "When running in production mode, the port on which CouchDB is running.  When running in dev mode, the port which PouchDB should listen to.",
            "ports.lucene": "When running in production mode, the port on which couchdb-lucene is running.  When running in dev mode, the port which gpii-pouchdb-lucene should listen to.",
            "ports.smtp":   "The port on which the mail service is running.",
            "setLogging":   "The level of log information to output to the console. Defaults to `false` (only warnings and errors)."
        },
        coerce: {
            setLogging: JSON.parse
        },
        help: true,
        defaults: {
            "optionsFile": "%ul-website/configs/prod.json"
        }
    }
});

gpii.ul.website.launcher();
