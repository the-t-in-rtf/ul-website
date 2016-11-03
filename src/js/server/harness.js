// Launch the UL API and web site.  This script expects to communicate with a properly configured CouchDB instance
// running on port 5984, and with a properly configured couchdb-lucene instance running on port 5985.
//
// See the tests in this package for a harness that loads its own gpii-pouchdb and gpii-pouchdb-lucene instance.
/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("../../../");

fluid.require("%gpii-express");
fluid.require("%gpii-express-user");
fluid.require("%gpii-handlebars");
fluid.require("%ul-api");

fluid.defaults("gpii.ul.website.harness", {
    gradeNames:   ["fluid.component"],
    templateDirs: ["%ul-website/src/templates", "%gpii-express-user/src/templates", "%gpii-json-schema/src/templates"],
    schemaDirs:   ["%ul-api/src/schemas", "%gpii-express-user/src/schemas"],
    ports: {
        api:    7633,
        couch:  5984,
        lucene: 5985
    },
    sessionKey:   "_ul_user",
    rules: {
        contextToExpose: {
            "layout": "layout", // This is required to support custom layouts
            "model": {
                "user":    "req.session._ul_user",
                "product": "product"
            },
            "req":  {
                "query":  "req.query",
                "params": "req.params"
            }
        }
    },
    contextToOptionsRules: {
        req:      "req",
        product:  "product",
        products: "products",
        model: {
            user:     "req.session._ul_user",
            product:  "product",
            products: "products"
        }
    },
    distributeOptions: [
        {
            source: "{that}.options.sessionKey",
            target: "{that gpii.express.handler}.options.sessionKey"
        },
        {
            source: "{that}.options.rules.contextToExpose",
            target: "{that gpii.express.singleTemplateMiddleware}.options.rules.contextToExpose"
        },
        {
            source: "{that}.options.rules.contextToExpose",
            target: "{that gpii.ul.api.htmlMessageHandler}.options.rules.contextToExpose"
        },
        {
            source: "{that}.options.rules.contextToExpose",
            target: "{that gpii.handlebars.dispatcherMiddleware}.options.rules.contextToExpose"
        }
    ],
    urls: {
        couch: {
            expander: {
                funcName: "fluid.stringTemplate",
                args:     ["http://localhost:%port/", { port: "{that}.options.ports.couch" }]
            }
        },
        lucene: {
            expander: {
                funcName: "fluid.stringTemplate",
                args:     ["http://localhost:%port/local/%dbName/_design/lucene/by_content", { port: "{that}.options.ports.lucene", dbName: "{that}.options.dbNames.ul"}]
            }
        },
        ulDb: {
            expander: {
                funcName: "fluid.stringTemplate",
                args:     ["http://localhost:%port/%dbName", { port: "{that}.options.ports.couch", dbName: "{that}.options.dbNames.ul"}]
            }
        },
        usersDb: {
            expander: {
                funcName: "fluid.stringTemplate",
                args:     ["http://localhost:%port/%dbName", { port: "{that}.options.ports.couch", dbName: "{that}.options.dbNames.users"}]
            }
        }
    },
    dbNames: {
        ul:    "ul",
        users: "users"
    },
    events: {
        apiReady:   null,
        apiStopped: null
    },
    components: {
        express: {
            type: "gpii.express.withJsonQueryParser",
            options: {
                // gradeNames: ["gpii.express.user.withRequiredMiddleware"],
                port :   "{harness}.options.ports.api",
                templateDirs: "{harness}.options.templateDirs",
                events: {
                    apiReady: null,
                    onReady: {
                        events: {
                            apiReady: "apiReady",
                            onStarted: "onStarted"
                        }
                    }
                },
                listeners: {
                    onReady:   {
                        func: "{harness}.events.apiReady.fire"
                    },
                    onStopped: {
                        func: "{harness}.events.apiStopped.fire"
                    }
                },
                components: {
                    corsHeaders: {
                        type: "gpii.express.middleware.headerSetter",
                        options: {
                            priority: "after:queryParser",
                            headers: {
                                cors: {
                                    fieldName: "Access-Control-Allow-Origin",
                                    template:  "*",
                                    dataRules: {}
                                }
                            }
                        }
                    },
                    handlebars: {
                        type: "gpii.express.hb",
                        options: {
                            priority: "after:corsHeaders",
                            templateDirs: "{harness}.options.templateDirs"
                        }
                    },
                    cookieparser: {
                        type:     "gpii.express.middleware.cookieparser",
                        options: {
                            priority: "after:handlebars"
                        }
                    },
                    session: {
                        type: "gpii.express.middleware.session",
                        options: {
                            priority: "after:cookieparser",
                            sessionOptions: {
                                secret: "Printer, printer take a hint-ter."
                            }
                        }
                    },
                    // Client-side Handlebars template bundles
                    inline: {
                        type: "gpii.handlebars.inlineTemplateBundlingMiddleware",
                        options: {
                            priority: "after:handlebars",
                            path: "/hbs",
                            templateDirs: "{harness}.options.templateDirs"
                        }
                    },
                    // NPM dependencies
                    nm: {
                        type: "gpii.express.router.static",
                        options: {
                            priority: "after:session",
                            path: "/nm",
                            content: "%ul-website/node_modules"
                        }

                    },
                    // Our own source
                    src: {
                        type: "gpii.express.router.static",
                        options: {
                            priority: "after:session",
                            path:    "/src",
                            content: "%ul-website/src"
                        }
                    },
                    // JSON Schemas, available individually
                    schemas: {
                        type: "gpii.express.router.static",
                        options: {
                            priority: "after:session",
                            path:    "/schemas",
                            content: "{harness}.options.schemaDirs"
                        }
                    },
                    // Bundled JSON Schemas for client-side validation
                    allSchemas: {
                        type: "gpii.schema.inlineMiddleware",
                        options: {
                            priority: "after:session",
                            path:       "/allSchemas",
                            schemaDirs: "{harness}.options.schemaDirs"
                        }
                    },
                    api: {
                        type: "gpii.ul.api",
                        options: {
                            priority: "after:session",
                            templateDirs: "{harness}.options.templateDirs",
                            urls:     "{harness}.options.urls",
                            listeners: {
                                "onReady.notifyParent": {
                                    func: "{harness}.events.apiReady.fire"
                                }
                            },
                            components: {
                                // Defang the "session" handling middleware included with ul-api in favor of ours.
                                session:      { type: "fluid.component" }
                            }
                        }
                    },
                    dispatcher: {
                        type: "gpii.handlebars.dispatcherMiddleware",
                        options: {
                            priority: "after:api",
                            path: ["/:template", "/"],
                            templateDirs: "{harness}.options.templateDirs",
                            rules: {
                                contextToExpose: {
                                    req:      "req",
                                    user:     "req.session._ul_user",
                                    product:  "product",
                                    products: "products"
                                }
                            }
                        }
                    },
                    htmlErrorHandler: {
                        type:     "gpii.handlebars.errorRenderingMiddleware",
                        options: {
                            priority: "after:dispatcher",
                            templateKey: "pages/error"
                        }
                    }
                }
            }
        }
    }
});
