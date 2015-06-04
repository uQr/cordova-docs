#Apache Cordova 5 and Tools for Apache Cordova
**Note that this documentation applies to Visual Studio 2015 and does not apply to Visual Studio 2013 CTPs.**

Tools for Apache Cordova supports cordova 4.3.1 along with the newly released Cordova 5.2.0 **TODO: Final RTM version** version of cordova. As the major version number increase implies, Cordova 5 is a departure from 3.x and 4.x versions of Cordova in a number of very important ways. Note that there were a number of issues with Cordova 5.0.0 itself that kept us from reccomending its use includign an [Android security issue](https://github.com/Chuxel/cordova-docs/tree/master/tips-and-workarounds/android/security-05-26-2015). As a result, we strongly reccomend the use of **Cordova 5.2.0** **TODO: Final RTM version** with **Visual Studio 2015 RTM** and up.

This article will summarize the changes in Cordova 5 and how you can take advantage of the new features and adapt existing apps. Specifically it will cover:

1. [Security model changes to the Android and iOS platforms](#security)
1. [Cordova plugins originating from npm](#npm)
1. [Gradle build instead of Ant for Android](#gradle)
1. [The Crosswalk WebView for Android](#crosswalk)
1. [Windows 10 support and improvments](#win10)

##Security Model Changes for Android and iOS<a name="security"></a>
One of the more confusing changes about Cordova 5 is that the updated version of the Android platform (also called Cordova Android 4.x) and iOS now follow a different, but more powerful security model designed to provide developers with the tools needed to prevent cross-site scripting attacks among other issues. A critical aspec of this security model is that **absolutley no network access of any kind is allowed without the installation of a Cordova plugin**.

###The Cordova Whitelist Plugin
The new [Cordova Whitelist plugin (cordova-plugin-whitelist)](https://github.com/apache/cordova-plugin-whitelist) is the reccomended base security plugin to use for managing network security access. Historically there was one "access" element used to control all access to network resources. For example, adding the following to config.xml resulted in the app not only being able to make XHR calls, access images, or reference remote scripts but also allowed Cordova to navigate to any URI. 

~~~~~~~~~~~~~~~~~~~~~~~
<access origin="*" />
~~~~~~~~~~~~~~~~~~~~~~~

The problem with this model is you may want to be able to make an XHR to a service like Azure Mobile Services without actually allowing your app to navigate to an Azure web page in the same domain. The reason this is a concern is that challenge this remote web page is then given access to all Cordova and plugin APIs.  Further, for Android, the fact the access element controls intents [led to another security issue in Cordova 3.5.0 and below](http://cordova.apache.org/announcements/2014/08/04/android-351.html).

###cordova-plugin-whitelist
As a result, the new whitelist plugin actually introduces three separate elements designed to enable more discrete control. The **access** element returns but only controls where your app can make XHR requests or access other external content from a web page. It no longer controls whether you can navigate to a different domain. A new **allows-navigation** element has been added that then allows you to specify where the app can navigate instead. Finally, a new **allows-intent** element has been introduced specifically designed to control Android intents.

The default Cordova CLI template has a config.xml file in it that is desgined to allow the app to make external requests anywhere, allows a specific subset of intents, and disallows the WebView in the Cordova app to navigate anywhere other than local content.

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

Note that if you simply wanted to display www.microsoft.com without giving it access to Cordova or plugin APIs, you can use the **[InAppBrowser plugin](https://github.com/apache/cordova-plugin-inappbrowser)** without adding the allow-navitagion element to your config.xml file.

####Automatically Adding the Plugin
You will also notice this default template contians the following in config.xml:

~~~~~~~~~~~~~~~~~~~~~~~
<plugin name="cordova-plugin-whitelist" version="1" />
~~~~~~~~~~~~~~~~~~~~~~~

This takes advantage of a new feature in Cordova 5.0.0+ to ensure the Cordova Whitelist plugin (whose ID is cordova-plugin-whitelist) is automatically installed if its not present when the project is prepared for building any platform. It will automatically add the latest version of the plugin whose version number starts with 1 (1.x.x). You can also update this to be a specific version or remove this element and install the plugin yourself. 

Note that this capability can be used with any Cordova plugin and is conceptually similar to the Visual Studio specific "vs:plugin" element. We worked with the community to get it added into the core and over time we will discontinue the use of the "vs" prefix but we have left the feature in place for backwards compatibility (as Cordova 4.3.0 does not have this feature).

####Adapting an Existing Project
If you have opted to upgrade an existing project from Cordova 4.3.0 (or below) to 5.0.0+, you can start by adding the following into config.xml in your project to open things up:

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

If your app is using hosted content, or you'd prefer not to restrict where the WebView can navigate during development, you can also add the following elements:

~~~~~~~~~~~~~~~~~~~~~~~
<allow-navigation href="http://*/*" />
<allow-navigation href="https://*/*" />
<allow-navigation href="data:*" />
~~~~~~~~~~~~~~~~~~~~~~~

However, we strongly reccomend narrowing down your access before relasing your app as many app stores will not accept apps that are completely open without filing for an exception and having a very good reason to do so.

###The W3C Content Security Policy (CSP)
A topic of frequent conversation for security focused developers on the web is the [W3C Content Security Policy (CSP)](http://www.w3.org/TR/CSP/) feature that is available in Chrome, Safari, and Internet Explorer Edge. CSP support is available nativley to Cordova apps targeting iOS, Windows 10, and Android 4.4 and up. However, you can support back to Android 4.0 by using something called the Crosswalk WevView. We will cover the Crosswalk Webview later in this document.

####The CSP in Cordova 5
The CSP is a native browser capability that allows you to control exactly what content your app can access and at a very grandular level. In fact, when using the CSP, you can generally keep the access origin to "*" as you'll be able to more tightly control security using the policy.

A CSP policy is applied at a page level through a few different mechanisms, but for Cordova apps you typically use a meta tag. Here is the CSP policy on index.html in the default Cordova template:

~~~~~~~~~~~~~~~~~~~~~~~
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">
~~~~~~~~~~~~~~~~~~~~~~~

You will need to include a tag like this on each page you navigate to at the top level (a navigation that results in a different window.location.href). With "Single Page Apps", you generally will only need to put it on index.html, but it's worth noting that you can apply completely different security rules based on your situation by modifying this policy. For example, if you have a page that is collecting sensative data, you may wish to strongly lock down access while keeping things more open on other pages.

The only problem with the CSP is this: It's pretty confusing to read at first and it's defaults can cause some behaviors web devs are not at all used to working around.

You can find a [great tutorial on using the CSP in detail here](http://www.html5rocks.com/en/tutorials/security/content-security-policy/), but here are some common "gotcahas" for those new to the concepts:

1. By default, applying a CSP policy **disables both eval() and inline script** but the CSP policy in the **Cordova template enables eva()**. 
	- That means no script tags with JavaScript in it, no "on" event handler attributes on HTML elements, no eval(), no new Function(), etc. Disabling these features effectivley makes it impossible to do cross-site scripting because there is no way to inject JavaScript anywhere that does not originate from a file. If you're propertly manging your whitelists, you're very secure.

	- The problem is that disabling eval() in particular can break quite a few web frameworks.

	- As a result, the CSP polciy in the cordova template specifies **unsafe-eval** for **default-src** which enables JavaScript code to use eval and similar dynamic script techniques. Ex:
	
		~~~~~~~~~~~~~~~~~~~~~~~
		default-src 'self' 'unsafe-eval';
		~~~~~~~~~~~~~~~~~~~~~~~

	- If your app and your frameworks don't need eval, remove the unsafe-eval declaration.

	- If you really need inline script, you can add the 'unsafe-inline' declaration. Note that the 'unsafe-inline' declaration in the Cordova template applies to style-src which enables inline CSS declarations not JavaScript.

1. The default CSP policy in the Cordova template only allows access to JavaScript and CSS files inside the app or the same domain, not a different domain. **As a result, typically CDN hosted content cannot be referenced.**

	- This is another technique to reduce risk by stating that a given web page can only reference content from **'self'**. The end result is that cross-site scripting vulnerabilities are further reduced by preventing your web page from being hijacked to include content from an external, untrusted sourced.
	
	- You can loosen this restriction by listing other trusted domains. In fact, the default Cordova template lists "https://ssl.gstatic.com" as a trusted domain since s required only on Android and is needed for TalkBack to function properly.

		~~~~~~~~~~~~~~~~~~~~~~~
		default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval';
		~~~~~~~~~~~~~~~~~~~~~~~
		
	This statment says that content originating from the same domain ('self'), data URIs (data:), Cordova internal APIs (gap:), https://ssl.gstatic.com, and eval statments are allowed, but all others are denied.

####Migrating an Existing Project
Due to the significant security benifits associated with using a CSP policy, we strongly reccomend taking the Cordova template CSP metatag and add it to the header of any page the app will navigate to in your app. Note that **you can use a CSP policy from hosted content too.**

~~~~~~~~~~~~~~~~~~~~~~~
<head>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">
    <link rel="stylesheet" type="text/css" href="css/index.css">
    <title>My Super Cool Cordova App</title>
</head>
~~~~~~~~~~~~~~~~~~~~~~~

Start with the most locked down security policy you can and back away as needed. That way you'll ensure you're using the most securre practices you can from the start.

##Cordova Plugins Originating from Npm<a name="npm"></a>
Another significant departure in Cordova 5 and the community as a whole is the migration of the primary source of Cordova plugins from the GitHub backed model that exists in Cordova 3.x and 4.x to an npm based one. 

###Gradle Build Instead of Ant for Android
On the surface, this seems like a fairly inncous change but we've continued to hear about unexpected issues in some 3rd party Cordova plugins because of this change so it is worth a mention.

Up until Cordova 5.0.0 (Cordova Android platform version 4.0.0), Cordova used  [Apache Ant](http://ant.apache.org/) as the primary build system to build an Android version of an app. This has now changed to [Gradle](http://gradle.org/) as the default though developers can force an Ant build using the Cordova CLI as follows:

~~~~~~~~~~~~~~~~~~~~~~~
cordova build android -- --ant
~~~~~~~~~~~~~~~~~~~~~~~



##The Crosswalk WebView for Android<a name="crosswalk"></a>



##Windows 10 Support and Improvments<a name="win10"></a>


