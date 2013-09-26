/*jslint node:true, nomen: true*/

'use strict';

var express = require('express'),
    expview = require('../'), // require('express-view'), // add it to package.json under "dependencies"
    app = express();

// setting up the locator object which is an abstraction of the filesystem
app.set('locator', require('./locator-mock'));

// extending express app with support for synthetic views from `express-view`
expview.extend(app);

// this specify that when calling `res.render()` the `page` template will be used as layout
app.set('layout', 'page'); // 

app.get('/baz', function (req, res, next) {
    res.render('baz');
});
app.get('/xyz', function (req, res, next) {
    res.render('xyz', {
        bundle: 'bar' // specifying in which bundle to look
    });
});
app.get('/qwe', function (req, res, next) {
    res.render('qwe', {
        bundle: 'bar',
        layout: 'page' // specifying what layout to use, overruling the global setting
    });
});

app.listen(3000, function () {
    console.log("Server listening on port 3000");
});
