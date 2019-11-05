// Test fixtures to confirm that our checkbox panel works in browsers.
/* globals fluid */
(function () {
    "use strict";

    fluid.defaults("gpii.tests.ul.checkboxPanel.caseHolder.string", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Testing a checkbox panel with string values...",
            tests: [
                {
                    name: "Model changes should result in form field updates...",
                    type: "test",
                    sequence: [
                        {
                            func: "{testEnvironment}.binder.applier.change",
                            args: ["checkboxValue", ["a string value"]]
                        },
                        {
                            func: "gpii.tests.binder.testElement",
                            args: ["assertDeepEq", "The checkbox form value should have been updated", ["a string value"], "input[name='checkbox-option']"] // fnName, message, expected, selector
                        },
                        {
                            func: "{testEnvironment}.binder.applier.change",
                            args: ["checkboxValue", ["(╯°□°）╯︵ ┻━┻", "false", "a string value"]]
                        },
                        {
                            func: "gpii.tests.binder.testElement",
                            args: ["assertDeepEq", "Multiple checkbox form values should have been updated", [ "a string value", "false", "(╯°□°）╯︵ ┻━┻"], "input[name='checkbox-option']"] // fnName, message, expected, selector
                        },
                        {
                            func: "{testEnvironment}.binder.applier.change",
                            args: ["checkboxValue", ["(╯°□°）╯︵ ┻━┻"]]
                        },
                        {
                            func: "gpii.tests.binder.testElement",
                            args: ["assertDeepEq", "UTF8 characters should be passed to the form correctly", ["(╯°□°）╯︵ ┻━┻"], "input[name='checkbox-option']"] // fnName, message, expected, selector
                        }
                    ]
                },
                {
                    name: "Form field changes should result in model updates...",
                    type: "test",
                    sequence: [
                        {
                            func: "fluid.changeElementValue",
                            args: ["input[name='checkbox-option']", ["false"]]
                        },
                        {
                            func: "jqUnit.assertDeepEq",
                            args: ["The model data should have been updated...", ["false"], "{testEnvironment}.binder.model.checkboxValue"]
                        }
                    ]
                }
            ]
        }]
    });

    fluid.defaults("gpii.tests.ul.checkboxPanel.environment.string", {
        gradeNames:    ["fluid.test.testEnvironment"],
        markupFixture: ".checkboxPanel-string-viewport",
        components: {
            caseHolder: {
                type: "gpii.tests.ul.checkboxPanel.caseHolder.string"
            },
            binder: {
                type:      "gpii.tests.ul.checkboxPanel.component.string",
                container: "{testEnvironment}.options.markupFixture"
            }
        }
    });

    fluid.defaults("gpii.tests.ul.checkboxPanel.caseHolder.number", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Testing a checkbox panel with numeric values...",
            tests: [
                {
                    name: "Numeric model values should be relayed to the form...",
                    type: "test",
                    sequence: [
                        {
                            event:    "{testEnvironment}.binder.events.onMarkupRendered",
                            listener: "{testEnvironment}.binder.applier.change",
                            args:     ["checkboxValue", [3.1415926]]
                        },
                        {
                            func: "gpii.tests.binder.testElement",
                            args: ["assertDeepEq", "The checkbox form value should have been updated", ["3.1415926"], "input[name='checkbox-option']"] // fnName, message, expected, selector
                        },
                        {
                            func: "{testEnvironment}.binder.applier.change",
                            args: ["checkboxValue", [6.283185, 3.1415926]]
                        },
                        {
                            func: "gpii.tests.binder.testElement",
                            args: ["assertDeepEq", "Multiple checkbox form values should have been updated", ["3.1415926", "6.283185"], "input[name='checkbox-option']"] // fnName, message, expected, selector
                        }
                    ]
                },
                {
                    name: "Form field changes should result in model updates...",
                    type: "test",
                    sequence: [
                        {
                            func: "fluid.changeElementValue",
                            args: ["input[name='checkbox-option']", ["3.1415926"]]
                        },
                        {
                            func: "jqUnit.assertDeepEq",
                            args: ["The model data should have been updated...", [3.1415926], "{testEnvironment}.binder.model.checkboxValue"]
                        }
                    ]
                }
            ]
        }]
    });

    fluid.defaults("gpii.tests.ul.checkboxPanel.environment.number", {
        gradeNames:    ["fluid.test.testEnvironment"],
        markupFixture: ".checkboxPanel-number-viewport",
        components: {
            caseHolder: {
                type: "gpii.tests.ul.checkboxPanel.caseHolder.number"
            },
            binder: {
                type:      "gpii.tests.ul.checkboxPanel.component.number",
                container: "{testEnvironment}.options.markupFixture"
            }
        }
    });

    fluid.defaults("gpii.tests.ul.checkboxPanel.caseHolder.string", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Testing a checkbox panel with string values...",
            tests: [
                {
                    name: "Model changes should result in form field updates...",
                    type: "test",
                    sequence: [
                        {
                            func: "{testEnvironment}.binder.applier.change",
                            args: ["checkboxValue", ["a string value"]]
                        },
                        {
                            func: "gpii.tests.binder.testElement",
                            args: ["assertDeepEq", "The checkbox form value should have been updated", ["a string value"], "input[name='checkbox-option']"] // fnName, message, expected, selector
                        },
                        {
                            func: "{testEnvironment}.binder.applier.change",
                            args: ["checkboxValue", ["(╯°□°）╯︵ ┻━┻", "false", "a string value"]]
                        },
                        {
                            func: "gpii.tests.binder.testElement",
                            args: ["assertDeepEq", "Multiple checkbox form values should have been updated", [ "a string value", "false", "(╯°□°）╯︵ ┻━┻"], "input[name='checkbox-option']"] // fnName, message, expected, selector
                        },
                        {
                            func: "{testEnvironment}.binder.applier.change",
                            args: ["checkboxValue", ["(╯°□°）╯︵ ┻━┻"]]
                        },
                        {
                            func: "gpii.tests.binder.testElement",
                            args: ["assertDeepEq", "UTF8 characters should be passed to the form correctly", ["(╯°□°）╯︵ ┻━┻"], "input[name='checkbox-option']"] // fnName, message, expected, selector
                        }
                    ]
                },
                {
                    name: "Form field changes should result in model updates...",
                    type: "test",
                    sequence: [
                        {
                            func: "fluid.changeElementValue",
                            args: ["input[name='checkbox-option']", ["false"]]
                        },
                        {
                            func: "jqUnit.assertDeepEq",
                            args: ["The model data should have been updated...", ["false"], "{testEnvironment}.binder.model.checkboxValue"]
                        }
                    ]
                }
            ]
        }]
    });

    fluid.defaults("gpii.tests.ul.checkboxPanel.environment.string", {
        gradeNames:    ["fluid.test.testEnvironment"],
        markupFixture: ".checkboxPanel-string-viewport",
        components: {
            caseHolder: {
                type: "gpii.tests.ul.checkboxPanel.caseHolder.string"
            },
            binder: {
                type:      "gpii.tests.ul.checkboxPanel.component.string",
                container: "{testEnvironment}.options.markupFixture"
            }
        }
    });

    fluid.test.runTests(["gpii.tests.ul.checkboxPanel.environment.string", "gpii.tests.ul.checkboxPanel.environment.number"]);
})();
