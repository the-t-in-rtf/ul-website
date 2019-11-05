/*

    A client-side "gallery" component that uses the keyboard navigation and "select" parts of the grid reorderer:

    https://wiki.fluidproject.org/display/docs/Grid+Reorderer+API

 */
(function (fluid) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.ul.images.viewGallery");

    gpii.ul.images.viewGallery.simpleConcat = function (value, transformSpec) {
        return fluid.stringTemplate(transformSpec.stringTemplate, { value: value });
    };

    fluid.defaults("gpii.ul.images.viewGallery", {
        gradeNames: ["gpii.handlebars.ajaxCapable", "gpii.handlebars.templateAware"],
        templateKey:  "gallery-view",
        selectors: {
            initial: ""
        },
        rules: {
            ajaxOptions: {
                "":  "",
                url: {
                    transform: {
                        type: "gpii.ul.images.viewGallery.simpleConcat",
                        input: "{that}.model.product.uid",
                        stringTemplate: "/api/images/gallery/%value"
                    }
                }
            },
            modelToRequestPayload: {
                "": "notfound"    // We are only working with query data
            },
            successResponseToModel: {
                "images": "responseJSON.images" // By default, use the entire jQuery `jqXHR` object's JSON payload.
            }
        },
        modelListeners: {
            product: {
                func:          "{that}.makeRequest",
                excludeSource: "init"
            },
            images: {
                func:          "{that}.renderInitialMarkup",
                excludeSource: "init"
            }
        },
        listeners: {
            "onCreate.makeRequest": {
                func: "{that}.makeRequest"
            }
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: ["initial", "{that}.options.templateKey", "{that}.model", "html"]
            }
        },
        components: {
            // TODO:  Get this working for keyboard navigation and enter keys.
            // grid: {
            //     type:          "fluid.reorderGrid",
            //     createOnEvent: "onDomChange",
            //     container:     "{that}.container",
            //     options: {
            //         selectors: {
            //             selectables: ".selectable"
            //         }
            //     }
            // },
            // Note, you are expected to inject a better-configured renderer with actual templates or otherwise configure this.
            renderer: {
                type: "gpii.handlebars.renderer.standalone"
            }
        }
    });
})(fluid);
