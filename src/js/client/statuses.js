// The "statuses" control that updates the statuses value when checkboxes are changed.
( function (fluid) {
    "use strict";
    fluid.defaults("gpii.ul.statuses", {
        gradeNames: ["gpii.ul.checkboxPanel"],
        templateKey: "search-statuses",
        label:    "Filter by status:",
        checkboxes: {
            "new": {
                label: "New",
                value: "new"
            },
            active: {
                label: "Active",
                value: "active"
            },
            discontinued: {
                label: "Discontinued",
                value: "discontinued"
            },
            deleted: {
                label: "Deleted",
                value: "deleted"
            }
        }
    });
})(fluid);
