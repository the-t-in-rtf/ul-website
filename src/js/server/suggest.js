/*

    A simple endpoint to allow users to suggest changes to an existing unified record.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.require("%gpii-express");
fluid.require("%gpii-json-schema");
fluid.require("%kettle");

fluid.defaults("gpii.ul.website.suggest.dataSource", {
    gradeNames: ["kettle.dataSource.URL"],
    url: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["%baseUrl/_design/ul/_view/products?key=%key", { baseUrl: "{gpii.ul.website.suggest}.options.urls.ulDb" }]
        }
    },
    termMap: {
        "key": "%key"
    },
    listeners: {
        // Report back to the user on failure.
        "onError.sendResponse": {
            func: "{gpii.express.handler}.sendResponse",
            args: [ 500, { message: "{arguments}.0" }] // statusCode, body
            // TODO:  Discuss with Antranig how to retrieve HTTP status codes from kettle.datasource.URL
        }
    }
});

fluid.registerNamespace("gpii.ul.website.suggest.handler");

/**
 *
 * Handle a single incoming request.  Performs an initial permission check and then requests data from CouchDB.
 *
 * @param {Object} that - The component itself.
 *
 */
gpii.ul.website.suggest.handler.handleRequest = function (that) {
    var user = that.options.request.session && that.options.request.session[that.options.sessionKey];
    var params = ["~" + user.username, that.options.request.params.uid];
    that.existingSuggestionReader.get({ key: JSON.stringify(params)});
};

/**
 *
 * Process the CouchDB response for the main record.
 *
 * @param {Object} that - The handler component itself.
 * @param {Object} couchResponse - The raw response from CouchDB.
 *
 */
gpii.ul.website.suggest.handler.processExistingSuggestionResponse = function (that, couchResponse) {
    if (!couchResponse) {
        that.sendResponse(500, { isError: true, statusCode: 500, errorMessage: that.options.errorMessages.noCouchResponse});
    }
    else if (couchResponse.rows.length === 0) {
        var params = ["unified", that.options.request.params.uid];
        that.unifiedRecordReader.get({ key: JSON.stringify(params) });
    }
    else if (couchResponse.rows.length > 1) {
        that.sendResponse(500, { isError: true, statusCode: 500, errorMessage: that.options.errorMessages.duplicateFound});
    }
    else {
        // We transform and then filter separately so that we can include all and then filter out Couch-isms like `_id`.
        var transformedOutput = fluid.model.transformWithRules(couchResponse, that.options.rules.couchResponseToJson);
        var productRecord = fluid.filterKeys(transformedOutput, that.options.couchKeysToExclude, true);
        that.sendResponse(200, { product: productRecord });
    }
};

gpii.ul.website.suggest.handler.processUnifiedRecordResponse = function (that, couchResponse) {
    if (!couchResponse) {
        that.sendResponse(500, { isError: true, statusCode: 500, errorMessage: that.options.errorMessages.noCouchResponse});
    }
    else if (couchResponse.rows.length === 0) {
        that.sendResponse(404, { isError: true, statusCode: 404, errorMessage: that.options.errorMessages.notFound});

    }
    else if (couchResponse.rows.length > 1) {
        that.sendResponse(500, { isError: true, statusCode: 500, errorMessage: that.options.errorMessages.duplicateFound});
    }
    else {
        // We transform and then filter separately so that we can include all and then filter out Couch-isms like `_id`.
        var transformedOutput = fluid.model.transformWithRules(couchResponse, that.options.rules.couchResponseToJson);
        var productRecord = fluid.filterKeys(transformedOutput, that.options.couchKeysToExclude, true);

        var user = that.options.request.session[that.options.sessionKey];
        productRecord.source = "~" + user.username;
        productRecord.status = "new";
        that.sendResponse(200, { product: productRecord });
    }
};

