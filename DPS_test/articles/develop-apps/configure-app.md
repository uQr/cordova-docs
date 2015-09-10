<properties
   pageTitle="Configure Your App Built with Visual Studio Tools for Apache Cordova | Cordova"
   description="description"
   services="na"
   documentationCenter=""
   authors="normesta"
   tags=""/>
<tags
   ms.service="na"
   ms.devlang="javascript"
   ms.topic="article"
   ms.tgt_pltfrm="mobile-multiple"
   ms.workload="na"
   ms.date="09/11/2015"
   ms.author="normesta"/>
#Configure Your App Built with Visual Studio Tools for Apache Cordova

*In Visual Studio 2013, the Cordova tools are released as a preview (CTP) version. Cordova tools will be released as part of Visual Studio 2015 and we recommend that you now use Visual Studio 2015 RTM to [develop apps](https://msdn.microsoft.com/en-us/library/dn771545(v=vs.140).aspx) using Visual Studio Tools for Apache Cordova. You can download Visual Studio from the [Microsoft Download Center](http://go.microsoft.com/fwlink/p/?linkid=517106).*

A config.xml file included in each project provides most of your app configuration such as the app’s display name and start page. From **Solution Explorer**, you can double-click this file to open it in the configuration designer, a Visual Studio interface for the file.

Alternatively, you can select **View Code** from the context menu to edit the file directly. For more information about this file, see [config.xml file](http://go.microsoft.com/fwlink/p/?LinkID=510632) in the Apache Cordova documentation. For information about configuring this file in Visual Studio, see these topics:

* [Configure the Cordova CLI version](#ConfigCLI)

* [Configure the Windows target version](#ConfigWindows) (in this topic)

* [Manage Plugins for Apps Built with Visual Studio Tools for Apache Cordova](manage-plugins.md)

* [Package Your App Built with Visual Studio Tools for Apache Cordova](./package-and-publish/package-app-built-with-visual-studio.md)

**Caution**
If you edit the config.xml file directly, make sure that your XML elements and attributes are valid. Invalid content in the XML file will result in errors when you build the app.

Visual Studio also provides other ways to configure your app to support platform-specific content:

* [Platform-specific visual assets](#VisualAssets) (in this topic)

* [Platform-specific content](#Content) (in this topic)

* [Platform-specific configuration files](#Configuration) (in this topic)

## <a id="ConfigCLI"></a>Configure the Cordova CLI version

You can use the configuration designer to change the CLI version used in your project. To change the version, choose the **Platforms** tab and enter one of the following:

* Cordova CLI version (for example, 4.3.0).

* Git repository (for example, https://github.com/apache/cordova-cli.git) Alternatively, you can change the Cordova CLI version by editing the taco.json file in your project root.

**Caution**
Changing the Cordova CLI version may impact your application code. Platforms will be removed and then re-added to use the CLI pinned versions.

![Configuring the CLI version](media/configure-app/IC795807.png)

## <a id="ConfigWindows"></a>Configure the Windows target version

You can change the targeted version of Windows in the configuration designer, under the Windows tab (Windows Target Version).

![Cordova_Config_Windows](media/configure-app/IC795808.png)

The options that appear in Windows Target Version depend on which SDK is installed. If you install the Windows 8.0 or Windows 10 SDKs, the corresponding version will appear as an option that you can select. When you change the Windows target version, the following line is modified in your config.xml file:

      <preference name="windows-target-version" value="8.1" />

## <a id="VisualAssets"></a>Platform-specific visual assets

You can use the res folder in your project to specify visual assets such as icons and splash screens based on device resolution and platform. If you don’t see this folder in your project, you can recreate it manually in **Solution Explorer**.

* res\icons\platform contains the app icons for each platform.

* res\screens\platform contains splash screens for each platform.

**Caution**
Visual Studio 2015 now uses the and config.xml elements to set the location of these files. If you are using a config.xml file from an earlier version, you will need to add these elements to your config.xml file. To do this, simply create a new project from the Blank template, choose View Code from the shortcut menu for the config.xml file in each project, and then copy the required elements from the Blank project to your project.

The file name of each resource provides some information about the asset. For example, the screen-ldpi-portrait.png file in the res\icons\screens\android folder represents a splash screen for a low-resolution screen (ldpi, or 426x320) for an Android device in portrait orientation.

The following table provides the complete list of splash screens and icons that are required if you need to support specific devices and screen resolutions. For additional information about these assets, see Icons and Splash Screens in the Apache Cordova documentation.

| Icons and splash screens for Android |    Resolution    |
|----------|:-------------:|
|res/icons/android/icon-36-ldpi.png | 36x36 |
|res/icons/android/icon-48-mdpi.png | 48x48 |
|res/icons/android/icon-72-hdpi.png | 72x72 |
|res/icons/android/icon-96-xhdpi.png | 96x96
|res/screens/android/screen-xhdpi-landscape.png |  720x960 |
|res/screens/android/screen-xhdpi-portrait.png | 960x720 |
|res/screens/android/screen-hdpi-landscape.png | 480x640 |
|res/screens/android/screen-hdpi-portrait.png | 640x480 |
|res/screens/android/screen-mdpi-landscape.png | 320x470 |
|res/screens/android/screen-mdpi-portrait.png | 470x320 |
|res/screens/android/screen-ldpi-landscape.png | 320x426 |
|res/screens/android/screen-ldpi-portrait.png | 426x320 |

|Icons and splash screens for iOS | Resolution   |
|----------------|-----------------:|
|res/icons/ios/icon-57-2x.png  | 114x114 (Retina display) |
|res/icons/ios/icon-57.png  | 57x57 |
|res/icons/ios/icon-72-2x.png | 144x144 (Retina display) |
|res/icons/ios/icon-72.png | 72x72 |
|res/icons/ios/icon-40.png | 40x40 |
|res/icons/ios/icon-40-2x.png | 80x80 (Retina display) |
|res/icons/ios/icon-50.png | 50x50 |
|res/icons/ios/icon-50-2x.png | 100x100 (Retina display) |
|res/icons/ios/icon-60@3x.png | 180x180 (Retina display) |
|res/icons/ios/icon-76.png | 76x76 |
|res/icons/ios/icon-76-2x.png | 152x152 (Retina display) |
|res/icons/ios/icon-small.png | 29x29 |
|res/icons/ios/icon-small-2x.png | 58x58 (Retina display) |
|res/screens/ios/screen-ipad-landscape.png | 1024x768 |
|res/screens/ios/screen-ipad-landscape-2x.png | 2048x1536 |
|res/screens/ios/screen-ipad-portrait.png | 768x1024 |
|res/screens/ios/screen-ipad-portrait-2x.png | 1536x2048 |
|res/screens/ios/screen-iphone-landscape-736h.png | 2208x1242 |
|res/screens/ios/screen-iphone-portrait-2x.png | 640x960 |
|res/screens/ios/screen-iphone-portrait.png | 320x480 |
|res/screens/ios/screen-iphone-portrait-667h.png | 750x1334 |
|res/screens/ios/screen-iphone-portrait-736h.png | 1242x2208 |
|res/screens/ios/screen-iphone-568h-2x.png | 640x1136 |


|Icons and splash screens for Windows Phone 8  Resolution |
|-------------------|----------------------:|
|res/icons/wp8/ApplicationIcon.png | 62x62 |
|res/icons/wp8/Background.png | 173x173 |
|res/screens/wp8/SplashScreenImage.png | 480x800 |
|Icons and splash screens for Windows Phone 8.1 | Resolution |
|res/icons/windows/Square150x150Logo.scale-240.png | 360x360 |
|res/icons/windows/Square44x44Logo.scale-240.png | 106x106 |
|res/icons/windows/Square71x71Logo.scale-240.png | 170x170 |
|res/icons/windows/StoreLogo.scale-240.png | 120x120 |
|res/icons/windows/Wide310x150Logo.scale-240.png | 744x360 |
|res/screens/windows/SplashScreen.scale-240.png | 1152x1920 |

|Icons and splash screens for Windows     | Resolution |
|--------------------------------|-------------------:|
|res/icons/windows/logo.png   | 150x150 |
|res/icons/windows/smalllogo.png   | 30x30 |
|res/icons/windows/storelogo.png   | 50x50 |
|res/screens/windows/splashscreen.png   | 620x300 |

Android supports a scalable type of image called a NinePatch that can be used as your splashscreen.

To use a NinePatch splashscreen image on Android

1. Change the following line in config.xml:

       <preference name="SplashScreen" value="screen" />
to

       <preference name="SplashScreen" value="splash" />

2. Place the NinePatch image in the following location: res\native\android\res\drawable-nodpi\splash.9.png
When you build, the image will be copied to the required output folder.

## <a id="Content"></a>Platform-specific content

You can include platform-specific HTML, CSS, and JavaScript files in the merges folder in your project. The files you add to this folder either add content to a platform-specific build of your app, or override non-platform-specific content that uses the same file name. For more information about using the merges folder, see the section “Using merges to customize each platform” in the [Apache Cordova documentation](http://cordova.apache.org/docs/en/edge/guide_cli_index.md.html).

If you don’t see the merges folder for your project in **Solution Explorer**, open the shortcut menu for the project in **Solution Explorer**, choose *Add*, and then choose *Add Platform Specific Code* to add the folder.

## <a id="Configuration"></a>Platform-specific configuration files

You can use the res/native folder in your project to inject content into the native project generated by Cordova when you build your app. This can be useful when you need to configure your app to support something Cordova itself does not expose. (Plugins that you add to your project will also automatically modify the custom version of these configuration files.)

**Caution**
We recommend avoiding adding platform-specific configuration files when possible.

The following table provides specific information for each platform.

| Platform |    Notes    |
|----------|:-------------|
|Android | Place the custom [AndroidManifest.xml](http://developer.android.com/guide/topics/manifest/manifest-intro.html) file in the res/native/android folder to configure settings such as custom intents. Use the generated version of the file in the platforms/android folder after building a Debug configuration of the project for Android.|
| iOS | Place a custom [build-debug.xcconfig](http://go.microsoft.com/fwlink/?LinkID=532829) or [build-release.xcconfig](http://go.microsoft.com/fwlink/?LinkID=532830) file in res/native/ios/cordova to override signing identities and other [build settings](http://go.microsoft.com/fwlink/?LinkID=532831) for these configurations. Place a custom [Info.plist](http://go.microsoft.com/fwlink/?LinkID=532832) file in the res/native/ios/config.xml display name folder to override settings like splashscreens or icons. The Info.plist filename must be renamed as follows: config.xml display name-Info.plist to update [iOS framework keys](http://go.microsoft.com/fwlink/?LinkID=532834). You can find a sample version of these and other files in the [cordova-ios](http://go.microsoft.com/fwlink/?LinkID=532835) GitHub repository, or when using the remote agent under the ~/remote-builds/build number/cordovaApp folder on your Mac. |
| Windows  | Place the custom package.windows80.appxmanifest (Windows 8.0), package.windows.appxmanifest (Windows 8.1), or package.phone.appxmanifestfile (Windows Phone 8.1) in the res/native/windows folder to override various configuration settings. Use the generated version of the file in the platforms/windows folder after building a Debug configuration of the project for Windows or Windows Phone (Universal). |
| Windows Phone 8  | Place the custom WMAppManifest.xml file in the res/native/wp8/Properties folder. Use the generated version of the file in the platforms/wp8/Properties folder after building a Debug configuration of the project for Windows Phone 8. |

![Download the tools](media/configure-app/IC795792.png) [Get the Visual Studio Tools for Apache Cordova](http://aka.ms/mchm38) or [learn more](https://www.visualstudio.com/cordova-vs.aspx)

## See Also

**Concepts**

[Manage Plugins for Apps Built with Visual Studio Tools for Apache Cordova](https://msdn.microsoft.com/en-us/library/dn757051.aspx)  
[Package Your App Built with Visual Studio Tools for Apache Cordova](https://msdn.microsoft.com/en-us/library/dn757048.aspx)  
[Get Started with Visual Studio Tools for Apache Cordova](https://msdn.microsoft.com/en-us/library/dn771545.aspx)

**Other Resources**

[FAQ](http://go.microsoft.com/fwlink/p/?linkid=398476)
