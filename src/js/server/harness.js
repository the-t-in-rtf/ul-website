// Launch the UL API and web site.  This script expects to communicate with a properly configured CouchDB instance
// running on port 5984, and with a properly configured couchdb-lucene instance running on port 5985.
//
// See the tests in this package for a harness that loads its own gpii-pouchdb and gpii-pouchdb-lucene instance.
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%ul-website");

fluid.require("%gpii-express");
fluid.require("%gpii-express-user");
fluid.require("%gpii-handlebars");
fluid.require("%gpii-json-schema");

fluid.require("%ul-api");
fluid.require("%ul-api/src/js/harness.js");

require("./suggest");
require("./fourohfour");

fluid.defaults("gpii.ul.website.harness", {
    gradeNames:   ["gpii.ul.api.harness"],
    messageDirs:  {
        validation: "%gpii-json-schema/src/messages",
        user: "%gpii-express-user/src/messages"
    },
    templateDirs: {
        website: {
            path: "%ul-website/src/templates"
        },
        user: {
            path: "%gpii-express-user/src/templates",
            priority: "after:website"
        },
        validation: {
            priority: "after:user",
            path: "%gpii-json-schema/src/templates"
        },
        api: {
            path: "%ul-api/src/templates",
            priority: "after:validation"
        }
    },
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
        },
        {
            source: "{that}.options.app",
            target: "{that gpii.express.user.withMailHandler}.options.app"
        },
        // Pass through the mail hostname to the mailer used by gpii-express-user.
        {
            source: "{that}.options.ports.smtp",
            target: "{that gpii.express.user.mailer}.options.transportOptions.port"
        },
        {
            source: "{that}.options.hosts.smtp",
            target: "{that gpii.express.user.mailer}.options.transportOptions.host"
        }
    ],
    components: {
        express: {
            options: {
                port : "{harness}.options.ports.api",
                templateDirs: "{harness}.options.templateDirs",
                events: {
                    apiReady: null,
                    suggestReady: null,
                    onReady: {
                        events: {
                            apiReady: "apiReady",
                            onStarted: "onStarted",
                            suggestReady: "suggestReady"
                        }
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
                    // TODO: The API also has a handlebars instance.
                    handlebars: {
                        type: "gpii.express.hb",
                        options: {
                            priority: "after:corsHeaders",
                            templateDirs: "{harness}.options.templateDirs",
                            model: {
                                messageBundles: "{messageBundleLoader}.model.messageBundles"
                            }
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
                    api: {
                        options: {
                            priority:     "after:session",
                            templateDirs: "{harness}.options.templateDirs",
                            components: {
                                cookieparser: "{gpii.express}.cookieparser",
                                session: "{gpii.express}.session"
                            }
                        }
                    },
                    // 404 for favicon.ico
                    favicon: {
                        type: "gpii.ul.website.middleware.fourohfour",
                        options: {
                            priority: "before:dispatcher",
                            path:     "/favicon.ico"
                        }
                    },
                    // Our own source
                    src: {
                        type: "gpii.express.router.static",
                        options: {
                            priority: "before:dispatcher",
                            path:    "/src",
                            content: "%ul-website/src"
                        }
                    },
                    modules: {
                        options: {
                            content: "%ul-website/node_modules"
                        }
                    },
                    inline: {
                        options: {
                            priority: "before:dispatcher"
                        }
                    },
                    dispatcher: {
                        type: "gpii.handlebars.dispatcherMiddleware",
                        options: {
                            priority: "before:htmlErrorHandler",
                            path: ["/:template", "/"],
                            method: "get",
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
                            priority: "last",
                            templateKey: "pages/error"
                        }
                    },
                    messageBundleLoader: {
                        type: "gpii.handlebars.i18n.messageBundleLoader",
                        options: {
                            messageDirs: "{harness}.options.messageDirs"
                        }
                    },
                    messages: {
                        type: "gpii.handlebars.inlineMessageBundlingMiddleware",
                        options: {
                            messageDirs: "{harness}.options.messageDirs",
                            model: {
                                messageBundles: "{messageBundleLoader}.model.messageBundles"
                            }
                        }
                    }
                }
            }
        }
    }
});
