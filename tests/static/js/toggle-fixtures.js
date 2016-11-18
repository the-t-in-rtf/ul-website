// Test fixtures for the "toggle" functional tests.
/* globals fluid */
(function () {
    "use strict";

    fluid.defaults("gpii.tests.ul.toggle.short", {
        gradeNames: ["gpii.ul.toggle"],
        selectors: {
            toggle:    ".toggle",
            toToggle:  ".toToggle"
        },
        toggles: {
            toToggle: true
        },
        listeners: {
            "onCreate.applyBindings": "{that}.events.onRefresh"
        }
    });

    fluid.defaults("gpii.tests.ul.toggle.long", {
        gradeNames: ["gpii.tests.ul.toggle.short"],
        selectors: {
            toggle:   ".toggle",
            toToggle: ".toToggle"
        },
        toggles: {
            toToggle: {
                selector:    "toToggle",
                toggleClass: "toggleClass1 toggleClass2"
            }
        }
    });
})();
