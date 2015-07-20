#Android Tips and Workarounds
This document covers tips, tricks, and known workarounds for problems with the Cordova Android platform.

It covers the following tips and issues:

1. [May 26th, 2015 Android Security Issue](./security-05-26-2015) - Click for Details.
2. [Could not create Java Virtual Machine error](#couldnotcreatevm)

<a name="couldnotcreatevm"></a>
##Could Not Create Java Virtual Machine Error
When building for Android, you may encounter a set of errors in the Errors List like the following:

~~~~~~~~~~~~~
Error		Could not create the Java Virtual Machine.			
Error		A fatal exception has occurred. Program will exit.									
Error		C:\cordova\BlankCordovaApp2\BlankCordovaApp2\platforms\android\cordova\build.bat: Command failed with exit code 1
~~~~~~~~~~~~~

The problem is that the Ant or Gradle build systems are running out of heap memory when trying to compile your application. To resolve this problem you can follow [these instructions](http://www.tomsguide.com/faq/id-1761312/fix-create-java-virtual-machine-issue.html) to increase the heap of the JVM by setting the following environment variable:

~~~~~~~~~~~~~~~~~~~~~~
_JAVA_OPTIONS=-Xmx512M
~~~~~~~~~~~~~~~~~~~~~~

If this does not resolve the issue, you can upgrade to a 64-bit version of the JDK [from here](http://download.oracle.com/otn-pub/java/jdk/7u79-b15/jdk-7u79-windows-x64.exe) and update the JAVA_HOME environment variable to the new install location.

## More Information
* [Read tutorials and learn about tips, tricks, and known issues](../../Readme.md)
* [Download samples from our Cordova Samples repository](http://github.com/Microsoft/cordova-samples)
* [Follow us on Twitter](https://twitter.com/VSCordovaTools)
* [Visit our site http://aka.ms/cordova](http://aka.ms/cordova)
* [Read MSDN docs on using Visual Studio Tools for Apache Cordova](http://go.microsoft.com/fwlink/?LinkID=533794)
* [Ask for help on StackOverflow](http://stackoverflow.com/questions/tagged/visual-studio-cordova)
* [Email us your questions](mailto:/vscordovatools@microsoft.com)

