/*

    A component to allow users to "suggest" changes to an existing unified record.  Reuses material from the "edit" page.

 */
/* global fluid */
(function () {
    "use strict";

    // The "suggest" form is only for editing a suggestion, and is created with the correct data..
    fluid.defaults("gpii.ul.website.suggest.client", {
        gradeNames: ["gpii.ul.product.edit"],
        selectors: {
            viewport: ".suggest-viewport"
        },
        model: {
            successMessage:   false,
            errorMessage:     false,
            product:          false,
            user:             false
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: ["viewport", "{that}.options.templates.initial", "{that}.model"]
            }
        }
    });
})();
