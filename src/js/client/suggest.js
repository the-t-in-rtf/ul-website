/*

    A component to allow users to "suggest" changes to an existing unified record.  Reuses material from the "edit" page.

 */
(function (fluid) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.ul.website.suggest.client");
    gpii.ul.website.suggest.client.hideCancelButton = function (that) {
        var cancelButton = that.locate("cancelButton");
        cancelButton.hide();
    };

    // The "suggest" form is only for editing a suggestion, and is created with the correct data..
    fluid.defaults("gpii.ul.website.suggest.client", {
        gradeNames: ["gpii.ul.product.edit"],
        selectors: {
            viewport:     ".suggest-viewport",
            cancelButton: ".cancel-button"
        },
        model: {
            successMessage:   false,
            errorMessage:     false,
            product:          false,
            user:             false
        },
        listeners: {
            "onDomChange.hideCancelButton": {
                funcName: "gpii.ul.website.suggest.client.hideCancelButton",
                args:     ["{that}"]
            }
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: ["viewport", "{that}.options.templateKeys.initial", "{that}.model"]
            }
        }
    });
})(fluid);
