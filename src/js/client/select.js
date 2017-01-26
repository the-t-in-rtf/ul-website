// A generic component that controls and updates a single drop-down field based on a single model variable.
/* global fluid */
(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.ul.select");

    gpii.ul.select.renderMarkup = function (that) {
        var selectOptionsSorted = fluid.copy(that.options.select);
        selectOptionsSorted.options = fluid.parsePriorityRecords(selectOptionsSorted.options, "select option");
        that.renderMarkup("initial", that.options.template, selectOptionsSorted);
    };

    fluid.defaults("gpii.ul.select", {
        gradeNames: ["gpii.handlebars.templateAware"],
        priorityName: "select option",
        selectors:  {
            initial: ""
        },
        bindings: {
            select:  "select"
        },
        invokers: {
            renderInitialMarkup: {
                funcName: "gpii.ul.select.renderMarkup",
                args:     ["{that}"]
            }
        },
        modelListeners: {
            select: {
                func:          "{that}.renderInitialMarkup",
                excludeSource: "init"
            }
        }
    });
})();
