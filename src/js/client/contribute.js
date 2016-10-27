// TODO:  Figure out what happens when a user contributes changes to the same product a second time.
// Component to allow end users to contribute changes, which can be reviewed and incorporated into the unified record.
/* global fluid */
(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.ul.contribute.form");
    gpii.ul.contribute.form.setSource = function (that) {
        var source = that.model.user ? "~" + that.model.user.username : undefined;
        that.applier.change("product.source", source);
    };

    // TODO: Make this better able to handle JSON input failures
    // The component that handles data entry, including saving changes.
    fluid.defaults("gpii.ul.contribute.form", {
        gradeNames: ["gpii.schemas.client.errorAwareForm"],
        schemaKey:  "product-update-input.json",
        hideOnSuccess: false,
        hideOnError:   false,
        ajaxOptions: {
            url:      "/api/product/",
            method:   "PUT",
            contentType: "application/json",
            headers: {
                accept: "application/json"
            },
            dataType: "json"
        },
        model: {
            product: {
                sid: "{that}.id"
            }
        },
        rules: {
            // TODO:  Clean this up as it prevents client-side validation
            modelToRequestPayload: {
                "": {
                    transform: {
                        type:      "fluid.transforms.objectToJSONString",
                        inputPath: "product"
                    }
                }
            },
            successResponseToModel: {
                "":             "notfound",
                product:         "responseJSON.product",
                successMessage: { literalValue: "Your submission has been saved.  You may continue revising this or close the window."},
                errorMessage:   { literalValue: null }
            },
            errorResponseToModel: {
                successMessage: { literalValue: null }
            }
        },
        selectors: {
            initial:          "",
            name:             ".contribute-form-name",
            description:      ".contribute-form-description",
            manufacturerName: ".contribute-form-manufacturer-name",
            address:          ".contribute-form-manufacturer-address",
            cityTown:         ".contribute-form-manufacturer-citytown",
            provinceRegion:   ".contribute-form-manufacturer-provinceregion",
            postalCode:       ".contribute-form-manufacturer-postalcode",
            country:          ".contribute-form-manufacturer-country",
            email:            ".contribute-form-manufacturer-email",
            phone:            ".contribute-form-manufacturer-phone",
            url:              ".contribute-form-manufacturer-url",
            source:           ".contribute-form-source",
            submit:           ".contribute-form-submit",
            settingsDesc:     ".contribute-form-settings-description",
            pricing:          ".contribute-form-pricing",
            settingsStorage:  ".contribute-form-settings-storage",
            settingsRestart:  ".contribute-form-settings-restart"
        },
        bindings: {
            name: {
                selector: "name",
                path:     "product.name",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.schemas.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            description: {
                selector: "description",
                path:     "product.description",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.schemas.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            source: "product.source",
            manufacturerName: {
                selector: "manufacturerName",
                path:     "product.manufacturer.name",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.schemas.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            address: {
                selector: "address",
                path:     "product.manufacturer.address",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.schemas.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            cityTown: {
                selector: "cityTown",
                path:     "product.manufacturer.cityTown",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.schemas.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            provinceRegion: {
                selector: "provinceRegion",
                path:     "product.manufacturer.provinceRegion",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.schemas.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            postalCode: {
                selector: "postalCode",
                path:     "product.manufacturer.postalCode",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.schemas.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            country: {
                selector: "country",
                path:     "product.manufacturer.country",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.schemas.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            email: {
                selector: "email",
                path:     "product.manufacturer.email",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.schemas.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            phone: {
                selector: "phone",
                path:     "product.manufacturer.phone",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.schemas.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            url: {
                selector: "url",
                path:     "product.manufacturer.url",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.schemas.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            settingsDesc:     "product.sourceData.settings.description",
            pricing:          "product.sourceData.pricing",
            settingsStorage:  "product.sourceData.settings.storage",
            settingsRestart:  "product.sourceData.settings.restart"
        },
        errorBindings: {
            name:             "name",
            description:      "description",
            source:           "source",
            manufacturerName: "manufacturer.name",
            address:          "manufacturer.address",
            cityTown:         "manufacturer.cityTown",
            provinceRegion:   "manufacturer.provinceRegion",
            postalCode:       "manufacturer.postalCode",
            country:          "manufacturer.country",
            email:            "manufacturer.email",
            phone:            "manufacturer.phone",
            url:              "manufacturer.url"
        },
        templates: {
            initial: "contribute-form"
        },
        events: {
            never: null
        },
        components: {
            // We defer to the parent's feedback components and disable those included in `templateFormControl` by default.
            error:   { createOnEvent: "never"},
            success: { createOnEvent: "never"}
        },
        modelListeners: {
            "user": {
                funcName: "gpii.ul.contribute.form.setSource",
                args:     ["{that}"]
            }
        }
    });

    // The main container that handles the initial load and is a gatekeeper for rendering and displaying the data entry form.
    fluid.registerNamespace("gpii.ul.contribute");

    // We can only retrieve existing product data if we have a uid.
    gpii.ul.contribute.makeRequestIfNeeded = function (that) {
        if (that.options.req.query.uid) {
            that.makeRequest();
        }
    };

    gpii.ul.contribute.onlyDrawFormIfLoggedIn = function (that) {
        var form = that.locate("form");
        if (that.model.user && that.model.user.username) {
            form.show();

            // The form will be created the first time this is fired and will be ignored after that.
            that.events.onReadyToEdit.fire(that);
        }
        else {
            form.hide();
            that.applier.change("errorMessage", that.options.messages.loginRequired);
        }
    };

    // The component that loads the product content and controls the initial rendering.  Subcomponents
    // listen for this component to give the go ahead, and then take over parts of the interface.
    fluid.defaults("gpii.ul.contribute", {
        gradeNames: ["gpii.handlebars.ajaxCapable", "gpii.handlebars.templateAware"],
        baseUrl:    "/api/product/",
        messages: {
            loginRequired: "You must log in to contribute to the Unified Listing."
        },
        selectors: {
            viewport: ".contribute-viewport",
            form:     ".contribute-form"
        },
        mergePolicy: {
            rules: "noexpand"
        },
        ajaxOptions: {
            method:   "GET",
            dataType: "json"
        },
        model: {
            successMessage: false,
            errorMessage:   false,
            product: {
                uid:    "{that}.options.req.query.uid",
                status: "new"
            }
        },
        rules: {
            modelToRequestPayload: {
                "":      "notfound"
            },
            successResponseToModel: {
                "":     "notfound",
                // Only update the model with select data, rather than inappropriately clobbering the source, sid, etc.
                product: {
                    name:         "responseJSON.product.name",
                    description:  "responseJSON.product.description",
                    manufacturer: "responseJSON.product.manufacturer"
                },
                error:   { literalValue: null }
            },
            errorResponseToModel: {
                "": "notfound",
                "error": "responseJSON",
                successMessage: { literalValue: null }
            },
            ajaxOptions: {
                json:     true,
                dataType: "json",
                url: {
                    transform: {
                        type: "gpii.ul.stringTemplate",
                        template: "%baseUrl/unified/%uid",
                        terms: {
                            baseUrl: "{that}.options.baseUrl",
                            uid:     "{that}.options.req.query.uid"
                        },
                        value: "https://issues.fluidproject.org/browse/FLUID-5703" // <--- The bug that requires this unused block.
                    }
                }
            }
        },
        template: "contribute-viewport",
        events: {
            onReadyToEdit: null,
            onRenderedAndReadyToEdit: {
                events: {
                    onMarkupRendered: "onMarkupRendered",
                    onReadyToEdit:    "onReadyToEdit"
                }
            }
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: ["viewport", "{that}.options.template", "{that}.model"]
            },
            onlyDrawFormIfLoggedIn: {
                funcName: "gpii.ul.contribute.onlyDrawFormIfLoggedIn",
                args:     ["{that}"]
            }
        },
        listeners: {
            "onCreate.makeRequestIfNeeded": {
                funcName: "gpii.ul.contribute.makeRequestIfNeeded",
                args:     ["{that}"]
            },
            "onCreate.drawFormIfNeeded": {
                func: "{that}.onlyDrawFormIfLoggedIn"
            }
        },
        modelListeners: {
            user: [
                {
                    func: "{that}.onlyDrawFormIfLoggedIn"
                },
                {
                    func: "{that}.applier.change",
                    args: ["product.source", "{change}.value.name"]
                }
            ]
        },
        components: {
            // The common component for positive feedback.
            success: {
                type:          "gpii.handlebars.templateMessage",
                createOnEvent: "{contribute}.events.onMarkupRendered",
                container:     ".contribute-success",
                options: {
                    template: "common-success",
                    model: {
                        message: "{contribute}.model.successMessage"
                    }
                }
            },
            // The common component for negative feedback (errors, etc).
            error: {
                type:          "gpii.handlebars.templateMessage",
                createOnEvent: "{contribute}.events.onMarkupRendered",
                container:     ".contribute-error",
                options: {
                    template: "validation-error-summary",
                    model: {
                        message: "{contribute}.model.error"
                    }
                }
            },
            // The data entry form.
            form: {
                type:          "gpii.ul.contribute.form",
                createOnEvent: "{contribute}.events.onRenderedAndReadyToEdit",
                container:     "{contribute}.options.selectors.form",
                options: {
                    model: "{contribute}.model"
                }
            }
        }
    });
})();
