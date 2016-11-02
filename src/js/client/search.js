// Basic search component for the Unified Listing
/* global fluid */
(function () {
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
                        type: "gpii.ul.filterAndEncode",
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
        templates: {
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
        gradeNames: ["gpii.handlebars.templateAware"],
        events: {
            onStartLoading: null,
            onStopLoading:  null
        },
        model: {
            q:               "",
            sources:         [],
            statuses:        [ "new", "active", "discontinued"],
            sortBy:           "/name",
            offset:           0,
            limit:            250,
            totalRows:        0,
            unified:          true,
            includeSources:   true,
            products:         []
        },
        components: {
            // The component that relays changes between the URL, browser history, and model
            relay: {
                type: "gpii.locationBar",
                options: {
                    model: {
                        "q": "{gpii.ul.search}.model.q",
                        "sources": "{gpii.ul.search}.model.sources",
                        "statuses": "{gpii.ul.search}.model.statuses",
                        "sortBy": "{gpii.ul.search}.model.sortBy",
                        "offset": "{gpii.ul.search}.model.offset",
                        "limit": "{gpii.ul.search}.model.limit",
                        "unified": "{gpii.ul.search}.model.unified",
                        "includeSources": "{gpii.ul.search}.model.includeSources"
                    }
                }
            },
            // The main query form
            query: {
                type:          "gpii.ul.search.query",
                createOnEvent: "{gpii.ul.search}.events.onDomChange",
                container:     "{search}.dom.form",
                options: {
                    model: "{search}.model"
                }
            },
            // The search results, if any
            products: {
                type:          "gpii.ul.search.products",
                createOnEvent: "{gpii.ul.search}.events.onDomChange",
                container:     "{search}.dom.products",
                options: {
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
                    }
                }
            },
            // The sort controls
            sortBy: {
                type:          "gpii.ul.sortBy",
                createOnEvent: "{gpii.ul.search}.events.onDomChange",
                container:     "{search}.dom.sortBy",
                options: {
                    model: {
                        select:   "{search}.model.sortBy"
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
        templates: {
            "initial": "search-viewport"
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: [ "initial", "{that}.options.templates.initial", "{that}.model"]
            }
        }
    });

    fluid.defaults("gpii.ul.search.hasUserControls", {
        gradeNames: ["gpii.ul.search", "gpii.ul.hasUserControls"]
    });
})();
