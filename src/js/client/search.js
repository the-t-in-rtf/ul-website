// Basic search component for the Unified Listing
(function (fluid) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.ul.search.query");

    gpii.ul.search.query.refreshOnUpdateIfHasQuery = function (that) {
        if (that.model.q) {
            that.applier.change("offset", 0);
            gpii.ul.search.query.refreshIfHasQuery(that);
        }
    };

    gpii.ul.search.query.refreshIfHasQuery = function (that) {
        if (that.model.q) {
            that.submitForm();
        }
    };

    gpii.ul.search.query.submitForm = function (that, event) {
        // Fire an event that other components can listen to, for example, so that the products component can toggle a "loading..." message.
        // TODO:  Make our client-side dataSource fire an event that we can listen to instead of handling it this way.
        that.events.onStartLoading.fire();

        gpii.handlebars.templateFormControl.submitForm(that, event);
    };

    fluid.defaults("gpii.ul.search.query", {
        gradeNames: ["gpii.handlebars.templateFormControl"],
        hideOnSuccess: false,
        hideOnError: false,
        ajaxOptions: {
            url:      "/api/search",
            method:   "GET",
            dataType: "json",
            headers: {
                accept: "application/json"
            }
        },
        components: {
            error: {
                options: {
                    templateKey: "common-error"
                }
            }
        },
        rules: {
            successResponseToModel: {
                "":           "notfound",
                products:     "responseJSON.products", // The "products" component will handle displaying products.
                totalRows:    "responseJSON.products.length",
                errorMessage: { literalValue: false }
            },
            errorResponseToModel: {
                successMessage: { literalValue: false },
                totalRows:      { literalValue: 0 },
                products:       { literalValue: [] }
            },
            modelToRequestPayload: {
                "": {
                    transform: {
                        type: "gpii.ul.transforms.filterAndEncode",
                        inputPath: ""
                    }
                }
            }
        },
        selectors: {
            initial: "",
            form:    ".search-query-form",
            success: ".search-query-success",
            error:   ".search-query-error",
            q:       ".search-query-string",
            submit:  ".search-query-submit"
        },
        templateKeys: {
            initial: "search-query",
            success: "common-success",
            error:   "common-error"
        },
        bindings: {
            q: "q"
        },
        events: {
            onStartLoading: "{gpii.ul.search}.events.onStartLoading",
            onStopLoading:  "{gpii.ul.search}.events.onStopLoading"
        },
        invokers: {
            submitForm: {
                funcName: "gpii.ul.search.query.submitForm",
                args:     ["{that}", "{arguments}.0"]
            }
        },
        modelListeners: {
            q: {
                funcName:      "gpii.ul.search.query.refreshOnUpdateIfHasQuery",
                excludeSource: "init",
                args:          ["{that}"]
            },
            sortBy: {
                funcName:      "gpii.ul.search.query.refreshOnUpdateIfHasQuery",
                excludeSource: "init",
                args:          ["{that}"]
            },
            statuses: {
                funcName:      "gpii.ul.search.query.refreshOnUpdateIfHasQuery",
                excludeSource: "init",
                args:          ["{that}"]
            }
        },
        listeners: {
            "onCreate.fireIfReady": {
                funcName:      "gpii.ul.search.query.refreshIfHasQuery",
                args:          ["{that}"]
            },
            "requestReceived.notifyParent": {
                func: "{that}.events.onStopLoading.fire"
            }
        }
    });

    fluid.registerNamespace("gpii.ul.search.products");

    gpii.ul.search.products.toggleLoading = function (that, state) {
        var resultsElement = that.locate("products");
        resultsElement.toggleClass("loading", state);
    };

    fluid.defaults("gpii.ul.search.products", {
        gradeNames: ["gpii.ul.productsTable"],
        events: {
            onStartLoading: "{gpii.ul.search}.events.onStartLoading",
            onStopLoading:  "{gpii.ul.search}.events.onStopLoading"
        },
        listeners: {
            "onStartLoading": {
                funcName: "gpii.ul.search.products.toggleLoading",
                args:     ["{that}", true]
            },
            "onStopLoading": {
                funcName: "gpii.ul.search.products.toggleLoading",
                args:     ["{that}", false]
            }
        }
    });

    // The wrapper component that wires together all controls.
    fluid.defaults("gpii.ul.search", {
        gradeNames: ["gpii.handlebars.templateAware.serverResourceAware"],
        events: {
            onResultsRefreshed: null,
            onStartLoading:     null,
            onStopLoading:      null
        },
        distributeOptions: [{
            record: "{gpii.ul.search}.renderer",
            target: "{that > gpii.ul.api.client.images.knitter}.options.components.renderer"
        }],
        model: {
            q:               "",
            sources:         [],
            statuses:        [ "new", "active", "discontinued"],
            sortBy:           "",
            offset:           0,
            limit:            25,
            totalRows:        0,
            unified:          true,
            includeSources:   true,
            products:         []
        },
        components: {
            // TODO: This is currently broken, it results in some kind of feedback loop with the binder, and propagates the user data to the location bar.
            // The component that relays changes between the URL, browser history, and model
            //relay: {
            //    type: "gpii.locationBar",
            //    options: {
            //        model: {
            //            q:               "",
            //            sources:         [],
            //            statuses:        [ "new", "active", "discontinued"],
            //            sortBy:           "",
            //            offset:           0,
            //            limit:            25,
            //            totalRows:        0,
            //            unified:          true,
            //            includeSources:   true,
            //            products:         []
            //        }
            //    }
            //},
            // The main query form
            query: {
                type:          "gpii.ul.search.query",
                createOnEvent: "{gpii.ul.search}.events.onDomChange",
                container:     "{search}.dom.form",
                options: {
                    model: "{search}.model",
                    listeners: {
                        "onCreate.renderInitialMarkup": {
                            func: "{that}.renderInitialMarkup"
                        }
                    }
                }
            },
            // The search results, if any
            products: {
                type:          "gpii.ul.search.products",
                createOnEvent: "{gpii.ul.search}.events.onDomChange",
                container:     "{search}.dom.products",
                options: {
                    listeners: {
                        "onDomChange.notifyParent": {
                            func: "{gpii.ul.search}.events.onResultsRefreshed.fire"
                        },
                        "onCreate.renderInitialMarkup": {
                            func: "{that}.renderInitialMarkup"
                        }
                    },
                    model: {
                        products: "{search}.model.products",
                        offset:  "{search}.model.offset",
                        limit:   "{search}.model.limit"
                    }
                }
            },
            // The top pagination bar.
            topnav: {
                type:          "gpii.ul.navbar",
                createOnEvent: "{gpii.ul.search}.events.onDomChange",
                container:     "{search}.dom.topnav",
                options: {
                    model: {
                        totalRows: "{search}.model.totalRows",
                        offset:    "{search}.model.offset",
                        limit:     "{search}.model.limit"
                    },
                    listeners: {
                        "onCreate.renderInitialMarkup": {
                            func: "{that}.renderInitialMarkup"
                        }
                    }
                }
            },
            // TODO:  Try drawing both controls with a single selector and component
            // The bottom pagination bar
            bottomnav: {
                type:          "gpii.ul.navbar",
                createOnEvent: "{gpii.ul.search}.events.onDomChange",
                container:     "{search}.dom.bottomnav",
                options: {
                    model: {
                        totalRows: "{search}.model.totalRows",
                        offset:    "{search}.model.offset",
                        limit:     "{search}.model.limit"
                    },
                    listeners: {
                        "onCreate.renderInitialMarkup": {
                            func: "{that}.renderInitialMarkup"
                        }
                    }
                }
            },
            // The sort controls
            sortBy: {
                type:          "gpii.ul.sortBy.search",
                createOnEvent: "{gpii.ul.search}.events.onDomChange",
                container:     "{search}.dom.sortBy",
                options: {
                    model: {
                        select:   "{search}.model.sortBy"
                    },
                    listeners: {
                        "onCreate.renderInitialMarkup": {
                            func: "{that}.renderInitialMarkup"
                        }
                    }
                }
            },
            // The statuses filtering controls
            statuses: {
                type:          "gpii.ul.statuses",
                createOnEvent: "{gpii.ul.search}.events.onDomChange",
                container:     "{search}.dom.statuses",
                options: {
                    model: {
                        checkboxValue: "{search}.model.statuses"
                    },
                    listeners: {
                        "onCreate.renderInitialMarkup": {
                            func: "{that}.renderInitialMarkup"
                        }
                    }
                }
            },
            // The "products per page" controls
            limit: {
                type:          "gpii.ul.limit",
                createOnEvent: "{gpii.ul.search}.events.onDomChange",
                container:     "{search}.dom.limit",
                options: {
                    model: {
                        select:   "{search}.model.limit"
                    },
                    listeners: {
                        "onCreate.renderInitialMarkup": {
                            func: "{that}.renderInitialMarkup"
                        }
                    }
                }
            },
            // A toggle to show/hide the search options
            optionsToggle: {
                type: "gpii.ul.toggle",
                createOnEvent: "{gpii.ul.search}.events.onDomChange",
                container:     "{search}.container",
                options: {
                    selectors: {
                        toggle:    ".search-options-toggle",
                        container: ".search-options"
                    },
                    toggles: {
                        container: true
                    },
                    listeners: {
                        "onCreate.applyBindings": "{that}.events.onRefresh"
                    }
                }
            }
            // TODO: Get this working again if anyone really wants it.
            // The image "knitter" that associates images with individual search results
            //knitter: {
            //    type: "gpii.ul.api.client.images.knitter",
            //    container: "{that}.container",
            //    options: {
            //        events: {
            //            onResultsRefreshed: "{search}.events.onResultsRefreshed"
            //        }
            //    }
            //}
        },
        selectors: {
            initial:   ".search-viewport",
            success:   ".search-success",
            error:     ".search-error",
            form:      ".search-query",
            topnav:    ".search-topnav",
            products:  ".search-products",
            sortBy:    ".search-sortBy",
            statuses:  ".search-statuses",
            limit:     ".search-limit",
            bottomnav: ".search-bottomnav"
        },
        templateKeys: {
            "initial": "search-viewport"
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: [ "initial", "{that}.options.templateKeys.initial", "{that}.model"]
            }
        },
        // TODO: Why do we have to do this manually?  It should have happened automatically.
        listeners: {
            "onRendererAvailable.renderMarkup": {
                func: "{that}.renderInitialMarkup"
            }
        }
    });

    fluid.defaults("gpii.ul.search.hasUserControls", {
        gradeNames: ["gpii.ul.search", "gpii.ul.hasUserControls"]
    });
})(fluid);
