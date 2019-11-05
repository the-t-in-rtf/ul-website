// Test fixtures to confirm that our checkbox panel works in browsers.
/* globals fluid */
(function () {
    "use strict";
    fluid.registerNamespace("gpii.tests.ul.checkboxPanel");

    fluid.defaults("gpii.tests.ul.checkboxPanel.component.base", {
        gradeNames: ["gpii.ul.checkboxPanel"],
        distributeOptions: {
            record: "/hbs",
            target: "{that renderer}.options.templateUrl"
        }
    });

    fluid.defaults("gpii.tests.ul.checkboxPanel.component.string", {
        gradeNames: ["gpii.tests.ul.checkboxPanel.component.base"],
        legend: "String Checkbox Panel",
        checkboxes: {
            string: {
                label: "String",
                value: "a string value"
            },
            "false": {
                label: "False (String)",
                value: "false"
            },
            utf8: {
                label: "*flip table*",
                value: "(╯°□°）╯︵ ┻━┻"
            }
        }
    });

    fluid.defaults("gpii.tests.ul.checkboxPanel.component.number", {
        gradeNames: ["gpii.tests.ul.checkboxPanel.component.base"],
        legend: "Number Checkbox Panel",
        bindings: {
            checkboxes: {
                selector: "checkboxOptions",
                path: "checkboxValue",
                rules: {
                    domToModel: {
                        "": {
                            transform: {
                                type: "gpii.ul.transforms.transformArray",
                                inputPath: "",
                                rules: {
                                    "": {
                                        transform: {
                                            type: "fluid.transforms.stringToNumber",
                                            inputPath: ""
                                        }
                                    }
                                }
                            }
                        }
                    },
                    modelToDom: {
                        "": {
                            transform: {
                                type: "gpii.ul.transforms.transformArray",
                                inputPath: "",
                                rules: {
                                    "": {
                                        transform: {
                                            type: "fluid.transforms.numberToString",
                                            inputPath: ""
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        checkboxes: {
            pi: {
                label: "𝝿",
                value: 3.1415926
            },
            tau: {
                label: "𝞽",
                value: 6.283185
            }
        }
    });
})();
