#General Cordova Tips and Workarounds
This document covers tips, tricks, and known workarounds for general issues with Cordova or Tools for Apache Cordova

It covers the following issues:

1. ["TypeError: Request path contains unescaped characters" during a build or when installing a plugin](#cordovaproxy) 

<a name="cordovaproxy"></a>
##"TypeError: Request path contains unescaped characters" during a build or when installing a plugin
When building or installing a plugin you may encounter an error if you are using a proxy with certain versions of Node.js and Cordova after a "npm http GET". Ex:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm http GET https://registry.npmjs.org/cordova-android/3.7.1
TypeError: Request path contains unescaped characters.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The root cause of this error is certain versions of Cordova reference an older version of npm that has some compatiblity issues with proxy settings on newer versions of Node.js. Additional details on the issue and potential workarounds can be found [here](https://github.com/driftyco/ionic-cli/issues/321).

The simplest workaround is to **downgrade Node.js to 0.10.29**. This will be resolved in a future version of Cordova.
