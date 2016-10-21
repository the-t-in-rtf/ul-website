// Launch the UL API and web site.  This script expects to communicate with a properly configured CouchDB instance
// running on port 5984, and with a properly configured couchdb-lucene instance running on port 5985.
//
// See the tests in this package for a harness that loads its own gpii-pouchdb and gpii-pouchdb-lucene instance.
/* eslint-env node */
"use strict";
var fluid = require("infusion");

var gpii  = fluid.registerNamespace("gpii");

require("../../../");

fluid.require("%gpii-pouchdb");
fluid.require("%gpii-pouchdb-lucene");

fluid.registerNamespace("gpii.tests.ul.website.harness");
gpii.tests.ul.website.harness.stopServer = function (that) {
    gpii.express.stopServer(that.express);
    gpii.express.stopServer(that.pouch);

    that.lucene.events.onReadyForShutdown.fire();
};

fluid.defaults("gpii.tests.ul.website.harness", {
    gradeNames:   ["gpii.ul.website.harness"],
    ports: {
        api:    7217,
        couch:  7218,
        lucene: 7219
    },
    events: {
        constructFixtures: null,
        pouchStarted:      null,
        pouchStopped:      null,
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
            createOnEvent: "constructFixtures"
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
        },
        lucene: {
            type: "gpii.pouch.lucene",
            createOnEvent: "constructFixtures",
            options: {
                port: "{harness}.options.ports.lucene",
                dbUrl: "{harness}.options.urls.couch",
                processTimeout: 4000,
                listeners: {
                    "onStarted.notifyParent": {
                        func: "{harness}.events.luceneStarted.fire"
                    },
                    "onShutdownComplete.notifyParent": {
                        func: "{harness}.events.luceneStopped.fire"
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
