/*
  Pagination controls.  These are only displayed if `model.totalRows` is longer than `limit`.

  There are two grades.  The smaller control only supports "next" and "previous" controls.  The long form adds
  individual controls for all pages.  The only difference is the template.

*/
<!-- TODO: replace this with the paging component included with infusion or at a minimum come up with a good reason why we can't -->
(function (fluid) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("jQuery");

    fluid.registerNamespace("gpii.ul.navbar");

    gpii.ul.navbar.changeOffset = function (that, event) {
        that.oldFocus = event.target;

        event.preventDefault();
        var newOffset = Number.parseInt(event.target.getAttribute("offset"));
        that.applier.change("offset", newOffset);
    };

    gpii.ul.navbar.checkKey = function (that, event) {
        if (event.keyCode === 13) {
            that.changeOffset(event);
        }
    };

    // Preserve focus on a redraw
    gpii.ul.navbar.focusAfterRender = function (that) {
        if (that.oldFocus) {
            // The "next" and "previous" links may have the same offset as a numbered link.  We go through this to
            // determine which one should receive focus.

            // We are working with our own "previous" link
            var classList = fluid.makeArray(that.oldFocus.classList);
            if (classList.indexOf("nav-prev-link") !== -1) {
                that.locate("navPrevLink").focus();
            }

            // We are working with our own "next" link
            else if (classList.indexOf("nav-next-link") !== -1) {
                that.locate("navNextLink").focus();
            }

            // We are working with one of our numbered navigation links
            else if (classList.indexOf("nav-num-link") !== -1) {
                var focused = false;
                fluid.each(that.locate("navNumLink"), function (link) {
                    var linkOffset = parseInt(link.getAttribute("offset"), 10);
                    if (!focused && linkOffset === that.model.offset) {
                        link.focus();
                        focused = true;
                    }
                });
            }
        }

        // Remove the previous focus placeholder to avoid mistakenly changing the focus when someone else changes our
        // model (for example when a new search is performed).
        delete that.oldFocus;
    };

    // Start with `totalRows` and generate the data we need to create a navigation bar.
    gpii.ul.navbar.generatePagingData = function (that) {
        var newPagingData = [];
        var showNavBar     = false;
        var hasPrevious    = false;
        var hasNext        = false;
        var end            = that.model.totalRows;

        if (that.model.totalRows > 0) {
            var numPages = Math.ceil(that.model.totalRows  / that.model.limit);
            if (numPages > 1) {
                end = that.model.offset + that.model.limit;
                showNavBar = true;

                for (var a = 0; a < numPages; a++) {
                    var offset = a * that.model.limit;
                    var current = offset === that.model.offset;
                    newPagingData.push({
                        label:   a + 1,
                        offset:  offset,
                        current: current
                    });
                }

                hasPrevious = that.model.offset > 0;
                hasNext     = that.model.offset < (that.model.totalRows - that.model.limit);
            }
        }

        var previousOffset = hasPrevious ? that.model.offset - that.model.limit : 0;
        var nextOffset =  hasNext ? that.model.offset + that.model.limit : that.model.offset;

        that.applier.change("showNavBar",     showNavBar);
        that.applier.change("hasPrevious",    hasPrevious);
        that.applier.change("hasNext",        hasNext);
        that.applier.change("previousOffset", previousOffset);
        that.applier.change("nextOffset",     nextOffset);
        that.applier.change("pages",          newPagingData);
        that.applier.change("end",            end);
    };

    fluid.defaults("gpii.ul.navbar", {
        gradeNames: ["gpii.handlebars.templateAware"],
        templateKey: "navbar",
        members: {
            oldFocus: undefined
        },
        model: {
            offset:      0,
            limit:       25,
            end:         25,
            totalRows:   0,
            showNavBar:  false,
            hasPrevious: false,
            hasNext:     false,
            pages:       {}
        },
        selectors: {
            initial:     "",
            focused:     ":focus",
            navLink:     ".nav-link",
            navPrevLink: ".nav-link.nav-prev-link",
            navNumLink:  ".nav-link.nav-num-link",
            navNextLink: ".nav-link.nav-next-link"
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: ["initial", "{that}.options.templateKey", "{that}.model"]
            },
            generatePagingData: {
                funcName: "gpii.ul.navbar.generatePagingData",
                args:     ["{that}"]
            },
            changeOffset: {
                funcName: "gpii.ul.navbar.changeOffset",
                args:     ["{that}", "{arguments}.0"]
            },
            checkKey: {
                funcName: "gpii.ul.navbar.checkKey",
                args:     ["{that}", "{arguments}.0"]
            }
        },
        listeners: {
            "onDomChange.wireNavLinkKeyPress": {
                "this": "{that}.dom.navLink",
                method: "keydown",
                args:   "{that}.checkKey"
            },
            "onDomChange.wireNavLinkClick": {
                "this": "{that}.dom.navLink",
                method: "click",
                args:   "{that}.changeOffset"
            },
            "onMarkupRendered.focusAfterRender": {
                funcName: "gpii.ul.navbar.focusAfterRender",
                args:     ["{that}"]
            }
        },
        modelListeners: {
            offset: {
                func:          "{that}.generatePagingData",
                excludeSource: "init"
            },
            limit: {
                func:          "{that}.generatePagingData",
                excludeSource: "init"
            },
            totalRows: {
                func:          "{that}.generatePagingData",
                excludeSource: "init"
            },
            end: {
                func:          "{that}.renderInitialMarkup",
                excludeSource: "init"
            },
            pages: {
                func:           "{that}.renderInitialMarkup",
                excludeSource:  "init"
            }
        }
    });
})(fluid);
