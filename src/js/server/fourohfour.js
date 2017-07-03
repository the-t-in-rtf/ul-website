/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.ul.website.middleware.fourohfour");

gpii.ul.website.middleware.fourohfour.middleware = function (that, req, res) {
    res.status(404).send(that.options.message);
};

fluid.defaults("gpii.ul.website.middleware.fourohfour", {
    gradeNames: ["gpii.express.middleware"],
    method:     "use",
    message:    "File not found.",
    invokers: {
        middleware: {
            funcName: "gpii.ul.website.middleware.fourohfour.middleware",
            args: ["{that}", "{arguments}.0", "{arguments}.1"] // request, response
        }
    }
});
