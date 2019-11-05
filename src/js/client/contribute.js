// Component to allow end users to contribute changes, which can be reviewed and incorporated into the unified record.
(function (fluid) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.ul.contribute");
    gpii.ul.contribute.setSource = function (that) {
        var source = that.model.user ? "~" + that.model.user.username : undefined;
        that.applier.change("product.source", source);
    };

    fluid.defaults("gpii.ul.contribute", {
        gradeNames: ["gpii.schema.client.errorAwareForm"],
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
                sid: "{that}.id",
                status: "new",
                manufacturer: {}
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
                "": "notfound",
                product: "responseJSON.product",
                successMessage: {literalValue: "Your submission has been saved.  You may continue revising this or close the window."},
                errorMessage: {literalValue: null},
                fieldErrors: {literalValue: null}
            }
        },
        selectors: {
            initial:          ".contribute-viewport",
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
                        "": { transform: { type:  "gpii.binder.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            description: {
                selector: "description",
                path:     "product.description",
                rules: {
                    domToModel: {
                        "": { transform: { type:  "gpii.binder.transforms.stripEmptyString", inputPath: "" } }
                    }
                }
            },
            source: "product.source",
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
        templateKeys: {
            initial: "contribute-viewport"
        },
        events: {
            never: null
        },
        modelListeners: {
            "user": {
                funcName: "gpii.ul.contribute.setSource",
                args:     ["{that}"]
            }
        }
    });
})(fluid);
