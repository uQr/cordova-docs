#General Cordova Tips and Workarounds
This document covers tips, tricks, and known workarounds for general issues with Cordova or Tools for Apache Cordova

It covers the following issues and tips:

1. [Building a Cordova project from source control results in a successful build, but with Cordova plugin APIs not returning results when the app is run](#missingexclude)
1. ["TypeError: Request path contains unescaped characters" during a build or when installing a plugin](#cordovaproxy) 
1. [Using a Specific Version of a GitHub Sourced Plugin](#plugin-github) 

<a name="missingexclude"></a>
##Building a Cordova project from source control results in a successful build, but with Cordova plugin APIs not returning results when the app is run
Due to a bug in the VS templates in VS 2015 RC, four json files that can cause issues if added to source control are missing from the default source code exclusion list: 

- plugins/android.json
- plugins/windows.json
- plugins/remote_ios.json
- plugins/wp8.json. 

Adding these files to source control can result in a build that appears to succeed but is missing plugin native code. They should only be included if the "platforms" folder is also checked in which is not recommended. 

A telltale sign that you are encountering this issue is that the build appears to succeed and the app starts up properly but Cordova plugin APIs do not appear to function and no error can be found in the JavaScript console. On further inspection in the **Output Window** you may see an exception similar to the following when debugging an Android version of your app:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
W/System.err( 1425): java.lang.ClassNotFoundException: org.apache.cordova.camera.CameraLauncher
W/System.err( 1425):  at java.lang.Class.classForName(Native Method)
W/System.err( 1425):  at java.lang.Class.forName(Class.java:251)
W/System.err( 1425):  at java.lang.Class.forName(Class.java:216)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The missing class would be recognizable as a Cordova plugin class such as "org.apache.cordova.camera.CameraLauncher" from the camera plugin.

Remediation is fortunately simple: Remove these files (plugins/android.json, plugins/windows.json, plugins/remote_ios.json, and plugins/wp8.json) from source control check the project out again.

<a name="cordovaproxy"></a>
##"TypeError: Request path contains unescaped characters" during a build or when installing a plugin
When building or installing a plugin you may encounter an error if you are using a proxy with certain versions of Node.js and Cordova after a "npm http GET". Ex:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm http GET https://registry.npmjs.org/cordova-android/3.7.1
TypeError: Request path contains unescaped characters.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The root cause of this error is certain versions of Cordova reference an older version of npm that has some compatiblity issues with proxy settings on newer versions of Node.js. Additional details on the issue and potential workarounds can be found [here](https://github.com/driftyco/ionic-cli/issues/321).

The simplest workaround is to **downgrade Node.js to 0.10.29**. This will be resolved in a future version of Cordova.

<a name="plugin-github"></a>
##Using a Specific Version of a GitHub Sourced Plugin
From time to time you may try to use a Cordova plugin from GitHub but find that specifying the Git URI to the plugin gives you a development version rather than a release version. If the plugin author is using GitHub's release features, you can fairly easily access and use older versions of the plugin. Here's how:

1. Go to the GitHub repository for the plugin. Ex: https://github.com/wildabeast/BarcodeScanner

2. Click on the "Releases" tab

3. Click on the .zip link of the version of the plugin you want to access

	![Release Zip](<media/git-local-0.png>)

4. Unzip this plugin on your local filesystem

5. Add the plugin to your project from this local location by using the "Local" option in the "Custom" tab of the config.xml designer.

	![Custom Local Plugin](<media/git-local-1.png>)
	
## More Information
* [Read tutorials and learn about tips, tricks, and known issues](../../Readme.md)
* [Download samples from our Cordova Samples repository](http://github.com/Microsoft/cordova-samples)
* [Follow us on Twitter](https://twitter.com/VSCordovaTools)
* [Visit our site http://aka.ms/cordova](http://aka.ms/cordova)
* [Read MSDN docs on using Visual Studo Tools for Apache Cordova](http://go.microsoft.com/fwlink/?LinkID=533794)
* [Ask for help on StackOverflow](http://stackoverflow.com/questions/tagged/visual-studio-cordova)
* [Email us your questions](mailto:/vscordovatools@microsoft.com)

