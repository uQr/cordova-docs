#**Known Issues - Android**
This article covers [known issues](../Readme.md#knownissues) related to Visual Studio Tools for Apache Cordova 2015 when building or deploying to Android devices or emulators. 

----------
**Cordova 5.x.x / Cordova Android 4.x.x:** See [Cordova 5.x.x known issues](known-issues-cordova5.md) for details on Android related issues that are specific to Cordova 5.0.0 and up.

----------
**Could not create the Java Virtual Machine error:** When building for Android, you may encounter a set of errors in the Errors List as follows:

~~~~~~~~~~~~~
Error		Could not create the Java Virtual Machine.			
Error		A fatal exception has occurred. Program will exit.									
Error		C:\cordova\BlankCordovaApp2\BlankCordovaApp2\platforms\android\cordova\build.bat: Command failed with exit code 1
~~~~~~~~~~~~~

The problem is that the Ant or Gradle build systems are running out of heap memory when trying to compile your application. To resolve this problem you can follow [these instructions](http://www.tomsguide.com/faq/id-1761312/fix-create-java-virtual-machine-issue.html) to increase the heap of the JVM by setting the following environment variable:

~~~~~~~~~~~~~~~~~~~~~~
_JAVA_OPTIONS=-Xmx512M
~~~~~~~~~~~~~~~~~~~~~~

If this does not resolve the issue, you can upgrade to a the 64-bit version of the JDK [from here](http://download.oracle.com/otn-pub/java/jdk/7u79-b15/jdk-7u79-windows-x64.exe) and update the JAVA_HOME environment variable to the new install location.

----------
**Missing Android SDK Versions:** If you already had the Android SDK installed, you may also need to update and install the SDK for Android 4.4.2 (API level 19), Android 5.0.1 (API Level 21), or Android 5.1.1 (API Level 22) . You may need to restart Visual Studio if it is open while updating the Android SDK through the SDK Manager to be able to build for Android after the update is complete. See [Manually Installing Dependencies](https://msdn.microsoft.com/en-us/library/dn757054.aspx#ThirdParty) for details.

----------
**Unicode Characters in Path or App Name:** Projects with non-Western characters in their project names or in the project path may not build for Android due to an Android SDK issue on older versions of Cordova. You can workaround this by simply changing the project name and path to use western characters. In recent versions of Cordova (ex: 4.3.0), unicode characters may be used without restriction if you your system locale is set to the approprate locale for the characters in use.

----------
## More Information
* [Read up on additional known issues, tips, tricks, and tutorials](../Readme.md)
* [Download samples from our Cordova Samples repository](http://github.com/Microsoft/cordova-samples)
* [Follow us on Twitter](https://twitter.com/VSCordovaTools)
* [Visit our site http://aka.ms/cordova](http://aka.ms/cordova)
* [Read MSDN docs on using Visual Studo Tools for Apache Cordova](http://go.microsoft.com/fwlink/?LinkID=533794)
* [Ask for help on StackOverflow](http://stackoverflow.com/questions/tagged/visual-studio-cordova)
* [Email us your questions](mailto://multidevicehybridapp@microsoft.com)
