/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint node: true, nomen: true */

'use strict';

var View = require('./lib/view'),
    debug = require('debug')('express:view');

function expressView(app) {
    // storing a reference to the original view class
    // implementation so we can fallback to that if
    // there is not a synthetic template available
    var OrignalViewClass = app.get('view');

    if (app['@view']) { return app; }

    // Brand.
    Object.defineProperty(app, '@view', {
        value: expressView
    });

    function ViewShim(name, options) {
        var v, o;

        if (!app.get('locator')) {
            debug('Call `app.set("locator", locatorObj)` before listening for traffic on the `express` app.');
            throw new Error('Locator instance should be mounted');
        }

        options = options || {};
        options.locator = app.get('locator');
        options.layout = app.get('layout');

        v = new View(name, options);
        // piping the important pieces to shim the view instance
        this.name = v.name;
        this.path = v.path;
        this.render = function (opts, fn) {
            // trying to render with the view implementation that relies on
            // synthetic views from locator. this render process is sync,
            // that's why we have a giant try/catch here.
            try {
                v.render(opts, function (err) {
                    if (err) {
                        debug('Failed to lookup synthetic view "%s" thru `locator`', name);
                        // fallback to the original implementation (which might be cacheable)
                        // TODO: the following line might throw, what should we do?
                        if (!o || !opts.cache) {
                            o = new OrignalViewClass(name, options);
                        }
                        if (!o.path) {
                            throw new Error('Failed to lookup view "' + name + '"');
                        }
                        // render using the original implemented from express which
                        // is going to try to use the filesystem and the view engines
                        o.render(opts, fn);
                        return;
                    }
                    fn.apply(this, arguments);
                });
            } catch (err) {
                err.view = v;
                fn(err);
            }
        };
    }

    // Modifies the Express `app`.
    app.set('view', ViewShim);

    return app;
}

exports.extend = expressView;
