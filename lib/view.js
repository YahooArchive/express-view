/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint node: true, nomen: true */

/**
The `require("express-view/lib/view")` exposes an express view class that relies
on templates stored on `bundle.template` object within locator.

@module express-view
@submodule view
**/

"use strict";

var debug = require('debug')('express:view');

/**
Extends object with properties from other objects.

    var a = { foo: 'bar' }
      , b = { bar: 'baz' }
      , c = { baz: 'xyz' };

    utils.extends(a, b, c);
    // a => { foo: 'bar', bar: 'baz', baz: 'xyz' }

@method extend
@param {Object} obj the receiver object to be extended
@param {Object*} supplier objects
@return {Object} The extended object
**/
function extend(obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        var key;

        if (!source) { return; }

        for (key in source) {
            if (source.hasOwnProperty(key)) {
                obj[key] = source[key];
            }
        }
    });

    return obj;
}

/**
 * Initialize a new `View` with the given `name`.
 *
 * @class View
 * @param {String} name the name of the view
 * @param {Object} options
 * @static
 * @constructor
 */
function View(name, options) {
    options = options || {};
    this.layout = options.layout;
    this.locator = options.locator;
    this.name = name;
    // the `path` denotates that we do have a template, this is
    // just to bypass express so we can resolve the template and
    // layout in lazy mode when calling render because there is
    // where we have the full information about what to render.
    this.path = name;
}

/**
 * Lookup view by the given `name`.
 *
 * @method lookup
 * @param {String} name the view name for the lookup
 * @param {Object} options the `options` passed as the second argument when calling `res.render()`
 * @return {function} the compiled view or null.
 */
View.prototype.lookup = function (name, options) {
    var locator = this.locator,
        bundle,
        rootBundle;

    // looking in the specificed bundle first
    bundle = options && options.bundle && locator.getBundle(options.bundle);
    if (bundle && (bundle !== rootBundle) && bundle.template && bundle.template[name]) {
        debug('Template "%s" resolved from bundle "%s" thru `locator`', name, options.bundle);
        return bundle.template[name];
    }

    // then looking in the root bundle
    // that's the most common use-case where the app bundle holds all templates
    rootBundle = locator.getRootBundle();
    if (rootBundle && rootBundle.template && rootBundle.template[name]) {
        debug('Template "%s" resolved from root bundle thru `locator`', name);
        return rootBundle.template[name];
    }
};

/**
 * Lookup layout view.
 *
 * @method layoutLookup
 * @param {Object} options the `options` passed as the second argument when calling `res.render()`
 * @return {function} the compiled layout view or null.
 */
View.prototype.layoutLookup = function (options) {
    var layoutName = (options && options.layout) || this.layout,
        layout;
    if (!layoutName) {
        return;
    }
    layout = this.lookup(layoutName, options);
    if (!layout) {
        debug('Unkown layout "%s", unabled to resolve it thru `locator`', layoutName);
    }
    return layout;
};

/**
 * Render with the given `options` and callback `fn(err, str)`.
 *
 * @method render
 * @param {Object} options the `options` passed as the second argument when calling `res.render()`
 * @param {Function} fn the callback function.
 */
View.prototype.render = function (options, fn) {
    var template = this.lookup(this.name, options),
        layout = this.layoutLookup(options);

    if (!template) {
        fn(new Error('Failed to lookup view "' + this.name + '"'));
    }
    if (layout) {
        // rendering the layout
        options = extend({}, options, { outlet: template(options) });
        template = layout;
    }
    fn(null, template(options || {}));
};

module.exports = View;
