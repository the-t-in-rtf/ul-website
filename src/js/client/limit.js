(function (fluid) {
    "use strict";
    // The "limit" control that updates the number of products per page based on a predefined list of possible settings.
    fluid.defaults("gpii.ul.limit", {
        gradeNames: ["gpii.ul.select"],
        templateKey:   "limit",
        selectors:  {
            initial: "",
            select:  ".limit-select"
        },
        bindings: {
            select: {
                path: "select",
                selector: "select",
                rules: {
                    domToModel: {
                        "": {
                            transform: {
                                type:  "fluid.transforms.stringToNumber",
                                inputPath: ""
                            }
                        }
                    },
                    modelToDom: {
                        "": {
                            transform: {
                                type: "fluid.transforms.numberToString",
                                inputPath: ""
                            }
                        }
                    }
                }
            }
        },
        select: {
            options: {
                twentyFive: {
                    label: "25 products per page",
                    value: 25
                },
                fifty: {
                    label: "50 products per page",
                    value: 50
                },
                hundred: {
                    label: "100 products per page",
                    value: 100
                }
            }
        }
    });
})(fluid);
