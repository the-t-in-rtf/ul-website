(function (fluid) {
    "use strict";
    // The base "sortBy" control that updates the sortBy values based on a predefined list of possible settings.
    fluid.defaults("gpii.ul.sortBy", {
        gradeNames: ["gpii.ul.select"],
        templateKey: "sortBy",
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
                    priority: "after:nameAsc",
                    label:    "by name, Z-A",
                    value:    "\\name"
                },
                updatedDesc: {
                    priority: "after:nameDesc",
                    label:    "by date of last update, newest first",
                    value:    "\\updated"
                },
                updatedAsc: {
                    priority: "after:updatedDesc",
                    label:    "by date of last update, oldest first",
                    value:    "updated"
                }
            }
        }
    });

    // The "search" variation that defines a "most relevant" ordering.
    fluid.defaults("gpii.ul.sortBy.search", {
        gradeNames: ["gpii.ul.sortBy"],
        selectors:  {
            select:  ".search-sortBy-select"
        },
        select: {
            options: {
                relevance: {
                    priority: "first",
                    label:    "most relevant first",
                    value:    ""
                }
            }
        }
    });
})(fluid);
