// Launch the UL API and web site.  This script expects to communicate with a properly configured CouchDB instance
// running on port 5984, and with a properly configured couchdb-lucene instance running on port 5985.
//
// See the tests in this package for a harness that loads its own fluid-pouchdb and fluid-pouchdb-lucene instance.
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%ul-website");

fluid.require("%fluid-express");
fluid.require("%fluid-express-user");
fluid.require("%fluid-handlebars");
fluid.require("%fluid-json-schema");

fluid.require("%ul-api");
fluid.require("%ul-api/src/js/harness.js");

require("./suggest");
require("./fourohfour");

fluid.defaults("gpii.ul.website.harness", {
    gradeNames:   ["gpii.ul.api.harness"],
    messageDirs:  {
        validation: "%fluid-json-schema/src/messages",
        user: "%fluid-express-user/src/messages"
    },
    templateDirs: {
        website: {
            path: "%ul-website/src/templates"
        },
        user: {
            path: "%fluid-express-user/src/templates",
            priority: "after:website"
        },
        validation: {
            priority: "after:user",
            path: "%fluid-json-schema/src/templates"
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
            target: "{that fluid.express.singleTemplateMiddleware}.options.rules.contextToExpose"
        },
        {
            source: "{that}.options.rules.contextToExpose",
            target: "{that gpii.ul.api.htmlMessageHandler}.options.rules.contextToExpose"
        },
        {
            source: "{that}.options.rules.contextToExpose",
            target: "{that fluid.handlebars.dispatcherMiddleware}.options.rules.contextToExpose"
        },
        {
            source: "{that}.options.app",
            target: "{that fluid.express.user.withMailHandler}.options.app"
        },
        // Pass through the mail hostname to the mailer used by fluid-express-user.
        {
            source: "{that}.options.ports.smtp",
            target: "{that fluid.express.user.mailer}.options.transportOptions.port"
        },
        {
            source: "{that}.options.hosts.smtp",
            target: "{that fluid.express.user.mailer}.options.transportOptions.host"
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
                        type: "fluid.express.middleware.headerSetter",
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
                        type: "fluid.express.hb",
                        options: {
                            priority: "after:corsHeaders",
                            templateDirs: "{harness}.options.templateDirs",
                            model: {
                                messageBundles: "{messageBundleLoader}.model.messageBundles"
                            }
                        }
                    },
                    cookieparser: {
                        type:     "fluid.express.middleware.cookieparser",
                        options: {
                            priority: "after:handlebars"
                        }
                    },
                    session: {
                        type: "fluid.express.middleware.session",
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
                                cookieparser: "{fluid.express}.cookieparser",
                                session: "{fluid.express}.session"
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
                        type: "fluid.express.router.static",
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
                        type: "fluid.handlebars.dispatcherMiddleware",
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
                        type:     "fluid.handlebars.errorRenderingMiddleware",
                        options: {
                            priority: "last",
                            templateKey: "pages/error"
                        }
                    },
                    messageBundleLoader: {
                        type: "fluid.handlebars.i18n.messageBundleLoader",
                        options: {
                            messageDirs: "{harness}.options.messageDirs"
                        }
                    },
                    messages: {
                        type: "fluid.handlebars.inlineMessageBundlingMiddleware",
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
