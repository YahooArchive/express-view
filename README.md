Express View
============

WIP


Usage
-----

### Extending express functionalities

`express-view` is a conventional `express` extension, which means it will extend
the functionalities provided on `express` by augmenting the express app instance.

Here is an example of how to extend an `express` app with `express-view`:

```
var express = require('express'),
    expview = require('express-view'),
    app = express();

// mounting a filesystem attraction
app.set('locator', locatorObj);

// calling a static method to extend the `express` app instance
expview.extend(app);
```

In the example above, when calling `res.render('foo')` to response to a request, `foo` will be treated as a synthetic view name and it will be looked up thru `locator`. If the template was not compiled by `locator`, then it will fallback to the default implementation in express, which involves filesystem interaction to try to resolve the view.


License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.


[LICENSE file]: https://github.com/caridy/express-view/blob/master/LICENSE
