#Using Crosswalk to Reduce Android fragmentation
An exciting new development in the Cordova Android platform is the support for what are called "pluggable WebViews." What this feature allows you to do is swap out the built in Android WebView with a completely different WebView implementation. This is a significant improvement as the Android browser and thus the WebView has been locked at a specific version without the ability to update unless you update the version of the OS on the device. This has changed in the Android OS as of 5.0 (API 22), but unlike iOS or Windows where devices can opt to upgrade and developers need only concern themselves with a few major versions of the browser, older Android devices are locked at a particular sub-revision of Android and thus the browser with no ability to upgrade the device in many cases. The end result has been a vast array of small differences between Android devices.

[Crosswalk](https://crosswalk-project.org/) is a project that is designed to allow developers to take embed a very recent and specific version of the Chromium WebView inside their Android app. The Crosswalk WebView can be embedded in apps running on Android 4.0 and up and brings with it the significant advantage of a consistent WebView implementation across all Android device versions it supports.

There is now a [Cordova Crosswalk plugin](https://www.npmjs.com/package/cordova-plugin-crosswalk-webview/) that takes advantage of the new pluggable WebView features in Cordova 5.0.0+ (and the Cordova Android 4.0.0 platform it uses) and makes it simple to add into your project.

*Note: Because using the Crosswalk plugin does slow down build times fairly significantly given its size, we recommend developers start out building apps with the stock Android WebView on a recent device or emulator (Android 4.4+). You can then add the Crosswalk plugin later in your development cycle and make the necessary adjustments.*

##Installing the Crosswalk Plugin from VS
To use it from Visual Studio, follow these steps:

1. Install VS 2015 RTM or later (not RC)
2. Open the config.xml designer by double clicking on config.xml
3. Verify you have set the Cordova version to 5.1.1 or higher under the "Platforms" tab.
4. Go to "Plugins" tab
5. Select "Crosswalk"
6. Click "Add"

The next time you build, your app will be running in the Crosswalk WebView. Note that the first build for Android in particular will take a bit given the plugin does some dynamic acquisition.

##The Base Android Emulator and Crosswalk
One very important thing to note when using the Crosswalk WebView in the base Android emulator is that Crosswalk requires OpenGL support and that you've selected the "Use Host GPU" option in your Android Virtual Device configuration. Failing to do this will cause the app to crash. To use it:

1. Be sure your graphics drivers are up to date on your machine

2. Follow the [instructions for configuring a high speed Android emulator](https://msdn.microsoft.com/en-us/library/dn757059.aspx)

3. Check the **Use Host CPU** option in the AVD you create

	![Use Host GPU](<media/cordova-5-1.png>)

##3rd Party Cordova Plugin Issues Due to Pluggable WebView Changes
As the major version number increase implies, there are some breaking changes to some of the interfaces internal to Cordova that some plugins may take advantage of to accomplish certain tasks. Many of these were necessary changes needed to enable pluggable WebView support. Plugin authors are now in the process of adapting to these changes.

As with Gradle, if you encounter an unexpected build error specifically for Android, see if the error references Cordova plugin source code. If so, update it by removing the plugin using the "Installed" tab of the config.xml designer and re-add the plugin. If you cannot determine which plugin is causing the issue, you can opt to proactively upgrade all of them.

If the problem persists, see the recommendations in the [tips and workarounds](../tips-and-workarounds/general/README.md#plugin-troubleshoot) section of our docs for additional troubleshooting tips.

## More Information
* [Read more about Apache Cordova 5](./README.md)
* [Learn about security features in Apache Cordova 5](./cordova-5-security.md)
* [Read tutorials and learn about tips, tricks, and known issues](../Readme.md)
* [Download samples from our Cordova Samples repository](http://github.com/Microsoft/cordova-samples)
* [Follow us on Twitter](https://twitter.com/VSCordovaTools)
* [Visit our site http://aka.ms/cordova](http://aka.ms/cordova)
* [Read MSDN docs on using Visual Studo Tools for Apache Cordova](http://go.microsoft.com/fwlink/?LinkID=533794)
* [Ask for help on StackOverflow](http://stackoverflow.com/questions/tagged/visual-studio-cordova)
* [Email us your questions](mailto:/vscordovatools@microsoft.com)