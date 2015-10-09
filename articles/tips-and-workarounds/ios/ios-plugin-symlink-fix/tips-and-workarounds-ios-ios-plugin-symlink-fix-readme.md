<properties pageTitle="Cordova plugin Symlink fix for iOS plugins with custom frameworks"
  description="This is an article on bower tutorial"
  services=""
  documentationCenter=""
  authors="kirupa" />
  <tags
     ms.service="na"
     ms.devlang="javascript"
     ms.topic="article"
     ms.tgt_pltfrm="mobile-multiple"
     ms.workload="na"
     ms.date="09/10/2015"
     ms.author="kirupac"/>

#Cordova plugin Symlink fix for iOS plugins with custom frameworks

License: MIT

This is a hook designed to fix custom iOS frameworks that are contained within Cordova plugins when their symlinks are broken. (Ex: Those found on the [Facebook Connect plugin](https://github.com/wizcorp/phonegap-facebook-plugin)).

Symlinks can break when the plugin is either downloaded on Windows and then moved to an OSX machine or when the plugin is pulled from the Cordova plugin repo / npm without the symlinks being present in the archive [as described in this Cordova bug](https://issues.apache.org/jira/browse/CB-6092).

To install it:

1. Grab the js file and drop it a "hooks" folder in your project root.
2. Update config.xml with the following:

  ```
  <hook type="before_compile" src="hooks/hook-symlink-fix.js" />
  ```

3. Remove the ios platform if present (or the plugin).
4. Re-add.

Plugins should now be fixed.

Alternatively you can install the [Visual Studio Tools for Apache Cordova CLI Support Plugin](http://go.microsoft.com/fwlink/?LinkID=533753) which encapsulates this functionality.
