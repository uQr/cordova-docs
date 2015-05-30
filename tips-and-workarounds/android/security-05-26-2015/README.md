#May 26th, 2015 Android Cordova Platform Security Issue
Recently Trend Micro uncovered a security flaw in the Cordova Android platform that affects all versions of Cordova and as a result the Cordova [community has taken steps to resolve the issue](http://cordova.apache.org/announcements/2015/05/26/android-402.html). 

While we are working with the community on a “tools release” for Cordova to update the default version of the Android “platform” to include this patch, you can immediately update your project to a patched version of the Android platform for Cordova 4.3.0 or 5.0.0 when using with Tools for Apache Cordova 2015 RC by following the steps in this article.

##Updating Your Project

First, you need to add one XML element into config.xml in your project.

1. In Visual Studio, right click on config.xml and select “View Code”
2. When using the default version of Cordova 4.3.0, add the following under the root \<widget\> element in config.xml:

    ~~~~~~~~~~~~~~~~~~~~~~~
    <engine name="android" version="3.7.2" />
    ~~~~~~~~~~~~~~~~~~~~~~~~

    …or if you opted to update to Cordova 5.0.0:

    ~~~~~~~~~~~~~~~~~~~~~~~~
	<engine name="android" spec="4.0.2" />
    ~~~~~~~~~~~~~~~~~~~~~~~~

For projects you have **already built at least once for Android locally**, you’ll also need to remove the old version of the Cordova Android platform. Follow these steps:

1.	Open a command prompt and go to your Cordova project root (not the solution root). 

2.	Type the following commands:

	~~~~~~~~~~~~~~~~~~~~~~~~
	npm install -g cordova
	cordova platform remove android
	~~~~~~~~~~~~~~~~~~~~~~~~

The next time you build you will now be on the patched version of the Android platform.

To make this simple, [you can find updated version of the VS template config.xml files here](https://github.com/Microsoft/cordova-docs/tree/master/tips-and-workarounds/android/security-05-26-2015) along with a batch file that will remove the old version of the Android platform when executed from your project folder.

##Long Term

An upcoming “tools releases” of Cordova will use the patched versions of the Cordova Android platform by default. We will be updating the default templates in Visual Studio to use these newer versions of Cordova, but it is also worth noting that we’ve made changes in Visual Studio 2015 RC to make updating the Cordova version itself simple. To do so, follow these steps:

1.	Double click on config.xml in your project
2.	Click the “Platforms” tab
3.	Enter the updated version of the Cordova CLI

From this point forward you will be on the updated version of Cordova and its associated platforms.
