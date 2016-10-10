# Everlive JavaScript SDK
-----------------

## Introduction

The Everlive JavaScript SDK is intended to run in any Javascript environment. It is packaged with Browserify for all
environments except for Node.js where the code from the *src* is used directly. It is distributed in the following forms:

* A stand-alone .js file served through [CDN](https://bs-static.cdn.telerik.com/latest/everlive.all.js)
* [Bower package](https://github.com/telerik/backend-services-js-sdk), once again standalone .js file
* [NPM module](https://www.npmjs.com/package/everlive-sdk)

Internally we use it in:
* The Cloud Code
* API Server

## Usage

The docs are available [here](http://docs.telerik.com/platform/backend-services/)

## Supported environments

* Browser - `<script src="path/to/sdk/everlive.all.js"></script>`
* Node.js - `var Everlive = require('everlive-sdk');`
* Cordova (Android, iOS, WindowsPhone) - `<script src="path/to/sdk/everlive.all.js"></script>`
* NativeScript (Android, iOS) - `var Everlive = require('everlive-sdk');` 

## Development

1. Make sure that you have *grunt-cli* installed globally. `$ npm install -g grunt-cli`
2. Run `$ npm install` in the root of the project.

The source code is available in the *src* folder. The entry point of the application is **index.js**.

To build the source code use:

```bash
$ grunt build
```

To build the source code on each change:

```bash
$ grunt buildWatch
```

The output is located in the root of the project - **everlive.js** and **everlive.map**.

To make a distibution build use the default grunt job:

```bash
$ grunt
```
It outputs the following files:

```
|-- root
    |-- dist
        |-- everlive.all.js
        |-- everlive.all.map
        |-- everlive.all.min.js
        |-- license
        |-- readme
|-- EverliveSDK.JS.zip
```

## Testing

We have setup automated tests for each supported environment. The tests are located in the *test* folder.

There are mobile projects for *Cordova* and *Nativescript* located in *test/mobile/Everlive(Cordova|NativeScript)*.
*Currently there are automated tests only for **Android**.*

External files for *Node.js* and *PhantomJs* are located in *test/external*.

### Setup

1. Setup Nativescript on your system -
    * [Windows](https://docs.nativescript.org/setup/ns-cli-setup/ns-setup-win.html)
    * [Linux](https://docs.nativescript.org/setup/ns-cli-setup/ns-setup-linux.html)
    * [OS X](https://docs.nativescript.org/setup/ns-cli-setup/ns-setup-os-x.html)
2. Setup Cordova on your system - [https://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html](https://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html)

Also make sure to setup [ADB](http://developer.android.com/tools/help/adb.html) on your system.

And *grunt-cli* if not already installed:

```bash
$ npm install -g grunt-cli
```

### Running tests

The easiest way is to open an .html file in the browser - *test/suites/everlive-caching/everlive-caching.html*.

To run all tests against all platforms sequentially run:

```bash
$ grunt test
```

Most of the times you will want to run them against specific platforms:

```bash
$ grunt test --platform desktop|nodejs|cordova|nativescript
```

If you want to run only a specific suite *(test/suites/everlive-anything)* specify the `suite` flag.
By convention it tries to find the suite in *test/suites/(suite)/(suite).html*.

```bash
$ grunt test --platform cordova --suite everlive-files
```

The test results are shown in the console and written as *tap reports* in *test/testResults(platform).tap*:

```
1..770
ok 0 Everlive data -  Online  EmailSubscribers Everlive data -  offline control offline should throw when offline not enabled
ok 1 Everlive data -  Online  EmailSubscribers Everlive data -  offline control isOffline should throw when offline not enabled
not ok 2 Everlive data -  Online  EmailSubscribers Everlive data -  offline control isOnline should throw when offline not enabled -   AssertionError: expected 'expected false to be truthy' to equal 'You have instantiated the SDK without support for offline storage'
```

### Configuration

Each platform's tests are ran against a different backend-services project. These settings can be changed in *test/suites/externalconfig.template.js*.

### Creating tests

Write the actual tests in the *test/suites/everlive-(suite)* folder. Each such folder should have a *everlive-(suite).html*
file which specifies its tests:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Everlive tests</title>
</head>
<body>
<script src="../../TestRunner.js" data-js="everlive-caching.test.js"></script>
</body>
</html>
```

A simple test:

```js
describe("Test", function () {
    ok(1 === 1);
}
```

This will load all the scripts and css needed by default (see *test/TestRunner.js*), create a *div[id=mocha]* and add
the scripts specified in the *data-js* attribute.

The TestRunner can be accessed from `window.runner`.
