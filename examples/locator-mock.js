/*jslint node: true, nomen: true */

"use strict";

/**
This is a mock object of a locator instance. Normally, this is going to be an instance
of `require('locator');`, more info at http://github.com/yahoo/locator/
**/

module.exports = {
    bundles: {
        foo: { /* default/root bundle */
            template: {
                baz: function (data) {
                    return '<p>this is the content produced by template `baz` from bundle `foo`</p>';
                },
                page: function (data) {
                    return '<p>layout template `page` from bundle `foo`, and the outlet for the main body:</p>' + data.outlet;
                }
            }
        },
        bar: {
            template: {
                xyz: function (data) {
                    return '<p>this is the content produced by template `xyz` from bundle `bar`</p>';
                },
                qwe: function (data) {
                    return '<p>this is the content produced by template `qwe` from bundle `bar`</p>';
                }
            }
        }
    },
    getRootBundle: function () {
        return this.getBundle('foo');
    },
    getBundle: function (name) {
        return this.bundles[name];
    }
};