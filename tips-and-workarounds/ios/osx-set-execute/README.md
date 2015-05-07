#Cordova set-execute.sh

License: MIT

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
	1. Download set-execute.sh shell script.
    
	2. Add this file to your solution in Visual Studio in a solution folder and commit / check it into source control.
    
	3. Run this script in the Terminal app from your Cordova project folder whenever you are building on OSX after pulling down the project locally. Ex:
 
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	sh ../set-execute.sh
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
