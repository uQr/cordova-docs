#**Known Issues - Apache Cordova and Apache Ripple**
This article covers general [known issues](../Readme.md#knownissues) related to Apache Cordova or Ripple. 

----------
**Cordova 5.x.x:** See [Cordova 5.x.x known issues](known-issues-cordova5.md) for details on Cordova and Ripple related issues that are specific to Cordova 5.0.0 and up.

----------
**Plugin with variables not working:** Due to a Cordova issue with Cordova 4.3.0, you can run into problems with plugin variables in Cordova < 5.0.0. Plugin variable information is lost if you install the "plugin" before the "platform" which can happen depending on your workflow. They do, however, function in Cordova 5.1.1 which you can use with VS 2015. To update to 5.1.1 and use plugin variables, you will need to update your VS project and use the command line.

 1. Remove the plugins with the variables via the config designer.

 2. Update to Cordova 5.1.1 via the config designer (Platforms > Cordova CLI)

 3. From the command line:
	 1. Go to your project directory.
	 2. Type the following from substituting project path, plugin name, and variables for those that apply to you:
        
	    ~~~~~~~~~~~~~~
        cd <project path>
		npm install -g cordova@5.1.1 
        cordova plugin add nl.x-services.plugins.launchmyapp --variable URL_SCHEME=myscheme
	    ~~~~~~~~~~~~~~

----------
**TypeError: Request path contains unescaped characters:** When building or installing a plugin you may encounter this error if you are using a proxy with certain versions of Node.js and Cordova after a "npm http GET". This is a Cordova issue and the simplest workaround is to downgrade Node.js to 0.10.29. This will be resolved in a future version of Cordova. See [tips and workarounds](../tips-and-workarounds/general/README.md#cordovaproxy) for additional details.

----------
**Ripple - Camera plugin does not work when using DATA_URL:** When using the Camera plugin with Ripple and the DATA_URL option, a file reference is returned instead.

----------
**Ripple - I Haz Cheezburger?!?! error:** This error is Ripple's way of telling you that the Cordova plugin you attempted to use is not supported in the simulator. You can, however, enter data to simulate a success or failure callback to your code from this dialog.

----------
## More Information
* [Read up on additional known issues, tips, tricks, and tutorials](../Readme.md)
* [Download samples from our Cordova Samples repository](http://github.com/Microsoft/cordova-samples)
* [Follow us on Twitter](https://twitter.com/VSCordovaTools)
* [Visit our site http://aka.ms/cordova](http://aka.ms/cordova)
* [Read MSDN docs on using Visual Studo Tools for Apache Cordova](http://go.microsoft.com/fwlink/?LinkID=533794)
* [Ask for help on StackOverflow](http://stackoverflow.com/questions/tagged/visual-studio-cordova)
* [Email us your questions](mailto://multidevicehybridapp@microsoft.com)
