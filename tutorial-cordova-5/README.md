#Using Apache Cordova 5
**Note that this documentation applies to Visual Studio 2015 and does not apply to Visual Studio 2013 CTPs.**

Tools for Apache Cordova supports cordova 4.3.1 along with the newly released Cordova 5.1.1 version of cordova. As the major version number increase implies, Cordova 5 is a departure from 3.x and 4.x versions of Cordova in a number of very important ways. Note that there were a number of issues with Cordova 5.0.0 itself that kept us from recommending its use including an [Android security issue](https://github.com/Chuxel/cordova-docs/tree/master/tips-and-workarounds/android/security-05-26-2015). As a result, we strongly reccomend the use of **Cordova 5.1.1** with **Visual Studio 2015 RTM** and up.

This article will summarize the changes in Cordova 5 and how you can take advantage of some of its new features and adapt existing apps. Specifically it will cover:

1. [Security model changes to the Android and iOS platforms](#security)
1. [Primary Cordova plugin repository switching to npm](#npm)
1. [Gradle build instead of Ant for Android](#gradle)
1. [Pluggable WebViews and the Crosswalk WebView for Android](#crosswalk)
1. [Windows 10 support and improved Cordova interoperability](#win10)

New projects created using Tools for Apache Cordova will automatically use Cordova 4.3.1. You can switch to this version of Cordova by following these steps:

1. Double click on config.xml

2. Select the "Platforms" left navigation tab

3. Change the version number to 5.1.1 and save config.xml

	![Select Cordova Version](<media/cordova-5-0.png>)

Note that when you build this will **automatically remove any existing contents in the platforms folder in the filesystem**. If you have opted to customize the native project, you should consider migrating your custom assets to the **res/native** folder (ex: res/native/android) which will automatically add the files to the project before preparing the Cordova project to build. 

However, you will want to exercise care here since **Android in particular has undergone significant revisions in Cordova 5.** The remainder of this article will highlight these updates and cover tips for adapting your existing apps to these changes.

###A Note on Cordova Version Numbers
Historically Cordova and all its components have used one unified version number. This was particularly true with Cordova versions prior to 3.0.0. Underneath the hood this changed when Cordova 4.0.0 was released but most end users were never exposed to this difference. With the release of Cordova 5.0.0 you may also see reference to the release of "Cordova Android 4.0.0." It's important to note that this does not refer to the top level Cordova version but instead the **platform** version. You can think of a platform in many ways as a native project generator combined with a set of scripts designed to build the app.

Understanding these differences can be important when reading blog posts or updates on the Cordova web site. Here is how these different components are typically described:

- **Cordova 5.1.1** refers to version 5.1.1 of the [Cordova CLI](http://cordova.apache.org/docs/en/5.0.0/guide_cli_index.md.html#The%20Command-Line%20Interface) (and an underlying core library called [cordova-lib](https://www.npmjs.com/package/cordova-lib)). [Documentation](http://cordova.apache.org/docs/en/5.0.0/guide_overview_index.md.html#Overview) on the Cordova web site will also refer to this version number.

- **Cordova CLI 5.1.1** is largely equivalent to Cordova 5.1.1 but is specifically referring to the [Cordova CLI npm package](https://www.npmjs.com/package/cordova).

- **Platform versions** follow a different numbering scheme. A given Cordova CLI version "pins" a set of platform versions by default since all testing for the release was done using this specific combination of components. The Cordova OSS project does not typically back-test earlier versions of the CLI with newer platforms unless specifically noted in the release notes. You will typically see these platform versions mentioned in a form similar to "Cordova Android 4.0.0". This naming scheme inherits its name from the [cordova-android](https://www.npmjs.com/package/cordova-android) and other similarly named npm packages that are installed when the platform is added to your project. Visual Studio will automatically perfom this "platform add" operation on your behalf but you may notice a version number like this in the Output Window when you build.
	
	The following Cordova platform versions supported by Tools for Apache Cordova are pinned in **Cordova CLI 5.1.1** (or [see here](http://cordova.apache.org/news/2015/06/10/tools-release.html) for a complete list):
	
	- Cordova Android 4.0.2
	- Cordova iOS 3.8.0
	- Cordova Windows 4.0.0
	- Cordova WP8 3.8.1

Other components are also versioned independantly, but typically you will not be directly exposed to them. It is the release of Cordova Android 4.0.0 that triggered the major version increase for Cordova as a whole given it had a number of breaking changes. Windows 4.0.0 is also a major release that includes Windows 10 support but was designed to not have breaking changes when building for Windows or Windows Phone 8.1.

Note that you can actually add different platform versions to your project for a given CLI version through the use of some XML elements or command line options for edge case scenarios. See the [May 26th, 2015 Android Cordova Platform Security Issue](../tips-and-workarounds/android/security-05-26-2015) article for a specific example of how this works. 
	
<a name="security"></a>
##Security Model Changes for Android and iOS
One of the more confusing changes about Cordova 5 is that the updated version of the Android platform (also called Cordova Android 4.x) and iOS now follow a different, but more powerful security model designed to provide developers with the tools needed to prevent cross-site scripting attacks among other issues. A critical aspect of this security model is that **absolutely no network access of any kind is allowed without the installation of a Cordova plugin**.

There are a whole host of new security features available and we **strongly reccomend you read the [Introduction to Cordova 5 Security](./cordova-5-security.md) document** for a introduction on them. This article will focus on getting you up and running with the basics.

###The New Whitelist Plugin
The new [Cordova Whitelist plugin (cordova-plugin-whitelist)](https://github.com/apache/cordova-plugin-whitelist) is the recommended base security plugin to use for managing network security access. Historically there was one **access** element in config.xml element used to control all access to network resources. For example, adding the following to config.xml resulted in the app not only being able to make XHR calls, access images, or reference remote scripts but also allowed Cordova to navigate to any URI. 

The problem with this model is you may want to be able to make an XHR request to a service like Azure Mobile Services without actually allowing your app to navigate to an Azure web page in the same domain. The reason this is a concern is that this remote web page is then given access to all Cordova and plugin APIs. Further, for Android, the access element has been overloaded to control "intents" in the wake of a discovered [security issue in Cordova 3.5.0 and below](http://cordova.apache.org/announcements/2014/08/04/android-351.html) which has led to a syntax that strayed away from the original [W3C Widget spec](http://www.w3.org/TR/widgets/) that config.xml's structure is based on. Some restructuring and improvements were therefore appropriate for the Cordova 5.0.0 release.
	
As a result, the new whitelist plugin actually introduces three separate elements designed to enable more discrete control. The **access** element returns but only controls where your app can make XHR requests or access other external content from a web page for Android and iOS. It no longer controls whether you can navigate to a different domain. A new **allows-navigation** element has been added that then enables you to specify where the app can navigate instead. Finally, a new **allows-intent** element has been introduced specifically designed to control Android intents.

Projects created using the Cordova CLI contain fairly restrictive rules that are intended to represent a reasonable starting point for most projects. Specifically it:

1. Allows XHR and images to originate from any URL
2. Disallows navigation to external URLs (hosted content)
3. Disallows inline script (Meaning no &lt;script&gt; tags or "on" attributes on HTML elements) on recent versions of Android, iOS, or Windows via a W3C Content Security Policy (CSP) in index.html  
4. Allows the "tel:", "sms:", "mailto:", and "geo:" intents

You'll want to start your project with roughly these same defaults and alter as needed. See below for how to add these defaults to your porject and the [Introduction to Cordova 5 Security](./cordova-5-security.md) document for details on why these defaults are in palce and how to change them.

###Configuring Security Settings from a VS Project
When you upgrade a project to Cordova 5.0.0+, you will want to take the following steps to if you wish to mirror the base security policy listed above. You can then customize as needed to meet your needs. 

1. Add the whitelist plugin to your project via config.xml:

	1. Right-click on config.xml and select "View Code"

	2. Add the following XML elements under the &lt;widget&gt; element:

	~~~~~~~~~~~~~~~~~~~~~~~
	<vs:plugin name="cordova-plugin-whitelist" version="1.1.0" />
	~~~~~~~~~~~~~~~~~~~~~~~
	
	The next time you build in Visual Studio, VS will install this version of the whitelist plugin. You can update the version number as needed.

2. Update config.xml with the allow-intent or allow-navigation elements as needed:
	1. If you have not already, right-click on config.xml and select "View Code"

	2. Add the following XML elements under the &lt;widget&gt; element:
	
		~~~~~~~~~~~~~~~~~~~~~~~
		<allow-intent href="http://*/*" />
		<allow-intent href="https://*/*" />
		<allow-intent href="tel:*" />
		<allow-intent href="sms:*" />
		<allow-intent href="mailto:*" />
		<allow-intent href="geo:*" />
		~~~~~~~~~~~~~~~~~~~~~~~
		
		You should already have an &lt;access&gt; element in your config.xml. You can use the "Domain Access" list under the "Common" tab in the config.xml designer to add or edit your current list.

	3. Optionally, you can allow navigation to hosted content by adding URLs to config.xml as follows:
	
		~~~~~~~~~~~~~~~~~~~~~~~
		<allow-navigation href="http://www.microsoft.com" />
		~~~~~~~~~~~~~~~~~~~~~~~

3. Add a Content Security Policy (CSP) to your HTML pages:
	1. Add the following &lt;meta&gt; tag to each of your top level HTML pages (like index.html). 
	
		~~~~~~~~~~~~~~~~~~~~~~~
		<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">
		~~~~~~~~~~~~~~~~~~~~~~~
	
		Note: It does not need to be added to pages dynamically loaded by a JavaScript framework like AngluarJS or WinJS - many times you just need to add it to index.html.
		
	2. Customize the CSP policy to meet your needs. See [Introduction to Cordova 5 Security](./cordova-5-security.md) for details.
	
	3. You may wish to use the Crosswalk WebView plugin when targeting earlier versions of Android as CSP support was not introduced until Android 4.4. See [the section on Crosswalk later in this article](#crosswalk) for additional tips on using Crosswalk.
	
<a name="npm"></a>
##Primary Cordova Plugin Repository is Now Npm
Another significant departure in Cordova 5 and the community as a whole is the migration of the primary source of Cordova plugins from the custom repository backed model that exists in Cordova 3.x and 4.x to the "Node Package Manager" (npm) repository. The plugins.cordova.io repository has seen a few service interruptions and given the web community's increased use of Node.js for client-side development and Cordova's heavy use of npm for not only its command line interface but as a source for Cordova "platforms," the natural next step was to migrate plugins to npm as well. More details on this transition [can be found here.](http://cordova.apache.org/announcements/2015/04/21/plugins-release-and-move-to-npm.html)

However, unfortunately this switch over is not transparent. For a few very specific reasons, this change over can be a bit confusing and we're working with the community to determine some ways to make the transition a bit more seamless going forward.

###Plugin ID Changes
A significant change to be aware of is that the IDs used to refer to many Cordova plugins have changed. This was done for two reasons. First, the different ID helps to re-enforce that older versions of Cordova will not get plugin updates. Rather than having an arbitrary version number where the updates stop, using a different ID makes this change over explicit. Second, the old reverse domain style for Cordova plugin IDs does not conform to community best practices for package names in npm.

As a result, core plugins like Camera have changed from [org.apache.cordova.camera](http://plugins.cordova.io/#/package/org.apache.cordova.camera) in version 0.3.6 of the plugin to [cordova-plugin-camera](https://www.npmjs.com/package/cordova-plugin-camera) in versions 1.0.0 and higher. 

![Custom Local Plugin](<media/cordova-5-4.png>)

![Custom Local Plugin](<media/cordova-5-5.png>)

You can find running list of [old verses new plugin IDs in this location](https://github.com/stevengill/cordova-registry-mapper/blob/master/index.js). You will be informed of the new ID whenever you add a plugin from this list when either using the command line or the config.xml designer. The config.xml designer will automatically add these new IDs for Cordova 5.0.0+ and the old IDs for older versions of Cordova that do not support them.

###Cordova Plugin Registry
Unfortunately the community is in a state of flux when it comes to a "source of truth" for all available Cordova plugins. 

- For the time being, [plugins.cordova.io](http://plugins.cordova.io) **does not contain npm sourced plugins.** 
- For npm sourced plugins, you should instead search npm using the [ecosystem:cordova](https://www.npmjs.com/search?q=ecosystem%3Acordova) tag.

	![Custom Local Plugin](<media/cordova-5-6.png>)

Both sets of plugins can be used with Cordova 5.0.0+ so in the short term you should search in both locations for plugins. Plugins found in npm are the most likely to work without issue with Cordova 5.0.0 and higher and may or may not work with earlier versions of Cordova. Npm will be the eventual source of truth, but things are a bit messy during this transition period.

We are actively working with the community on the best way to merge some of the functionality of the existing plugins.cordova.io site with the reliability and improvements npm provides.

<a name="no-npm-3.x"></a>
###Cordova 3.x and 4.x Don't Support Npm as a Plugin Source
An early source of confusion can lead from the fact that Cordova 3.x and 4.x cannot use plugins sourced from npm. The Cordova CLI in these versions simply does not have the capability. A specific issue that can come up here is that updates to plugins will now generally be going to npm **not** the older plugin registry sourced method used by these earlier version of Cordova plugins.

Generally your best course of action if you need an updated plugin is to also update to Cordova 5.1.1 or later. See the [tips and workarounds](../tips-and-workarounds/general/README.md#plugin-npm) section if you absolutley must get an updated plugin for a project that uses an earlier version of Cordova for potential options.

<a name="gradle"></a>
##Gradle Build Instead of Ant for Android
On the surface, this seems like a fairly innocuous change but we've continued to hear about unexpected issues in some 3rd party Cordova plugins because of this change so it is worth a mention.

Up until Cordova 5.0.0 (Cordova Android platform version 4.0.0), Cordova used  [Apache Ant](http://ant.apache.org/) as the primary build system to build an Android version of an app. This has now changed to [Gradle](http://gradle.org/) as the default though developers can force an Ant build using the Cordova CLI as follows:

~~~~~~~~~~~~~~~~~~~~~~~
cordova build android -- --ant
~~~~~~~~~~~~~~~~~~~~~~~

There are three major ways that switching to Gradle can affect your project:

1. The way you specify signing information is different. See the [Packaging & Publishing tutorial for details](../tutorial-package-publish).
1. Some 3rd party plugins may now require Gradle and thus typically only work on Cordova 5.0.0 and up. In particular, plugins that modify Android build artifacts in a non-standard way can run into issues.
1. Other 3rd party plugins may not have updated to support Gradle yet and still require Ant to be used. Generally these plugins are designed for Cordova versions < 5.0.0.

A good example of a plugin that requires Gradle is the [Crosswalk plugin](https://github.com/crosswalk-project/cordova-plugin-crosswalk-webview) we will cover a bit in this article. While at one point it also worked with Ant builds, it now errors out if you are not building with Gradle. As a result, Visual Studio 2015 now uses Gradle to build Android in Cordova 5.0.0+ instead of Ant (2015 RC still used Ant). The end result is you could hit compatibility issues with lesser known 3rd party plugins particularly if you have not updated them.

<a name="gradle-migrate"></a>
###Migrating an Existing Project to Use Gradle
Because of these differences you should take the following steps:

1. If you encounter an unexpected build error specifically for Android, see if the error references Cordova plugin source code. If so, update it by removing the plugin using the "Installed" tab of the config.xml designer and re-add the plugin. If you cannot determine which plugin is causing the issue, you can opt to proactively upgrade all of them. 

2. If a plugin update doesn't solve the issue, try these steps to eliminate other factors.
	1. Create a fresh project and see if the problem reproduces.
	2. To eliminate Visual Studio as a potential culprit, you can test using a standard Cordova CLI project by entering the following in a command prompt:
	
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		npm install -g cordova@5.1.1
		cordova create testProj
		cd testProj
		cordova platform add android
		cordova plugin add cordova-plugin-in-question
		cordova build android
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	
		... replacing the Cordova version and plugin name for those that apply to your situation. You can also specify a fully qualified Git URI or filesystem path in place of the plugin name.
	
	2. If the problem reproduces, you may  want to contact the plugin author and let them know about the problem. Before doing so, be sure to check for existing open issue as more than likely there's already one on the plugin author's GitHub site that you can use to provide additional information. Mention that you encountered issues when using Tools for Apache Cordova but include the Cordova CLI repro for the plugin author's benefit. See the [tips and workarounds](../tips-and-workarounds/general/README.md#plugin-troubleshoot) section of our docs for additional troubleshooting tips.

3. If you've already added release signing information into ant.properties in your project, you'll need to place this information in a new file in your project.  See the [Packaging & Publishing tutorial for details](../tutorial-package-publish) for details.

<a name="crosswalk"></a>
##Pluggable WebViews and the Crosswalk WebView for Android
An exciting new development in the Cordova Android platform is the support for what are called "pluggable WebViews." What this feature allows you to do is swap out the built in Android WebView with a completely different WebView implementation. This is a significant improvement as the Android browser and thus the WebView has been locked at a specific version without the ability to update unless you update the version of the OS on the device. This has changed in the Android OS as of 5.0 (API 22), but unlike iOS or Windows where devices can opt to upgrade and developers need only concern themselves with a few major versions of the browser, older Android devices are locked at a particular sub-revision of Android and thus the browser with no ability to upgrade the device in many cases. The end result has been a vast array of small differences between Android devices.

[Crosswalk](https://crosswalk-project.org/) is a project that is designed to allow developers to take embed a very recent and specific version of the Chromium WebView inside their Android app. The Crosswalk WebView can be embedded in apps running on Android 4.0 and up and brings with it the significant advantage of a consistent WebView implementation across all Android device versions it supports.

There is now a [Cordova Crosswalk plugin](https://www.npmjs.com/package/cordova-plugin-crosswalk-webview/) that takes advantage of the new pluggable WebView features in Cordova 5.0.0+ (and the Cordova Android 4.0.0 platform it uses) and makes it simple to add into your project.

*Note: Because using the Crosswalk plugin does slow down build times fairly significantly given its size, **we recommend developers start out building apps with the stock Android WebView** on a recent device or emulator (Android 4.4+). You can then add the Crosswalk plugin later in your development cycle and make the necessary adjustments.*

###Installing the Crosswalk Plugin from VS
To use the Crosswalk WebView plugin from Visual Studio, follow these steps:
	
1. Right-click on config.xml and select "View Code"
	
2. Add the following XML elements under the &lt;widget&gt; element:

	~~~~~~~~~~~~~~~~~~~~~~
	<vs:plugin name="cordova-plugin-crosswalk-webview" version="1.2.0" />
	~~~~~~~~~~~~~~~~~~~~~~

The next time you build, your app will be running in the Crosswalk WebView. Note that the first build for Android in particular will take a bit given the plugin does some dynamic acquisition.

If you are using the standard Android Emulator, be sure to check the **Use Host CPU** option in the AVD you create and have up to date graphics drivers installed on your system or the app will crash due to Crosswalk's support of WebGL.

![Use Host GPU](<media/cordova-5-1.png>)

<a name="win10"></a>
##Windows 10 Support
Historically, Windows and Windows Phone 8.1 have had a number of compatibility challenges with Cordova apps due to underlying platform differences around security rules. A [JavaScript compatibility](https://github.com/MsopenTech/winstore-jscompat) framework was released to help alleviate some of these issues on 8.1, but starting with **Cordova 5.1.1**, you can now build Windows 10 apps. In addition to supporting the new Windows Universal platform that allows a single code base and app package to be used across a number of different devices, Windows 10 also brings a number of significant improvments to Apache Cordova users.  

In particular:
1. Elimination of the existing dynamic content restrictions in Windows 8.0 and 8.1.
2. Cordova plugin support for external hosted content through the use of the same &lt;allow-navigation&gt; element used by Android and iOS.
3. Support for the powerful Content Security Policy (CSP) that is also now reccomended for use with the Android and iOS Cordova platforms.  See [this article for more details](./cordova-5-security.md).
4. Apps can now run in two different security modes:
	1. Remote mode: The default, flexible security mode that only has a hand full of store submission restrictions
	2. Local mode: A more secure mode that adds additional protections but disables hosted content and inline script

These improvements mean that Windows 10 apps provide you with a flexible, yet secure platform that is more compatible with their Android and iOS counterparts in Cordova than ever before.

Check out the [Cordova Windows 10](http://cordova.apache.org/docs/en/5.1.1/guide_platforms_win8_win10-support.md.html#Cordova%20for%20Windows%2010) documentation for more information on new features.

Follow these steps to use Cordova Windows 10 with Visual Studio:

1. Install the [Windows 10 Tools for Visual Studio](http://www.microsoft.com) if you have not already.

2. In your project, open the config.xml designer by double clicking on config.xml

3. Click on the "Windows" tab

4. Change the "Windows Target Version" to "Windows 10.0"

	![Select Cordova Version](<media/cordova-5-8.png>)

That's it! Underneath the convers Cordova will switch from an 8.1 project to a new Universal App project and take care of the rest! Just use the "Debug" dropdown to deploy to a Windows 10 device, use your Windows 10 PC, or use a Windows 10 emulator.

## More Information
* [Learn about security features in Apache Cordova 5](./cordova-5-security.md)
* [Read tutorials and learn about tips, tricks, and known issues](../Readme.md)
* [Download samples from our Cordova Samples repository](http://github.com/Microsoft/cordova-samples)
* [Follow us on Twitter](https://twitter.com/VSCordovaTools)
* [Visit our site http://aka.ms/cordova](http://aka.ms/cordova)
* [Read MSDN docs on using Visual Studio Tools for Apache Cordova](http://go.microsoft.com/fwlink/?LinkID=533794)
* [Ask for help on StackOverflow](http://stackoverflow.com/questions/tagged/visual-studio-cordova)
* [Email us your questions](mailto:/vscordovatools@microsoft.com)