// Launch the UL API and web site.  This script expects to communicate with a properly configured CouchDB instance
// running on port 5984, and with a properly configured couchdb-lucene instance running on port 5985.
//
// See the tests in this package for a harness that loads its own gpii-pouchdb and gpii-pouchdb-lucene instance.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

var gpii  = fluid.registerNamespace("gpii");

require("../../../");

fluid.require("%gpii-pouchdb");
fluid.require("%gpii-pouchdb-lucene");
fluid.require("%gpii-express");

fluid.require("%gpii-express/tests/js/lib/test-middleware-hello.js");

fluid.registerNamespace("gpii.tests.ul.website.harness");
gpii.tests.ul.website.harness.stopServer = function (that) {
    gpii.express.stopServer(that.express);
    gpii.express.stopServer(that.pouch);
};

fluid.defaults("gpii.tests.ul.website.harness", {
    gradeNames:   ["gpii.ul.website.harness"],
    templateDirs: ["%ul-website/src/templates", "%gpii-express-user/src/templates", "%gpii-json-schema/src/templates", "%ul-website/tests/templates"],
    distributeOptions: {
        record: 30000, // Searches that hit lucene need more time, at least for the first search.
        target: "{that gpii.express.handler}.options.timeout"
    },
    events: {
        constructFixtures: null,
        pouchStarted:      null,
        pouchStopped:      null,
        onFixturesConstructed: {
            events: {
                apiReady:      "apiReady",
                pouchStarted:  "pouchStarted"
            }
        },
        onFixturesStopped: {
            events: {
                apiStopped:    "apiStopped",
                pouchStopped:  "pouchStopped"
            }
        },
        stopFixtures: null
    },
    listeners: {
        stopFixtures: {
            funcName: "gpii.tests.ul.website.harness.stopServer",
            args:     ["{that}"]
        }
    },
    components: {
        express: {
            createOnEvent: "constructFixtures",
            options: {
                components: {
                    tests: {
                        type: "gpii.express.router.static",
                        options: {
                            priority: "before:htmlErrorHandler",
                            path:    "/tests",
                            content: ["%ul-website/tests"]
                        }
                    }
                }
            }
        },
        pouch: {
            type: "gpii.express",
            createOnEvent: "constructFixtures",
            options: {
                port: "{harness}.options.ports.couch",
                listeners: {
                    onStarted: {
                        func: "{harness}.events.pouchStarted.fire"
                    },
                    onStopped: {
                        func: "{harness}.events.pouchStopped.fire"
                    }
                },
                components: {
                    pouch: {
                        type: "gpii.pouch.express",
                        options: {
                            path: "/",
                            databases: {
                                users: { data: "%ul-api/tests/data/users.json" },
                                ul:    { data: ["%ul-api/tests/data/pilot.json", "%ul-api/tests/data/deleted.json", "%ul-api/tests/data/updates.json", "%ul-api/tests/data/views.json", "%ul-api/tests/data/whetstone.json"] }
                            }
                        }
                    }
                }
            }
        }
    }
});

fluid.defaults("gpii.tests.ul.website.harness.withLucene", {
    gradeNames:   ["gpii.tests.ul.website.harness"],
    events: {
        luceneStarted:     null,
        luceneStopped:     null,
        onFixturesConstructed: {
            events: {
                apiReady:      "apiReady",
                luceneStarted: "luceneStarted",
                pouchStarted:  "pouchStarted"
            }
        },
        onFixturesStopped: {
            events: {
                apiStopped:    "apiStopped",
                luceneStopped: "luceneStopped",
                pouchStopped:  "pouchStopped"
            }
        }
    },
    components: {
        lucene: {
            type: "gpii.pouch.lucene",
            createOnEvent: "constructFixtures",
            options: {
                events: {
                    onReadyForShutdown: "{gpii.tests.ul.website.harness.withLucene}.events.stopFixtures"
                },
                port: "{gpii.tests.ul.website.harness.withLucene}.options.ports.lucene",
                dbUrl: "{gpii.tests.ul.website.harness.withLucene}.options.urls.couch",
                processTimeout: 4000,
                listeners: {
                    "onStarted.notifyParent": {
                        func: "{gpii.tests.ul.website.harness.withLucene}.events.luceneStarted.fire"
                    },
                    "onShutdownComplete.notifyParent": {
                        func: "{gpii.tests.ul.website.harness.withLucene}.events.luceneStopped.fire"
                    }
                }
            }
        }
    }
});

fluid.defaults("gpii.tests.ul.website.harness.instrumented", {
    gradeNames: ["gpii.tests.ul.website.harness"],
    components: {
        express: {
            options: {
                components: {
                    src: {
                        options: {
                            // Serve up instrumented javascript where possible. CSS files and the like will be inherited from the main source directory.
                            content: ["%ul-website/instrumented", "%ul-website/src"]
                        }
                    }
                }
            }
        }
    }
});

fluid.defaults("gpii.tests.ul.website.harness.instrumented.withLucene", {
    gradeNames: ["gpii.tests.ul.website.harness.withLucene", "gpii.tests.ul.website.harness.instrumented"]
});
