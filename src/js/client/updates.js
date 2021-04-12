// The "updates" report for database vendors
(function (fluid) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    // Transform function to strip "unified" from the list, as we cannot compare unified to itself.
    fluid.registerNamespace("gpii.ul.updates.controls");
    gpii.ul.updates.controls.excludeUnifiedSource = function (sources) {
        return sources.filter(function (value) { if (value !== "unified") { return true; }});
    };

    // The "source picker", which is also responsible for getting the list of valid sources.
    fluid.defaults("gpii.ul.updates.controls", {
        gradeNames: ["fluid.handlebars.ajaxCapable", "fluid.handlebars.templateAware"],
        templateKey: "updates-controls",
        ajaxOptions: {
            method:   "GET",
            url:      "/api/sources",
            dataType: "json",
            headers:  { accept: "application/json" }
        },
        rules: {
            successResponseToModel: {
                "": "notfound",
                "errorMessage": { literalValue: false },
                "sources": {
                    transform: {
                        type:      "gpii.ul.updates.controls.excludeUnifiedSource",
                        inputPath: "responseJSON.sources"
                    }
                }
            },
            modelToRequestPayload: {
                "": "notfound"
            }
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: ["container", "{that}.options.templateKey", "{that}.model"] // selector, template, data, manipulator
            }
        },
        listeners: {
            "onCreate.getAvailableSources": {
                func: "{that}.makeRequest"
            },
            "requestReceived.refresh": {
                func: "{that}.renderInitialMarkup"
            }
        },
        modelListeners: {
            user: {
                func: "{that}.makeRequest",
                excludeSource: ["init"] // We already check on startup regardless
            }
        },
        selectors: {
            "container":    "",
            "updatedSince": ".ul-updates-updatedSince-control",
            "sources":      ".ul-updates-sources-control",
            "sourceNewer":  "input[name='ul-updates-sourceNewer-control']"
        },
        bindings: [
            {
                selector:    "updatedSince",
                path:        "updatedSince",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "fluid.binder.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            {
                selector:    "sources",
                path:        "sources"
            },
            {
                selector:    "sourceNewer",
                path:        "sourceNewer",
                rules: {
                    domToModel: {
                        "": {
                            transform: {
                                type:  "fluid.transforms.stringToBoolean",
                                inputPath: ""
                            }
                        }
                    },
                    modelToDom: {
                        "": {
                            transform: {
                                type:  "fluid.transforms.booleanToString",
                                inputPath: ""
                            }
                        }
                    }
                }
            }
        ]
    });

    fluid.registerNamespace("gpii.ul.updates");

    gpii.ul.updates.filterAndEncode = function (payload) {
        var filtered = fluid.filterKeys(payload, ["sources", "updatedSince", "sourceNewer"]);
        return fluid.express.querystring.encodeObject(filtered);
    };

    fluid.defaults("gpii.ul.updates.filterAndEncode", {
        gradeNames: ["fluid.standardTransformFunction"]
    });


    fluid.defaults("gpii.ul.updates", {
        gradeNames: ["fluid.schema.client.errorAwareForm"],
        hideOnSuccess: false,
        hideOnError:   false,
        ajaxOptions: {
            method:      "GET",
            url:         "/api/updates",
            dataType:    "json",
            headers: {
                "accept": "application/json"
            },
            traditional: true // We are passing array data, whose variable name jQuery will mangle without this option.
        },
        templateKeys: {
            "initial": "updates-viewport"
        },
        rules: {
            // Rules to control how a successful response is applied to the model.
            successResponseToModel: {
                "":           "notfound",
                products:     "responseJSON.products",
                errorMessage: { literalValue: false }
            },
            // Rules to control how our model is parsed before making a request
            modelToRequestPayload: {
                "": {
                    transform: {
                        type:      "gpii.ul.updates.filterAndEncode",
                        inputPath: ""
                    }
                }
            }
        },
        selectors: {
            "initial":  ".ul-updates-viewport",
            "error":    ".ul-updates-error",
            "controls": ".ul-updates-controls",
            "output":   ".ul-updates-output"
        },
        components: {
            // Disable the built-in success message, as we only ever display errors.
            success: {
                type: "fluid.emptySubcomponent"
            },
            fieldControls: {
                type:          "gpii.ul.updates.controls",
                container:     "{updates}.dom.controls",
                createOnEvent: "{updates}.events.onMarkupRendered",
                options: {
                    model: {
                        sources:      "{updates}.model.sources",
                        updatedSince: "{updates}.model.updatedSince",
                        sourceNewer:  "{updates}.model.sourceNewer",
                        user:         "{updates}.model.user",
                        errorMessage: "{updates}.model.errorMessage"  // Allow this component to display error messages if there are problems.
                    }
                }
            },
            output: {
                type: "fluid.handlebars.templateMessage",
                container: "{updates}.options.selectors.output",
                createOnEvent: "{updates}.events.onMarkupRendered",
                options: {
                    templateKey: "updates-products",
                    model: {
                        user:    "{updates}.model.user",
                        message: "{updates}.model.products"
                    }
                }
            }
        },
        model: {
            sources:      [],
            products:     false,
            errorMessage: null,
            updatedSince: new Date(0),
            sourceNewer:  true
        },
        modelListeners: {
            sources: {
                func:          "{that}.makeRequest",
                excludeSource: "init"
            },
            updatedSince: {
                func:          "{that}.makeRequest",
                excludeSource: "init"
            },
            sourceNewer: {
                func:          "{that}.makeRequest",
                excludeSource: "init"
            }
        }
    });
})(fluid);
