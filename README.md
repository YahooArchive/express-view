Express View
============

[![Build Status](https://travis-ci.org/yahoo/express-view.png?branch=master)](https://travis-ci.org/yahoo/express-view)

`express-view` ships with a custom `express` view class implementation which allows to control `res.render()` calls. Normally, `express` along with some specific view engine can do the work of compiling and rendering templates on the server side, but `express-view` span that to support the use of compiled-to-javascript templates that were already provisioned in memory thru a filesystem abstraction component like `locator`.

Usage
-----

```
var express = require('express'),
    expview = require('express-view'),
    app = express();

app.set('locator', myLocatorObj); // filesystem abstraction layer
expview.extend(app);
```

With the code above, there is not need to define anything else in express in terms of engine, or path to views, or anything else, all that is irrelevant since `express-view` will completely take over the `express`'s template resolution process, and will drive it thru `myLocatorObj` abtraction, which means you can call `res.render('foo')` in your middleware, and `express-view` will resolve `foo` template. `express-view` will try to find `foo` template thru the locator instance API, and it will fallback to the regular express implementation if the template is not found, in case you need to mix-in synthetic views and traditional views.

### Layout

You can also define a default layout:

```
app.set('layout', 'name-of-the-layout-template');
```

If you use `layout` as above, or just by providing the `layout` value when calling `res.render('foo', { layout: 'bar' })`, `express-view` will resolve the `view`, render it, and the result of that operation will be passed into the layout render thru a context variable called `outlet`, this is similar to `emberjs`. In a handlebars template, you will define the `outlet` like this:

```
<div>{{{outlet}}}</div>
```

### Bundles

Locator organizes templates per bundle (which are usually NPM dependencies that contain compiled templates). By default, the root bundle in your locator object will be used to resolve templates, and you have the ability to specify which bundle should be used to resolve the template::

```
res.render('foo', {
    bundle: 'name-of-the-bundle'
});
```

If the template `foo` is not found in the specified bundle, `express-view` will look into the root bundle, or fallback to the traditional express view resolution process.

### More info

Under the `example` folder you can see a more detailed example of how to use `express-view`.

Also, for more information about the new feature in express that powers `express-view`, read this:

 * http://caridy.name/blog/2013/05/bending-express-to-support-synthetic-views/

License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.


[LICENSE file]: https://github.com/caridy/express-view/blob/master/LICENSE

Contribute
----------

See the [CONTRIBUTING.md file][] for more information.

[CONTRIBUTING.md file]: https://github.com/express-view/blob/master/CONTRIBUTING.md
