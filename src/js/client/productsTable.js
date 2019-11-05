( function (fluid) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.ul.productsTable");

    // Return `limit` products from `array`, starting at `offset`
    gpii.ul.productsTable.pageResults = function (array, offset, limit) {
        if (!array) { return; }

        // Set sensible defaults if we are not passed anything.
        var start = offset ? offset : 0;
        var end   = limit ? start + limit : array.length - offset;
        return array.slice(start, end);
    };

    gpii.ul.productsTable.pageAndRender = function (that) {
        that.model.pagedProducts = gpii.ul.productsTable.pageResults(that.model.products, that.model.offset, that.model.limit);
        that.renderInitialMarkup();
    };


    fluid.defaults("gpii.ul.productsTable", {
        gradeNames: ["gpii.handlebars.templateAware"],
        model: {
            products:  []
        },
        selectors: {
            products: ""
        },
        templateKey: "products-table",
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: ["products", "{that}.options.templateKey", "{that}.model"]
            },
            pageAndRender: {
                funcName: "gpii.ul.productsTable.pageAndRender",
                args:     ["{that}"]
            }
        },
        modelListeners: {
            products: {
                func:          "{that}.pageAndRender",
                excludeSource: "init"
            },
            offset: {
                func:          "{that}.pageAndRender",
                excludeSource: "init"
            },
            limit: {
                func:          "{that}.pageAndRender",
                excludeSource: "init"
            },
            sortBy: {
                excludeSource: "init",
                funcName: "gpii.sort",
                args:     ["{that}.model.products", "{that}.model.sortBy"] // dataToSort, sortCriteria
            }
        }
    });
})(fluid);
