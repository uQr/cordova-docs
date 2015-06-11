#**General Known Issues**
This article covers general [known issues](../Readme.md#knownissues) related to Visual Studio Tools for Apache Cordova. For version specific issues, see:

- [Known issues for Visual Studio 2015](known-issues-vs2015.md)
- [Known issues for Tools for Apache Cordova CTP 3/3.1](known-issues-vs2013.md)

----------
**Missing Platform Dropdown:** The “Solution Platform” dropdown may not appear in the toolbar when upgrading Visual Studio 2013 from a previous version to Update 4. You can add using the “Standard Toolbar Options” dropdown as described in [Microsoft Support article 2954109](http://support.microsoft.com/kb/2954109).

----------
**Missing Intellisense:**
- No IntelliSense is provided for Cordova plugins in JavaScript files in Apache Cordova projects. As a workaround, developers can enable IntelliSense for Cordova plugins by explicitly adding “/// &lt;reference group="Implicit (Multi-Device Apps)” /&gt;” to the JavaScript file.
- No IntelliSense is provided within JavaScript files for other JavaScript files included via a script tag in a referring HTML page. As a workaround, developers can enable IntelliSense for other referenced JavaScript files by explicitly adding “/// &lt;reference path=”referencedFile.js” /&gt;” to the JavaScript file.

----------
**TypeScript code incorrectly identified as external, cannot read user configuration file:** When using TypeScript, there are known issues that will incorrectly identify project items as external code or will fail to read in a user configuration file. To avoid unexpected behavior when working with a Cordova TypeScript project, turn off Just My Code (Options > Debugger > General > uncheck Enable Just My Code).

----------
**"res" folder contents cannot be referenced from web content:** By design, the contents of the “res” folder cannot be accessed by web content as they are copied into platform-specific native project locations.

----------
**Mixed case file added as lower case reference:** Dragging a mixed-case file into an HTML page creates a lowercase script or style reference which will cause it to not be found on Android and iOS. Manually update the reference with the correct casing.

----------
## More Information
* [Read up on additional known issues, tips, tricks, and tutorials](../Readme.md)
* [Download samples from our Cordova Samples repository](http://github.com/Microsoft/cordova-samples)
* [Follow us on Twitter](https://twitter.com/VSCordovaTools)
* [Visit our site http://aka.ms/cordova](http://aka.ms/cordova)
* [Read MSDN docs on using Visual Studo Tools for Apache Cordova](http://go.microsoft.com/fwlink/?LinkID=533794)
* [Ask for help on StackOverflow](http://stackoverflow.com/questions/tagged/visual-studio-cordova)
* [Email us your questions](mailto://multidevicehybridapp@microsoft.com)