// Our main handler.  Looks up the underlying record using a kettle.dataSource and expects to call the
// underlying `gpii.express.handler` `that.sendResponse` invoker with the results.
fluid.defaults("gpii.ul.website.suggest.handler", {
    gradeNames: ["gpii.ul.api.htmlMessageHandler"],
    templateKey: "pages/suggest.handlebars",
    errorMessages: {
        noCouchResponse: "Could not retrieve a record from the database.  Contact an administrator for help.",
        notAuthorized: "You must log in to suggest a change to this record.",
        notFound: "Could not find a unified record matching the specified uid.",
        duplicateFound: "There was more than one record with the specified uid.  Contact an administrator for help."
    },
    members: {
        productRecord: null
    },
    couchKeysToExclude: ["_id", "_rev"],
    rules: {
        bodyToExpose: {
            "layout": "layout", // This is required to support custom layouts
            "model": {
                "product":  "product"
            }
        },
        couchResponseToJson: {
            "": "rows.0.value"
        }
    },
    components: {
        // dataSource to read our existing suggestion, if there is one.
        existingSuggestionReader: {
            type: "gpii.ul.website.suggest.dataSource",
            options: {
                listeners: {
                    // Continue processing after an initial successful read.
                    "onRead.processExistingSuggestionResponse": {
                        func: "{gpii.ul.website.suggest.handler}.processExistingSuggestionResponse",
                        args: ["{arguments}.0"] // couchResponse
                    }
                }
            }
        },
        // dataSource for "unified" records, which will be the basis for the suggested change if no custom record already exists.
        unifiedRecordReader: {
            type: "gpii.ul.website.suggest.dataSource",
            options: {
                listeners: {
                    // Finish processing after the "sources" are read
                    "onRead.processSourcesResponse": {
                        func: "{gpii.ul.website.suggest.handler}.processUnifiedRecordResponse",
                        args: ["{arguments}.0"]
                    }
                }
            }
        }
    },
    invokers: {
        handleRequest: {
            funcName: "gpii.ul.website.suggest.handler.handleRequest",
            args:     ["{that}"]
        },
        handleError: {
            func: "{that}.options.next",
            args: [{ isError: true, statusCode: 500, message: "{arguments}.0"}] // error
        },
        processExistingSuggestionResponse: {
            funcName: "gpii.ul.website.suggest.handler.processExistingSuggestionResponse",
            args:     ["{that}", "{arguments}.0"] // response
        },
        processUnifiedRecordResponse: {
            funcName: "gpii.ul.website.suggest.handler.processUnifiedRecordResponse",
            args:     ["{that}", "{arguments}.0"] // response
        }
    }
});

fluid.defaults("gpii.ul.website.suggest", {
    gradeNames: ["gpii.express.router"],
    method:     "get",
    // Support all variations, including those with missing URL params so that we can return appropriate error feedback.
    path:       ["/suggest/:uid", "/suggest"],
    routerOptions: {
        mergeParams: true
    },
    rules: {
        requestContentToValidate: {
            "uid": "params.uid"
        }
    },
    distributeOptions: [
        {
            source: "{that}.options.rules.requestContentToValidate",
            target: "{that gpii.express.handler}.options.rules.requestContentToValidate"
        },
        {
            source: "{that}.options.rules.requestContentToValidate",
            target: "{that gpii.schema.validationMiddleware}.options.rules.requestContentToValidate"
        }
    ],
    components: {
        loginRequired: {
            type: "gpii.express.user.middleware.loginRequired",
            options: {
                sessionKey: "_ul_user"
            }
        },
        validationMiddleware: {
            type: "gpii.schema.validationMiddleware",
            options: {
                priority:   "after:loginRequired",
                namespace:  "validationMiddleware",
                schemaKey:  "ul-suggest-input.json"
            }
        },
        // We let JSON errors fall back to a more general handler, but render HTML errors ourselves
        renderedValidationError: {
            type: "gpii.handlebars.errorRenderingMiddleware",
            options: {
                priority:    "after:validationMiddleware",
                templateKey: "pages/validation-error"
            }
        },
        requestAwareMiddleware: {
            type: "gpii.express.middleware.requestAware",
            options: {
                method:        "use",
                priority:      "after:renderedValidationError",
                handlerGrades: ["gpii.ul.website.suggest.handler"]
            }
        }
    }
});
