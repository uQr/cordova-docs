#**Known Issues - Windows**
This article covers [known issues](../Readme.md#knownissues) related to Visual Studio Tools for Apache Cordova 2015 when building or deploying to a Windows 8.0, 8.1, Windows Phone 8.1 or any Windows 10 device or emulator.

----------
**Expired Temporary Certificate:** Due to a coding error, the Cordova Windows platform in Cordova **previous to 4.1.2** has a temporary key in it that expired on 11/11/2014. To work around this issue, update your Cordova version or [download this file](https://git-wip-us.apache.org/repos/asf?p=cordova-windows.git;a=blob;f=template/CordovaApp_TemporaryKey.pfx;h=90d7ab2208ce170d176a2ac8a60eb22fbc1cbf7a;hb=refs/tags/3.7.1) and place it in your Tools for Apache Cordova project in following location:

- CTP 1 or 2: res/cert/windows8/CordovaApp_TemporaryKey.pfx
- CTP 3: res/native/windows/CordovaApp_TemporaryKey.pfx

You can read more about the issue on the [MS Open Tech blog](http://go.microsoft.com/fwlink/?linkid=518810).

----------
## More Information
* [Read up on additional known issues, tips, tricks, and tutorials](../Readme.md)
* [Download samples from our Cordova Samples repository](http://github.com/Microsoft/cordova-samples)
* [Follow us on Twitter](https://twitter.com/VSCordovaTools)
* [Visit our site http://aka.ms/cordova](http://aka.ms/cordova)
* [Read MSDN docs on using Visual Studo Tools for Apache Cordova](http://go.microsoft.com/fwlink/?LinkID=533794)
* [Ask for help on StackOverflow](http://stackoverflow.com/questions/tagged/visual-studio-cordova)
* [Email us your questions](mailto://multidevicehybridapp@microsoft.com)
