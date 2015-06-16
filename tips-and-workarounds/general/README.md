#General Cordova Tips and Workarounds
This document covers tips, tricks, and known workarounds for general issues with Cordova or Tools for Apache Cordova

It covers the following issues and tips:

1. [Building a Cordova project from source control results in a successful build, but with Cordova plugin APIs not returning results when the app is run](#missingexclude)
1. ["TypeError: Request path contains unescaped characters" during a build or when installing a plugin](#cordovaproxy) 
1. [Using a Specific Version of a GitHub Sourced Plugin](#plugin-github) 
1. [Using a npm sourced plugin with Cordova < 5.0.0 or Visual Studio 2015 RC](#plugin-npm) 
1. [Tips for troubleshooting 3rd party Cordova plugins](#plugin-troubleshoot) 
1. [Build errors caused by long path and file names](#build-errors-long-path)

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

For existing local copies, you can either fetch a fresh copy from source control or remove the above files along with any platforms found in the "platforms" folder to resolve the issue.

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
	
<a name="plugin-npm"></a>
##Using a Npm Sourced Plugin with Cordova < 5.0.0 or Visual Studio 2015 RC
###Background
A significant departure in Cordova 5.0.0 and the community as a whole is the migration of the primary source of Cordova plugins from the custom repoistory backed model that exists in Cordova 3.x and 4.x to the "Node Package Manager" (npm) repository. The plugins.cordova.io repository has seen a few service interruptions and given the web community's increased use of Node.js for client-side development and Cordova's heavy use of npm for not only its command line interface but as a source for Cordova "platforms," the natural next step was to migrate plugins to npm as well. More details on this transition [can be found here.](http://cordova.apache.org/announcements/2015/04/21/plugins-release-and-move-to-npm.html)

A significant change tied to this switch over and the release of Cordova 5.0.0 that the IDs used to refer to many Cordova plugins have changed. This was done for two reasons. First, the different ID helps to re-enforce that older versions of Cordova will not get plugin updates. Rather than having an arbitrary version number where the updates stop, using a different ID makes this change over explicit. Second, the old reverse domain style for Cordova plugin IDs do not conform to community best practices for package names in npm.

As a result, core plugins like Camera have changed from [org.apache.cordova.camera](http://plugins.cordova.io/#/package/org.apache.cordova.camera) in version 0.3.6 of the plugin to [cordova-plugin-camera](https://www.npmjs.com/package/cordova-plugin-camera) in versions 1.0.0 and higher geared for Cordova 5.0.0 and up.

![Custom Local Plugin](<media/cordova-5-4.png>)

![Custom Local Plugin](<media/cordova-5-5.png>)

You can find running list of [old verses new plugin IDs in this location](https://github.com/stevengill/cordova-registry-mapper/blob/master/index.js).

In addition to the challenge of older versions of Cordova not supporting npm sourced plugins, **Visual Studio 2015 RC** currently uses the old IDs since the default template in VS uses Cordova 4.3.0 which does not support npm sourced plugins. (This has been **resolved in Visual Studio 2015 RTM** when using Cordova 5.0.0+.) As a result, if you want to get the latest version of a given plugin in either case you will need to install the npm version from your local filesystem using the workaround described below.

###Workaround
*Note that versions of plugins present in npm were tested on Cordova 5.0.0 or later and therefore may or may not work on earlier versions of Cordova.*

To install a plugin with one of these updated IDs or that only exists in npm when using Cordova 4.3.1 or below or when Visual Studio 2015 RC, follow this proceedure:

1. From the command prompt:
	1. Create a folder where you want to place the npm version of your Cordova plugins. (Ex: C:\cordova-plugins)

	2. Change to this folder

	3. Type the following:
	
		~~~~~~~~~~~~
		npm install cordova-plugin-camera
		~~~~~~~~~~~~
		
		...replacing cordova-plugin-camera with the ID of the plugin you want to use. Be sure to omit "-g".
		
	4. After the command completes, inside a "node_modules" folder you will find **one or more folders** containing all the plugins you need to add to the project. (Note there may be more than one.) For example, you will see both "cordova-plugin-camera" and "cordova-plugin-file" present in the example above since the Camera plugin depends on the File plugin.

2. From Visual Studio:

	1. Add **all of the plugins** the "npm install" command above placed in the "node_modules" folder. In the example above, both cordova-plugin-camera and cordova-plugin-file should be installed.

		1. Go to the "Custom" tab in the config.xml designer
		
		2. Select "Local" and select the folder where npm installed the plugin on your system. The will be in a "node_modules" sub-folder where you executed the "npm install" command.  (Ex: C:\cordova-plugins\node_modules)
		
		3. Click "Add"

		4. Repeat until all plugins in the node_modules folder have been added
	
	1. If any of these plugins were added to your project with an older ID, remove them using the "Installed" tab in the config.xml designer.

<a name="plugin-troubleshoot"></a>
##Tips for Troubleshooting 3rd party Cordova Plugins
One of the advantages associated with Apache Cordova is its active plugin community. However, not all plugins are well maintained or updated the moment a new version of Cordova comes out and you may run into problems even with popular plugins. Here are some tips to see where the problem may exist and how to contact a plugin author about making fixes.

1. Verify the plugin supports the platform you are currently testing by looking at the plugin's documentation. Android and iOS support is provided by most (but not all) plugins but Windows and Windows Phone 8 are not always supported by 3rd party plugins.

2. If you are specifically running into problems with the plugin after checking the project out of source control or copying from another machine, be sure you are not encountering the issue described above [with copying or adding certain json files to source control from plugins folder](#missingexclude).

3. If you encounter an unexpected build error, see if the error references Cordova plugin source code. If so, the problem is likely with the plugin not Cordova or Tools for Apache Cordova.

4. See if there is an update to the plugin and install it by removing the plugin using the "Installed" tab of the config.xml designer and re-add the plugin. 

5. Certain plugins can encounter problems when building for iOS due to their use of symlinks which are not well supported on the Windows NTFS filesystem. See [this article](../ios/README.md#symlink) for specific symptoms and a workaround.

6. See if the plugin causing problems has transitioned to npm as a part of the Cordova [repository transition](http://cordova.apache.org/announcements/2015/04/21/plugins-release-and-move-to-npm.html) and therefore has a new ID. You could have multiple copies of the same plugin installed (ex: both org.apache.cordova.camera and cordova-plugin-camera) or an outdated version of the plugin with bugs. Check the "Installed" tab of the config.xml designer for duplicates and consult [this article for information](#plugin-npm) on why the plugin ID may have changed and how to get an updated version of the plugin.

7. When using a plugin from GitHub, check the "Installed" tab of the config.xml designer to see if the version number ends in "-dev". If so, this may not be a stable version of the plugin. You can follow [this proceedure](#plugin-github) to download an earlier release of the plugin to see if the problem goes away. Even if the plugin version does not end in "-dev" it may be worth trying a previous release to see if the problem you are encountering is new.

8. If a plugin update doesn't solve the issue, try these steps to eliminate other factors:
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
	
9. If none of these steps help and the problem reproduces outside of Visual Studio, you may want to contact the plugin author and let them know about the problem. Before doing so, be sure to check for existing open issue as more than likely there's already one on the plugin author's GitHub site that you can use to provide additional information. Mention that you encountered issues when using Tools for Apache Cordova but include the Cordova CLI repro for the plugin author's benefit.

One last tip: Note that modifying the contents of the "plugins" folder does not automatically cause these changes to be applied to your app. Removing and re-adding the plugin is the safest option.

<a name="build-errors-long-path"></a>
##Build errors caused by long path and file names
If your project is located inside a deeply nested directory in your file system, you may receive build errors when building your project using Visual Studio. The underlying reason has to do with many factors that touch upon how Windows and Visual Studio handle long paths. If you are running into this issue, the most effective workaround is to copy your projects to a location closer to the root of your drive (ie, C:\Projects\).

## More Information
* [Read tutorials and learn about tips, tricks, and known issues](../../Readme.md)
* [Download samples from our Cordova Samples repository](http://github.com/Microsoft/cordova-samples)
* [Follow us on Twitter](https://twitter.com/VSCordovaTools)
* [Visit our site http://aka.ms/cordova](http://aka.ms/cordova)
* [Read MSDN docs on using Visual Studo Tools for Apache Cordova](http://go.microsoft.com/fwlink/?LinkID=533794)
* [Ask for help on StackOverflow](http://stackoverflow.com/questions/tagged/visual-studio-cordova)
* [Email us your questions](mailto:/vscordovatools@microsoft.com)
