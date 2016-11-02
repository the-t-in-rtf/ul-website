/* global fluid */
(function () {
    "use strict";
    // The "sortBy" control that updates the sortBy values based on a predefined list of possible settings.
    fluid.defaults("gpii.ul.sortBy", {
        gradeNames: ["gpii.ul.select"],
        template:   "sortBy",
        selectors:  {
            initial: "",
            select:  ".search-sortBy-select"
        },
        select: {
            options: {
                nameAsc: {
                    label: "by name, A-Z",
                    value: "/name"
                },
                nameDesc: {
                    label: "by name, Z-A",
                    value: "\\name"
                },
                updatedDesc: {
                    label: "by date of last update, newest first",
                    value: "\\updated"
                },
                updatedAsc: {
                    label: "by date of last update, oldest first",
                    value: "updated"
                }
            }
        }
    });
})();
