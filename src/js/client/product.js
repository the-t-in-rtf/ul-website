// Component to display the view/edit interface for a single product.
(function (fluid) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    // The sub-component that handles editing the "status" field.
    fluid.defaults("gpii.ul.product.edit.status", {
        gradeNames: ["gpii.ul.select"],
        templateKey: "product-edit-status",
        select: {
            options: [
                { value: "new", label: "New"},
                { value: "active", label: "Active"},
                { value: "discontinued", label: "Discontinued"},
                { value: "deleted", label: "Deleted"}
            ]
        },
        selectors:  {
            select:  ""
        }
    });

    fluid.registerNamespace("gpii.ul.product.edit");

    gpii.ul.product.edit.filterAndStringify = function (value, transformSpec) {
        return JSON.stringify(fluid.filterKeys(value, fluid.makeArray(transformSpec.keys), transformSpec.exclude));
    };

    fluid.defaults("gpii.ul.product.edit.filterAndStringify", {
        gradeNames: ["fluid.standardTransformFunction"]
    });

    // The component that handles the binding, etc. for the "Edit" form.
    fluid.defaults("gpii.ul.product.edit", {
        gradeNames: ["gpii.schema.client.errorAwareForm"],
        schemaKey:  "product-update-input.json",
        ajaxOptions: {
            url:         "/api/product",
            method:      "PUT",
            contentType: "application/json",
            headers: {
                accept: "application/json"
            }
        },
        rules: {
            // TODO: Decouple the validation payload from the request payload, so that we can enable "live" validation.  Currently doesn't work because the "payload" is a string and no longer a JSON object.
            modelToRequestPayload: {
                "": {
                    transform: {
                        type:      "gpii.ul.product.edit.filterAndStringify",
                        inputPath: "product",
                        keys:      ["sources"],
                        exclude:   true
                    }
                }
            },
            errorResponseToModel: {
                "": "responseJSON"
            },
            successResponseToModel: {
                "":      "notfound",
                message: "Your changes have been saved."
            }
        },
        templateKeys: {
            initial: "product-edit"
        },
        selectors: {
            status:           ".product-edit-status",
            name:             ".product-edit-name",
            description:      ".product-edit-description",
            source:           ".product-edit-source",
            sid:              ".product-edit-sid",
            uid:              ".product-edit-uid",
            manufacturerName: ".manufacturer-name",
            address:          ".manufacturer-address",
            cityTown:         ".manufacturer-citytown",
            provinceRegion:   ".manufacturer-provinceregion",
            postalCode:       ".manufacturer-postalcode",
            country:          ".manufacturer-country",
            email:            ".manufacturer-email",
            phone:            ".manufacturer-phone",
            url:              ".manufacturer-url",
            form:             ".product-edit-form",
            error:            ".product-edit-error",
            success:          ".product-edit-success",
            submit:           ".product-edit-submit"
        },
        hideOnSuccess: false,
        hideOnError:   false,
        bindings: {
            name:             "product.name",
            description:      "product.description",
            source:           "product.source",
            sid:              "product.sid",
            uid:              "product.uid",
            manufacturerName: {
                selector: "manufacturerName",
                path:     "product.manufacturer.name",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.binder.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            address: {
                selector: "address",
                path:     "product.manufacturer.address",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.binder.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            cityTown: {
                selector: "cityTown",
                path:     "product.manufacturer.cityTown",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.binder.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            provinceRegion: {
                selector: "provinceRegion",
                path:     "product.manufacturer.provinceRegion",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.binder.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            postalCode: {
                selector: "postalCode",
                path:     "product.manufacturer.postalCode",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.binder.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            country: {
                selector: "country",
                path:     "product.manufacturer.country",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.binder.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            email: {
                selector: "email",
                path:     "product.manufacturer.email",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.binder.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            phone: {
                selector: "phone",
                path:     "product.manufacturer.phone",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.binder.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            url: {
                selector: "url",
                path:     "product.manufacturer.url",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.binder.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            }
        },
        errorBindings: {
            name:             "name",
            description:      "description",
            source:           "source",
            sid:              "sid",
            uid:              "uid",
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
        components: {
            status: {
                type:          "gpii.ul.product.edit.status",
                createOnEvent: "{edit}.events.onMarkupRendered",
                container:     "{edit}.dom.status",
                options: {
                    model: {
                        select:   "{edit}.model.product.status"
                    },
                    listeners: {
                        "onCreate.renderInitialMarkup": {
                            func: "{that}.renderInitialMarkup"
                        }
                    }
                }
            }
        }
    });

    fluid.registerNamespace("gpii.ul.product");

    // When our permissions data ("sources") are updated, confirm whether we are allowed to edit the record directly.
    // Also set the "updated" date to today's date.
    gpii.ul.product.checkReadyToEdit = function (that) {
        var editControls    = that.locate("editControls");

        if (that.model.user && that.model.writableSources && that.model.writableSources.length > 0) {
            that.applier.change("editableProduct.updated", (new Date()).toISOString());

            if (that.model.product && that.model.writableSources && that.model.writableSources.indexOf(that.model.product.source) !== -1) {
                editControls.show();
            }
            else if (that.model.product.source === "unified") {
                editControls.hide();
            }

            that.events.onReadyForEdit.fire(that);
        }
    };

    // Convenience grade to avoid repeating the common toggle options for all three toggles (see below).
    fluid.defaults("gpii.ul.product.toggle", {
        gradeNames: ["gpii.ul.toggle"],
        selectors: {
            controls: ".product-view-control-panel",
            editForm: ".product-edit",
            viewForm: ".product-view"
        },
        toggles: {
            controls: true,
            editForm: true,
            viewForm: true
        }
    });

    // Grade to handle the special case of hiding the edit form when the record is saved successfully
    fluid.registerNamespace("gpii.ul.product.toggle.onSave");
    gpii.ul.product.toggle.onSave.hideOnSuccess = function (that, success) {
        if (success) {
            that.performToggle();
        }
    };

    fluid.defaults("gpii.ul.product.toggle.onSave", {
        gradeNames: ["gpii.ul.product.toggle"],
        invokers: {
            hideOnSuccess: {
                funcName: "gpii.ul.product.toggle.onSave.hideOnSuccess",
                args:     ["{that}", "{arguments}.0"]
            }
        }
    });

    fluid.registerNamespace("gpii.ul.product.permChecker");

    // If the user is logged in, retrieve the list of sources they are allowed to read/write.
    gpii.ul.product.permChecker.startPermCheck = function (that) {
        if (that.model.user) {
            that.makeRequest();
        }
        else {
            that.applier.change("writableSources", []);
        }
    };

    fluid.defaults("gpii.ul.product.permChecker", {
        gradeNames: ["gpii.handlebars.ajaxCapable"],
        ajaxOptions: {
            method:   "GET",
            url:      "/api/sources",
            dataType: "json",
            headers:  { accept: "application/json" }
        },
        rules: {
            modelToRequestPayload: {
                "": "notfound"
            },
            successResponseToModel: {
                "": "notfound",
                "writableSources": "responseJSON.writableSources",
                "errorMessage": { literalValue: false }
            },
            errorResponseToModel: {
                "": "notfound",
                "writableSources": { literalValue: [] },
                "errorMessage": "responseJSON.message"
            }
        },
        model: {
            user:            false,
            writableSources: [],
            errorMessage:    false
        },
        invokers: {
            "checkPerms": {
                funcName: "gpii.ul.product.permChecker.startPermCheck",
                args:     ["{that}"]
            }
        },
        listeners: {
            "onCreate.makeRequest": {
                func: "{that}.makeRequest"
            }
        },
        modelListeners: {
            "user": {
                func: "{that}.makeRequest",
                excludeSource: "init"
            }
        }
    });

    // The component that loads the product content and controls the initial rendering.  Subcomponents
    // listen for this component to give the go ahead, and then take over parts of the interface.
    fluid.defaults("gpii.ul.product", {
        gradeNames: ["gpii.handlebars.templateAware"],
        selectors: {
            viewport:     ".product-viewport",
            editControls: ".product-edit-button"
        },
        mergePolicy: {
            rules: "noexpand"
        },
        listeners: {
            "onRendererAvailable.renderMarkup": {
                func: "{that}.renderInitialMarkup"
            }
        },
        ajaxOptions: {
            method:   "GET",
            dataType: "json",
            headers: {
                accept: "application/json"
            }
        },
        model: {
            successMessage:   false,
            errorMessage:     false,
            product:          false,
            editableProduct:  "{that}.model.product",
            user:             false,
            writableSources:  []
        },
        templateKey: "product-viewport",
        events: {
            onEditRendered: null,
            onReadyForEdit: null,
            onRenderedAndReadyForEdit: {
                events: {
                    onReadyForEdit:   "onReadyForEdit",
                    onMarkupRendered: "onMarkupRendered"
                }
            },
            onViewRendered: null
        },
        modelListeners: {
            "writableSources": {
                func: "{that}.checkReadyToEdit"
            }
        },
        components: {
            permChecker: {
                type: "gpii.ul.product.permChecker",
                options: {
                    model: {
                        writableSources: "{gpii.ul.product}.model.writableSources",
                        user:            "{gpii.ul.product}.model.user"
                    }
                }
            },
            view: {
                type:          "gpii.handlebars.templateMessage",
                container:     ".product-view",
                createOnEvent: "{product}.events.onMarkupRendered",
                options: {
                    templateKey: "product-view",
                    model:    {
                        product: "{product}.model.product",
                        user:    "{product}.model.user"
                    },
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{product}.events.onViewRendered.fire"
                        },
                        "onCreate.renderInitialMarkup": {
                            func: "{that}.renderInitialMarkup"
                        }
                    }
                }
            },
            gallery: {
                type:          "gpii.ul.images.viewGallery",
                createOnEvent: "{product}.events.onMarkupRendered",
                container:     ".ul-gallery-holder",
                options: {
                    model: {
                        product: "{gpii.ul.product}.model.product"
                    },
                    components: {
                        renderer: "{gpii.ul.product}.renderer"
                    }
                }
            },
            edit: {
                type:          "gpii.ul.product.edit",
                createOnEvent: "{product}.events.onRenderedAndReadyForEdit",
                container:     ".product-edit",
                options: {
                    model: {
                        product: "{product}.model.editableProduct"
                    },
                    listeners: {
                        "onCreate.renderInitialMarkup": {
                            func: "{that}.renderInitialMarkup"
                        }
                    }
                }
            },
            // Toggles must exist at this level so that they can be aware of both the view and edit form, thus we have
            // two very similar toggle controls that are instantiated if we're editing, and which are rebound as needed.
            editControls: {
                type:          "gpii.ul.product.toggle",
                createOnEvent: "{product}.events.onRenderedAndReadyForEdit",
                container:     "{product}.container",
                options: {
                    selectors: {
                        toggle: ".product-view-control-panel .product-toggle"
                    },
                    // We need to refresh on startup because the view may already have been rendered.
                    listeners: {
                        "onCreate.refresh": {
                            func: "{that}.events.onRefresh.fire"
                        }
                    }
                }
            },
            toggleFromEdit: {
                type:          "gpii.ul.product.toggle",
                createOnEvent: "{product}.events.onRenderedAndReadyForEdit",
                container:     "{product}.container",
                options: {
                    selectors: {
                        toggle: ".product-edit .product-toggle"
                    },
                    // The edit form is only rendered once, and before us, so we can just apply our bindings on creation.
                    listeners: {
                        "onCreate.applyBindings": {
                            func: "{that}.events.onRefresh.fire"
                        }
                    }
                }
            },
            // The last toggle has no controls, and is used to hide the editing interface when the record is saved successfully.
            toggleAfterSave: {
                type:          "gpii.ul.product.toggle.onSave",
                createOnEvent: "{product}.events.onRenderedAndReadyForEdit",
                container:     "{product}.container",
                options: {
                    listeners: {
                        "{edit}.events.requestReceived": {
                            func: "{that}.hideOnSuccess",
                            args: ["{arguments}.1"] // component, success
                        }
                    }
                }
            }
        },
        invokers: {
            checkReadyToEdit: {
                funcName: "gpii.ul.product.checkReadyToEdit",
                args:     ["{that}", "{arguments}.2"]
            },
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: ["viewport", "{that}.options.templateKey", "{that}.model"]
            }
        }
    });
})(fluid);
