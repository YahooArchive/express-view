/* global describe, it, beforeEach, afterEach */
'use strict';

/*
* Copyright (c) 2013, Yahoo! Inc. All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/

var express = require('express'),
    expview = require('../..'),
    locator = require('../fixtures/locator-mock.js'),
    expect  = require('chai').expect,

    app = express(),

    OriginalView, ViewShim, view;

// Set mock Locator for Express application
app.set('locator', locator);

// Set layout for Express application
app.set('layout', 'page');

// Get a reference to the original Express view
OriginalView = app.get('view');

// Extend Express application with Express View
expview.extend(app);

// Get a reference to the new Express view shim
ViewShim = app.get('view');

describe('Express View', function () {
    it('should contain an "@view" brand', function () {
        expect(app).to.haveOwnProperty('@view'); 
    });

    it('should be shimmed by the new Express View', function () {
        expect(OriginalView).to.not.equal(ViewShim); 
    }); 
});

describe('View Shim', function () {
    it('should render the correct layout', function () {
        view = new ViewShim('qwe');

        view.render({
            bundle: 'bar'
        }, function (err, data) {
            expect(data).to.equal('<p>layout template `page` from bundle `foo`, and the outlet for the main body:</p>' +
                                  '<p>this is the content produced by template `qwe` from bundle `bar`</p>'); 
        });
    });
});
