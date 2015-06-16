
#**Apache Cordova 5.x.x Related Known Issues**
This article covers [known issues](../Readme.md#knownissues) related to Visual Studio Tools for Apache Cordova 2015 when building or deploying using Apache Cordova 5.0.0+. 

In general we recommend **using Cordova 5.1.1 or above** instead of 5.0.0 as there are a number of issues including a security hole with Cordova 5.0.0.

##Apache Cordova 5.x.x General Issues
----------
**Cannot access any network resources from Android app:** The Android platform contained within Cordova 5.0.0+ does not have a "whitelist" plugin installed by default and therefore blocks network access by default. There are now two whitelist plugins that can be installed:

 - Installing “cordova-plugin-legacy-whitelist” will cause the platform to behave the way it did in 4.x and enables the "Domain Access" list in the configuration designer. You can install it from the command
   line or using https://github.com/apache/cordova-plugin-legacy-whitelist.git from the Custom tab of the configuration designer.
    
 - Installing “cordova-plugin-whitelist” results in some new behaviors and introduces new config.xml elements that can be added manually by right clicking on config.xml and selecting "View Code." You can install it from the command line or using
  https://github.com/apache/cordova-plugin-whitelist.git from the Custom tab of the configuration designer.

----------
**Ripple throws error when starting up Cordova:** Ripple does not function properly in Cordova 5.0.0 due to a newly introduced validation check. This problem was fixed in Cordova 5.1.1.

----------
**Missing Android SDK 22:** The Android platform in Cordova 5.0.0 requires Android SDK API Level 22 which is not pre-installed by Visual Studio. Install the SDK using the Android SDK manager.

##Apache Cordova 5.x.x and Visual Studio 2015 RC
----------
**Old versions of Cordova plugins due to Cordova plugin ID changes:** A significant change occurred with Cordova 5.0.0+ that also altered the IDs of many core Cordova plugins. The Visual Studio 2015 RC config.xml designer uses the old IDs (ex: org.apache.cordova.camera not cordova-plugin-camera) because Cordova 4.3.1 and below cannot access plugins using these new IDs and the default template uses 4.3.0. 

To install updated plugins, follow [this proceedure to install a npm sourced plugin](../tips-and-workarounds/general/README.md#plugin-npm). 

*Note that these updated plugins were tested on Cordova 5.0.0 or later and therefore may or may not work on earlier versions of Cordova.* We advise against updating your plugins when using older versions of Cordova unless you are attempting to solve a specific problem.
 
----------
**Visual Studio 2015 RC uses Ant to build Android with Cordova 5.x.x:** Visual Studio 2015 RC uses Ant to build Android while the command line has switched to Gradle by default in version 5.0.0 of the CLI. When switching between Visual Studio and the command line with the version of Android in Cordova 5.0.0, you may want to specify that the platform should be built with Ant instead if you are running into unexpected issues.

Ex:

    cordova build android -- --ant

You can also set an environment variable to keep this preference around for a command line session.

    set ANDROID_BUILD=ant

Finally, if you are still build errors, you may want to opt to remove and re-add the android platform after switching build systems.

    cordova platform remove android 
    cordova platform add android

----------
**Visual Studio 2015 RC cannot build an Android app with the Crosswalk plugin:** The Crosswalk Cordova plugin requires that Gradle be used to build Android to build but VS 2015 RC uses Ant. To build a project that uses the Crosswalk plug-in, you will need to build using the command line:

    npm install -g cordova 
    cordova platform remove android 
    cordova platform add android 
    
    cordova build android 
    
    or 
    
    cordova run android 
    
    or 
    
    cordova emulate android

----------
## More Information
* [Read up on additional known issues, tips, tricks, and tutorials](../Readme.md)
* [Download samples from our Cordova Samples repository](http://github.com/Microsoft/cordova-samples)
* [Follow us on Twitter](https://twitter.com/VSCordovaTools)
* [Visit our site http://aka.ms/cordova](http://aka.ms/cordova)
* [Read MSDN docs on using Visual Studo Tools for Apache Cordova](http://go.microsoft.com/fwlink/?LinkID=533794)
* [Ask for help on StackOverflow](http://stackoverflow.com/questions/tagged/visual-studio-cordova)
* [Email us your questions](mailto://multidevicehybridapp@microsoft.com)

