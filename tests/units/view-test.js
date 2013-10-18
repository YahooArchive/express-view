/* global describe, it, beforeEach, afterEach */
'use strict';

/*
* Copyright (c) 2013, Yahoo! Inc. All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/

var View    = require('../../lib/view.js'),
    locator = require('../fixtures/locator-mock.js'),
    expect  = require('chai').expect;

describe('View', function () {
    var view,
        template,
        html;

    it('should be a function', function () {
        expect(View).to.be.a('function');
    });

    describe('#lookup', function () {
        beforeEach(function () {
            view = new View('view', {
                locator: locator
            });
        });

        it('should return nothing if no name is specified', function () {
            template = view.lookup();
            
            expect(template).to.not.exist;
        });

        it('should look in the specified bundle first', function () {
            template = view.lookup('xyz', {
                bundle: 'bar'
            });
            
            html = template();
            expect(html).to.equal('<p>this is the content produced by template `xyz` from bundle `bar`</p>'); 
        });

        it('should fall back to the root bundle if unspecified', function () {
            template = view.lookup('baz');
            
            html = template();
            expect(html).to.equal('<p>this is the content produced by template `baz` from bundle `foo`</p>'); 
        });
    });

    describe('#layoutLookup', function () {
        it('should return nothing if no layout is specified', function () {
            view = new View('view', {
                locator: locator
            });

            template = view.layoutLookup();
            expect(template).to.not.exist;
        });

        beforeEach(function () {
            view = new View('view', {
                locator : locator,
                layout  : 'page'
            });
        });

        it('should return the specified layout first', function () {
            template = view.layoutLookup({
                layout: 'baz'
            });

            html = template();
            expect(html).to.equal('<p>this is the content produced by template `baz` from bundle `foo`</p>');
        });

        it('should fall back to the layout from the root bundle', function () {
            template = view.layoutLookup();
            html = template({ outlet: '<p>outlet</p>'});
            expect(html).to.equal('<p>layout template `page` from bundle `foo`, and the outlet for the main body:</p><p>outlet</p>');
        });
    });

    describe('#render', function () {
        it('should render the correct view', function () {
            view = new View('xyz', {
                locator : locator,
            });

            view.render({ bundle : 'bar' }, function (err, data) {
                expect(data).to.equal('<p>this is the content produced by template `xyz` from bundle `bar`</p>'); 
            });
        });

        it('should render the correct full view, with layout', function () {
            view = new View('qwe', {
                locator : locator,
                layout  : 'page'
            });

            view.render({ bundle : 'bar' }, function (err, data) {
                expect(data).to.equal('<p>layout template `page` from bundle `foo`, and the outlet for the main body:</p>' +
                                      '<p>this is the content produced by template `qwe` from bundle `bar`</p>');
            });
        });
    });
});
