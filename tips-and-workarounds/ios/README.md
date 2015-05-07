#iOS and OSX Tips and Workarounds
This document covers tips, tricks, and known workarounds for problems with the Cordova iOS platform or when building from OSX.

It covers the following issues:

1. [Errors about missing header or library files after adding a 3rd party Cordova plugin when building for iOS](#symlink) 
2. [Permission errors from "npm" when trying to build in vs-mda-remote, a CI server, or the command line](#npm-cache)
3. [You checked in the platforms/android or platforms/ios folder from Windows and are seeing permission errors when building on OSX](#osx-set-execute)

<a name="symlink"></a>
##Errors About Missing Header or Library Files in Plugins
There are a small number of Cordova plugins that contain "custom framework" files for iOS which use symlinks on OSX. Symlinks can break when the plugin is either downloaded on Windows and then moved to an OSX machine or when the plugin is pulled from the Cordova plugin repo / npm without the symlinks being present in the archive [as described in this Cordova bug](https://issues.apache.org/jira/browse/CB-6092). However, there is a simple hook that can be added to your project to work around this issue.

To install it:

1. Download [this hook-symlink-fix.js file](ios-plugin-symlink-fix) and drop it a "hooks" folder in your project root
2. Update config.xml with the following (using Right-Click > View Code):

  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  <hook type="before_compile" src="hooks/hook-symlink-fix.js" />
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

3. Run a "Clean" operation in VS or remove the ios platform and re-add if you are using the command line.

##Permissions Issues (EACCES Errors)
<a name="npm-cache"></a>
###You are seeing permission errors from "npm"
If you are seeing permission errors from "npm," you may be running into a situation where the your user's cache folder (~/.npm) is inaccessible. Generally this occurs if the folder or some of its contents was created while running as an administrator (sudo). Fortunately this is easy to resolve. Open the Terminal app and type:
    
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
sudo npm cache clear
sudo chown -R `whoami` ~/.npm
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

<a name="osx-set-execute"></a>
###You checked in the platforms/android or platforms/ios folder from Windows and are seeing permission errors
If you are seeing errors that are originating from files in your project's "platforms" folder when building either Android or iOS on OSX, the root cause may be that you checked in shell scripts under the "platforms/android/cordova" or "platforms/ios/cordova" folders from Windows. This is because the NTFS file system has no concept of an "execute bit" that is required to run these from OSX. (The contents of the platforms is generally not intended for checked in and by default are excluded from Cordova projects in Visual Studio as a result.)

For example, this error is saying the "version" script is not executable:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
[17:41:57] Error:
/Users/vsoagent/vsoagent/agent/work/build/b424d56537be4854de825289f019285698609afddf826d5d1a185eb60b806e47/repo/tfs-vnext test/platforms/android/cordova/version:
Command failed with exit code EACCES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To resolve this problem you have two options:
1.  Don't check in the contents of the platforms/android or platforms/ios folders into source control. This is by far the path of least resistance.

2.  If you absolutely must check in the contents of the platforms folder from Windows, you can craft a shell script to set the execute bits on these files and include it as a part of your build process.
	1. Download [this set-execute.sh shell script](osx-set-execute).
    
	2. Add this file to your solution in Visual Studio in a solution folder and commit / check it into source control.
    
	3. Run this script in the Terminal app from your Cordova project folder whenever you are building on OSX after pulling down the project locally. Ex:
 
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	sh ../set-execute.sh
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
