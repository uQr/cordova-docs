#Using Apache Cordova 5
**Note that this documentation applies to Visual Studio 2015 and does not apply to Visual Studio 2013 CTPs.**

Tools for Apache Cordova supports cordova 4.3.1 along with the newly released Cordova 5.1.1 version of cordova. As the major version number increase implies, Cordova 5 is a departure from 3.x and 4.x versions of Cordova in a number of very important ways. Note that there were a number of issues with Cordova 5.0.0 itself that kept us from recommending its use including an [Android security issue](https://github.com/Chuxel/cordova-docs/tree/master/tips-and-workarounds/android/security-05-26-2015). As a result, we strongly reccomend the use of **Cordova 5.1.1** with **Visual Studio 2015 RTM** and up.

This article will summarize the changes in Cordova 5 and how you can take advantage of the new features and adapt existing apps. Specifically it will cover:

1. [Security model changes to the Android and iOS platforms](#security)
1. [Primary Cordova plugin repository switching to npm](#npm)
1. [Gradle build instead of Ant for Android](#gradle)
1. [Pluggable WebViews and the Crosswalk WebView for Android](#crosswalk)

New projects created using Tools for Apache Cordova will automatically use Cordova 5.2.0 **TODO: Final RTM version**. For existing projects, you can switch to this version of Cordova by following these steps:

1. Double click on config.xml

2. Select the "Platforms" left navigation tab

3. Change the version number to 5.2.0 and save config.xml

	![Select Cordova Version](<media/cordova-5-0.png>)

Note that when you build this will **automatically remove any existing contents in the platforms folder in the filesystem**. If you have opted to customize the native project, you should consider migrating your custom assets to the **res/native** folder (ex: res/native/android) which will automatically add the files to the project before preparing the Cordova project to build. However, you will want to exercise care here since Android in particular has undergone significant revisions in Cordova 5.

The remainder of this article will highlight these updates and cover tips for adapting your existing apps to these changes.

<a name="security"></a>
##Security Model Changes for Android and iOS
One of the more confusing changes about Cordova 5 is that the updated version of the Android platform (also called Cordova Android 4.x) and iOS now follow a different, but more powerful security model designed to provide developers with the tools needed to prevent cross-site scripting attacks among other issues. A critical aspect of this security model is that **absolutely no network access of any kind is allowed without the installation of a Cordova plugin**.

###Cordova Whitelists
The new [Cordova Whitelist plugin (cordova-plugin-whitelist)](https://github.com/apache/cordova-plugin-whitelist) is the recommended base security plugin to use for managing network security access. Historically there was one **access** element in config.xml element used to control all access to network resources. For example, adding the following to config.xml resulted in the app not only being able to make XHR calls, access images, or reference remote scripts but also allowed Cordova to navigate to any URI. 

~~~~~~~~~~~~~~~~~~~~~~~
<access origin="*" />
~~~~~~~~~~~~~~~~~~~~~~~

The problem with this model is you may want to be able to make an XHR to a service like Azure Mobile Services without actually allowing your app to navigate to an Azure web page in the same domain. The reason this is a concern is that this remote web page is then given access to all Cordova and plugin APIs. Further, for Android, the access element has been overloaded to control "intents" in the wake of a discovered [security issue in Cordova 3.5.0 and below](http://cordova.apache.org/announcements/2014/08/04/android-351.html) which has led to a syntax that strayed away from the original [W3C Widget spec](http://www.w3.org/TR/widgets/) that config.xml's structure is based on. Some restructuring and improvements were therefore appropriate for the Cordova 5.0.0 release.
	
###cordova-plugin-whitelist
As a result, the new whitelist plugin actually introduces three separate elements designed to enable more discrete control. The **access** element returns but only controls where your app can make XHR requests or access other external content from a web page for Android and iOS. It no longer controls whether you can navigate to a different domain. A new **allows-navigation** element has been added that then enables you to specify where the app can navigate instead. Finally, a new **allows-intent** element has been introduced specifically designed to control Android intents.

The default Cordova CLI template has a config.xml file in it that is designed to allow the app to make external requests anywhere, allows a specific subset of intents, and prevents the WebView in the Cordova app to navigate anywhere other than local content.

~~~~~~~~~~~~~~~~~~~~~~~
<access origin="*" />
<allow-intent href="http://*/*" />
<allow-intent href="https://*/*" />
<allow-intent href="tel:*" />
<allow-intent href="sms:*" />
<allow-intent href="mailto:*" />
<allow-intent href="geo:*" />
~~~~~~~~~~~~~~~~~~~~~~~

If we wanted to add the ability for the root WebView to navigate to www.microsoft.com, we can add this XML element:

~~~~~~~~~~~~~~~~~~~~~~~
<allow-navigation href="http://www.microsoft.com" />
~~~~~~~~~~~~~~~~~~~~~~~

Note that if you simply wanted to display www.microsoft.com without giving it access to Cordova or plugin APIs, you can use the **[InAppBrowser plugin](https://github.com/apache/cordova-plugin-inappbrowser)** without adding the allow-navigation element to your config.xml file.

There is still some variation in behavior by platform for these whitelist features based on the concerns and capabilities of the underlying native technology.

1. **Android** supports the use of access, allow-navigation, and allows-intent. Intents are an Android specific concept.
2. **iOS** supports the use of access, and allow-navigation.
3. **Windows 10** via the Windows platform supports the allow-navigation element. The access element behaves slightly differently in that navigation is allowed to these URIs but Cordova and plugin APIs are disabled thereby reducing risk. XHR, CSS, and image access rules are intended to be controlled by a Content Security Policy (CSP) rather than specific whitelists. We'll cover more details on how to use CSPs later in this document.
4. **Windows 8.0, 8.1, and Windows Phone 8.1** via the Windows platform does support the navigating to external URIs outside of a x-ms-webview element or the InAppBrowser plugin due to fundamental platform limitations. XHR calls are always allowed to any domain.
5. The **Windows Phone 8 (WP8)** platform still uses the old definition of the access element. 

Note that if you would prefer to retain the old behavior of the access element for Android and iOS, you can install [cordova-plugin-legacy-whitelist](https://github.com/apache/cordova-plugin-legacy-whitelist) though this is intended only to be used for backwards compatibility and new apps should generally move towards using cordova-plugin-whitelist.

####Automatically Adding the Plugin
You will also notice this default template contains the following in config.xml:

~~~~~~~~~~~~~~~~~~~~~~~
<plugin name="cordova-plugin-whitelist" version="1" />
~~~~~~~~~~~~~~~~~~~~~~~

This takes advantage of a new feature in Cordova 5.0.0+ to ensure the Cordova Whitelist plugin (whose ID is cordova-plugin-whitelist) is automatically installed if it is not present when the project is prepared for building any platform. It will automatically add the latest version of the plugin whose version number starts with 1 (1.x.x). You can also update this to be a specific version or remove this element and install the plugin yourself. 

Note that this capability can be used with any Cordova plugin and is conceptually similar to the Visual Studio specific "vs:plugin" element. We worked with the community to get it added into the core and over time we will discontinue the use of the "vs" prefix but we have left the feature in place for backwards compatibility (as Cordova 4.3.0 does not have this feature).

####Migrating an Existing Project to Use cordova-plugin-whitelist
If you have opted to upgrade an existing project from Cordova 4.3.0 (or below) to 5.0.0+, you can start by adding the following into config.xml in your project to open things up.

1. Right-click on config.xml and select "View Code"

2. Add the following XML under the &lt;widget&gt; element:

	~~~~~~~~~~~~~~~~~~~~~~~
	<plugin name="cordova-plugin-whitelist" version="1" />
	<access origin="*" />
	<allow-intent href="http://*/*" />
	<allow-intent href="https://*/*" />
	<allow-intent href="tel:*" />
	<allow-intent href="sms:*" />
	<allow-intent href="mailto:*" />
	<allow-intent href="geo:*" />
	~~~~~~~~~~~~~~~~~~~~~~~

3. Optionally, if your app is using hosted content, or you'd prefer not to restrict where the WebView can navigate during development, you can also add the following elements:

	~~~~~~~~~~~~~~~~~~~~~~~
	<allow-navigation href="http://*/*" />
	<allow-navigation href="https://*/*" />
	<allow-navigation href="data:*" />
	~~~~~~~~~~~~~~~~~~~~~~~

	However, we strongly recommend narrowing down your access before releasing your app as many app stores will not accept apps that are completely open without filing for an exception and having a very good reason to do so.

###The W3C Content Security Policy (CSP)
A topic of frequent conversation for security focused developers on the web is the [W3C Content Security Policy (CSP)](http://www.w3.org/TR/CSP/) feature that is available in Chrome, Safari, and Internet Explorer Edge. CSP support is available natively to Cordova apps targeting iOS, Windows 10 and up, and Android 4.4 and up. However, you can get support back to Android 4.0 by using something called the Crosswalk WebView. We will cover the Crosswalk Webview later in this document.

####The CSP in Cordova 5
The CSP is a native browser capability that allows you to control exactly what content your app can access and at a very granular level. In fact, when using the CSP, you can generally keep the access origin to "*" as you'll be able to more tightly control security using the policy.

A CSP policy is applied at a page level through a few different mechanisms, but for Cordova apps you typically use a meta tag. Here is the CSP policy on index.html in the default Cordova template:

~~~~~~~~~~~~~~~~~~~~~~~
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">
~~~~~~~~~~~~~~~~~~~~~~~

You will need to include a tag like this on each page you navigate to at the top level (a navigation that results in a different window.location.href). With "Single Page Apps", you generally will only need to put it on index.html, but it's worth noting that you can apply completely different security rules based on your situation by modifying this policy. For example, if you have a page that is collecting sensitive data, you may wish to strongly lock down access while keeping things more open on other pages.

The only problem with the CSP is this: It's pretty confusing to read at first and its defaults can cause some behaviors web devs are not at all used to working around.

You can find a [great tutorial on using the CSP in detail here](http://www.html5rocks.com/en/tutorials/security/content-security-policy/), but here are some common "gotchas" for those new to the concepts:

1. By default, applying a CSP **disables both eval() and inline script** while the CSP policy in the **Cordova template leave inline disabled but enables eval()**. 
	- Disabling both eval and inline script means no script tags with JavaScript in it, no "on" event handler attributes on HTML elements, no eval(), no new Function(), etc. Disabling these features effectively makes it impossible to do cross-site scripting because there is no way to inject JavaScript anywhere that does not originate from a file. If you're property managing your whitelists, you're very secure.

	- The problem is that disabling eval() in particular can break quite a few web frameworks.

	- As a result, the CSP in the base Cordova template specifies **unsafe-eval** for **default-src** which enables JavaScript code to use eval and similar dynamic script techniques. Ex:
	
		~~~~~~~~~~~~~~~~~~~~~~~
		default-src 'self' 'unsafe-eval';
		~~~~~~~~~~~~~~~~~~~~~~~

	- If your app and your frameworks don't need eval, remove the unsafe-eval declaration.

	- If you really need inline script, you can add the 'unsafe-inline' declaration. Of the two, inline script is actually a higher risk than eval since something as simple as using innerHTML without proper filtering can allow a hacker to add inline script. Inline script is very common, but if your app is security focused, you should avoid it. Note that the 'unsafe-inline' declaration in the Cordova template applies to style-src which enables inline CSS declarations not JavaScript.

1. The default CSP policy in the Cordova template only allows access to JavaScript and CSS files inside the app or the same domain, not a different domain. **As a result, CDN hosted content typically cannot be referenced.**

	- This is another technique to reduce risk by stating that a given web page can only reference content from **'self'**. The end result is that cross-site scripting vulnerabilities are further reduced by preventing your web page from being hijacked to include content from an external, untrusted sourced.
	
	- You can loosen this restriction by listing other trusted domains. In fact, the default Cordova template lists "https://ssl.gstatic.com" as a trusted domain since Android needs it for TalkBack to function properly.

		~~~~~~~~~~~~~~~~~~~~~~~
		default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval';
		~~~~~~~~~~~~~~~~~~~~~~~
		
	This above CSP policy says that content originating from the same domain ('self'), data URIs (data:), Cordova internal APIs (gap:), https://ssl.gstatic.com, and eval statments are allowed, but all others are denied.

####Using a CSP with an Existing Project
Due to the significant security benefits associated with using a CSP policy, we strongly recommend taking the Cordova template's CSP metatag and add it to the header of any page the app will navigate to in your app. Note that **you can use add a CSP meta tag to hosted content too.**

~~~~~~~~~~~~~~~~~~~~~~~
<head>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">
    <link rel="stylesheet" type="text/css" href="css/index.css">
    <title>My Super Cool Cordova App</title>
</head>
~~~~~~~~~~~~~~~~~~~~~~~

Start with the most locked down security policy you can and back away as needed. That way you'll ensure you're using the most secure practices you can from the start.

To reiterate, **CSP support is only available on Android 4.4+ devices or Android 4.0+ when using Crosswalk.** More on Crosswalk in a bit.

<a name="npm"></a>
##Primary Cordova Plugin Repository is Now Npm
Another significant departure in Cordova 5 and the community as a whole is the migration of the primary source of Cordova plugins from the GitHub backed model that exists in Cordova 3.x and 4.x to the "Node Package Manager" (npm) repository. The plugins.cordova.io repository has seen a few service interruptions and given the web community's increased use of Node.js for client-side development and Cordova's heavy use of npm for not only its command line interface but as a source for Cordova "platforms," the natural next step was to migrate plugins to npm as well. More details on this transition [can be found here.](http://cordova.apache.org/announcements/2015/04/21/plugins-release-and-move-to-npm.html)

However, unfortunately this switch over is not transparent. For a few very specific reasons, this change over can be a bit confusing and we're working with the community to determine some ways to make the transition a bit more seamless going forward.

<a name="no-npm-3.x"></a>
###Cordova 3.x and 4.x Don't Support Npm as a Plugin Source
An early source of confusion can lead from the fact that Cordova 3.x and 4.x cannot use plugins sourced from npm. The Cordova CLI in these versions simply does not have the capability. A specific issue that can come up here is that updates to plugins will now generally be going to npm **not** the older GitHub sourced method used by these earlier version of Cordova plugins.

As a result, if you need to access updated versions of plugins when using these older versions of Cordova, you'll need to take the following steps:

1. Go to the GitHub repository for the plugin. Ex: https://github.com/wildabeast/BarcodeScanner

2. Click on the "Releases" tab

3. Click on the .zip link of the version of the plugin you want to access

	![Release Zip](<media/cordova-5-3.png>)

4. Unzip this plugin on your local filesystem

5. Add the plugin to your project from this local location by using the "Local" option in the "Custom" tab of the config.xml designer.

	![Custom Local Plugin](<media/cordova-5-2.png>)

###Plugin ID Changes
A significant change to be aware of is that the IDs used to refer to many Cordova plugins have changed. This was done for two reasons. First, the different ID helps to re-enforce that older versions of Cordova will not get plugin updates. Rather than having an arbitrary version number where the updates stop, using a different ID makes this change over explicit. Second, the old reverse domain style for Cordova plugin IDs does not conform to community best practices for package names.

As a result, core plugins like Camera have changed from [org.apache.cordova.camera](http://plugins.cordova.io/#/package/org.apache.cordova.camera) in version 0.3.6 of the plugin to [cordova-plugin-camera](https://www.npmjs.com/package/cordova-plugin-camera) in versions 1.0.0 and higher. 

![Custom Local Plugin](<media/cordova-5-4.png>)

![Custom Local Plugin](<media/cordova-5-5.png>)

You can find running list of [old verses new plugin IDs in this location](https://github.com/stevengill/cordova-registry-mapper/blob/master/index.js). You will be informed of the new ID whenever you add a plugin from this list when either using the command line or the config.xml designer. The config.xml designer will automatically add these new IDs for Cordova 5.0.0+ and the old IDs for older versions of Cordova that do not support them. **TODO: Verify this makes RTM**

###Cordova Plugin Registry
Unfortunately the community is in a state of flux when it comes to a "source of truth" for all available Cordova plugins. 

- For the time being, [plugins.cordova.io](http://plugins.cordova.io) **does not contain npm sourced plugins.** 
- For npm sourced plugins, you should instead search npm using the [ecosystem:cordova](https://www.npmjs.com/search?q=ecosystem%3Acordova) tag.

	![Custom Local Plugin](<media/cordova-5-6.png>)

Both sets of plugins can be used with Cordova 5.0.0+ so in the short term you should search in both locations for plugins. Plugins found in npm are the most likely to work without issue with Cordova 5.0.0 and higher and may or may not work with earlier versions of Cordova. Npm will be the eventual source of truth, but things are a bit messy during this transition period.

We are actively working with the community on the best way to merge some of the functionality of the existing plugins.cordova.io site with the reliability and improvements npm provides.

##Gradle Build Instead of Ant for Android
On the surface, this seems like a fairly innocuous change but we've continued to hear about unexpected issues in some 3rd party Cordova plugins because of this change so it is worth a mention.

Up until Cordova 5.0.0 (Cordova Android platform version 4.0.0), Cordova used  [Apache Ant](http://ant.apache.org/) as the primary build system to build an Android version of an app. This has now changed to [Gradle](http://gradle.org/) as the default though developers can force an Ant build using the Cordova CLI as follows:

~~~~~~~~~~~~~~~~~~~~~~~
cordova build android -- --ant
~~~~~~~~~~~~~~~~~~~~~~~

There are two major ways that switching to Gradle can affect your project:

1. The way you specify signing information is different. See the [Packaging & Publishing tutorial for details](../tutorial-package-publish).
1. Some 3rd party plugins may either require Gradle be used or not yet support it. In particular, plugins that modify Android build artifacts in a non-standard way can run into issues.

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
	
		... replacing the Cordova version and plugin name for those that apply to your situation. You can also specify a fully qualified Git URI in place of the plugin name.
	
	2. If the problem reproduces, you may  want to contact the plugin author and let them know about the problem. Before doing so, be sure to check for existing open issue as more than likely there's already one on the plugin author's GitHub site that you can use to provide additional information. Mention that you encountered issues when using Tools for Apache Cordova but include the Cordova CLI repro for the plugin author's benefit.

3. If you've already added release signing information into ant.properties in your project, you'll need to place this information in a new file in your project.  See the [Packaging & Publishing tutorial for details](../tutorial-package-publish) for details.

<a name="crosswalk"></a>
##Pluggable WebViews and the Crosswalk WebView for Android
An exciting new development in the Cordova Android platform is the support for what are called "pluggable WebViews." What this feature allows you to do is swap out the built in Android WebView with a completely different WebView implementation. This is a significant improvement as the Android browser and thus the WebView has been locked at a specific version without the ability to update unless you update the version of the OS on the device. This has changed in the Android OS as of 5.0 (API 22), but unlike iOS or Windows where devices can opt to upgrade and developers need only concern themselves with a few major versions of the browser, older Android devices are locked at a particular sub-revision of Android and thus the browser with no ability to upgrade the device in many cases. The end result has been a vast array of small differences between Android devices.

[Crosswalk](https://crosswalk-project.org/) is a project that is designed to allow developers to take embed a very recent and specific version of the Chromium WebView inside their Android app. The Crosswalk WebView can be embedded in apps running on Android 4.0 and up and brings with it the significant advantage of a consistent WebView implementation across all Android device versions it supports.

There is now a [Cordova Crosswalk plugin](https://www.npmjs.com/package/cordova-plugin-crosswalk-webview/) that takes advantage of the new pluggable WebView features in Cordova 5.0.0+ (and the Cordova Android 4.0.0 platform it uses) and makes it simple to add into your project.

*Note: Because using the Crosswalk plugin does slow down build times fairly significantly given its size, we recommend developers start out building apps with the stock Android WebView on a recent device or emulator (Android 4.4+). You can then add the Crosswalk plugin later in your development cycle and make the necessary adjustments.*

###Installing the Crosswalk Plugin from VS
To use it from Visual Studio, follow these steps:

1. Install VS 2015 RTM or later (not RC)
2. Open the config.xml designer by double clicking on config.xml
3. Verify you have set the Cordova version to 5.1.1 or higher under the "Platforms" tab.
3. Go to "Plugins > Custom"
4. Select the "Git" radio button
5. Enter "https://github.com/crosswalk-project/cordova-plugin-crosswalk-webview.git" as the URI and click the arrow. Note that you may also download a specific version of this plugin using the proceedure outlined under [Cordova 3.x and 4.x Don't Support Npm as a Plugin Source](#no-npm-3.x) above.
6. Click "Add"

The next time you build, your app will be running in the Crosswalk WebView. Note that the first build in particular will take a bit given the plugin does some dynamic acquisition.

###The Base Android Emulator and Crosswalk
One very important thing to note when using the Crosswalk WebView in the base Android emulator is that Crosswalk requires OpenGL support and that you've selected the "Use Host GPU" option in your Android Virtual Device configuration. Failing to do this will cause the app to crash. To use it:

1. Be sure your graphics drivers are up to date on your machine

2. Follow the [instructions for configuring a high speed Android emulator](https://msdn.microsoft.com/en-us/library/dn757059.aspx)

3. Check the **Use Host CPU** option in the AVD you create

	![Use Host GPU](<media/cordova-5-1.png>)

###3rd Party Cordova Plugin Issues Due to Pluggable WebView Changes
As the major version number increase implies, there are some breaking changes to some of the interfaces internal to Cordova that some plugins may take advantage of to accomplish certain tasks. Many of these were necessary changes needed to enable pluggable WebView support. Plugin authors are now in the process of adapting to these changes.

As with Gradle, if you encounter an unexpected build error specifically for Android, see if the error references Cordova plugin source code. If so, update it by removing the plugin using the "Installed" tab of the config.xml designer and re-add the plugin. If you cannot determine which plugin is causing the issue, you can opt to proactively upgrade all of them.

If the problem persists, see the recommendations under "[Migrating an Existing Project to Use Gradle](#gradle-migrate)" for additional troubleshooting tips.

