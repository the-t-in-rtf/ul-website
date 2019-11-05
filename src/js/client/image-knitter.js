/*

    A Fluid component that adds images next to product listing on the search and other pages.  It does this by:

    1. Requesting all "unified" image metadata.
    2. Using `fluid.transforms.indexArrayByKey` to reduce these records to one record per uid.
    3. Iterating through the list of DOM elements waiting for image data, and updating each one with image data if available.

 */
(function (jQuery, fluid) {
    "use strict";
    var gpii  = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.ul.api.client.images.knitter");

    // TODO Collapse this down into the listener once we're sure it works.
    gpii.ul.api.client.images.knitter.getImageMetadata = function (that) {
        jQuery.ajax(that.options.ajaxOptions);
    };

    gpii.ul.api.client.images.knitter.transform = function (that) {
        var transformedData = fluid.model.transformWithRules(that.model.rawData, that.options.rules.uniqueImagePerUid);
        that.applier.change("transformedData", transformedData);
    };

    gpii.ul.api.client.images.knitter.redraw = function (that) {
        // Look up image placeholders
        var imagePlaceholderElements = fluid.makeArray(that.locate("imageHolder"));

        // Replace the inner html of each with rendered content.
        fluid.each(imagePlaceholderElements, function (singleElement) {
            // Determine which uid we're working with.
            var uid = singleElement.getAttribute("uid");

            var imageMetadata = that.model.transformedData[uid];

            // If we have image metadata for this UID, render content in the placeholder element.
            if (imageMetadata) {
                imageMetadata.uid = uid;
                that.renderer.html($(singleElement), "singleImage", imageMetadata);
            }
        });
    };

    fluid.defaults("gpii.ul.api.client.images.knitter", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            imageHolder: ".ul-image-holder"
        },
        ajaxOptions: {
            url:     "/api/images/unified",
            accepts: "application/json",
            error:   "{that}.handleError",
            success: "{that}.handleSuccess"
        },
        events: {
            onResultsRefreshed: null
        },
        model: {
            rawData: {
                records: [{uid: "foo", bar: true}, {uid: "foo", bar: false}, {uid: "bar", foo: true}]
            },
            transformedData: {}
        },
        rules: {
            uniqueImagePerUid: {
                "": {
                    "transform": {
                        "type": "fluid.transforms.indexArrayByKey",
                        "key": "uid",
                        "inputPath": "records"
                    }
                }
            }
        },
        invokers: {
            handleSuccess: {
                func: "{that}.applier.change",
                args: ["rawData", "{arguments}.0"] // Anything data, String textStatus, jqXHR jqXHR
            },
            handleError: {
                funcName: "fluid.log",
                args:     ["Error retrieving image metadata: ",  "{arguments}.1", "{arguments}.2"] //jqXHR jqXHR, String textStatus, String errorThrown
            }
        },
        modelListeners: {
            "rawData": {
                funcName:      "gpii.ul.api.client.images.knitter.transform",
                args:          ["{that}"],
                excludeSource: "init"
            },
            "transformedData": {
                funcName:      "gpii.ul.api.client.images.knitter.redraw",
                args:          ["{that}"],
                excludeSource: "init"
            }
        },
        listeners: {
            "onCreate.getImageMetadata": {
                funcName: "gpii.ul.api.client.images.knitter.getImageMetadata",
                args:     ["{that}"]
            },
            "onResultsRefreshed.redraw": {
                funcName: "gpii.ul.api.client.images.knitter.redraw",
                args:     ["{that}"]
            }
        },
        components: {
            renderer: {
                type: "gpii.handlebars.renderer.standalone"
            }
        }
    });
})(jQuery, fluid);
