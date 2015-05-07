/*
  Copyright (c) Microsoft. All rights reserved.  
  Licensed under the MIT license. See LICENSE file in the project root for full license information.
*/
var fs = require("fs");
var path = require("path");
var glob;

module.exports = function(context) {
  // Only bother if we're on OSX
  if(process.platform =="darwin") {

    // Grab the glob node module from cordova
    glob=context.requireCordovaModule("glob"); 
    // Find all custom framework files within plugin source code for the iOS platform
    glob("platforms/ios/*/Plugins/**/*.framework/**/*", function(err, possibleLinks) {
      if(err) throw err;
      
      // Folder symlinks like "Header" will appear as normal files without an extension if they came from
      // npm or were sourced from windows. Inside these files is the relative path to the directory the 
      // symlink points to. So, start detecting them them by finding files < 1k without a file extension.
      possibleLinks.forEach(function(possibleLink) {
        possibleLink = path.join(context.opts.projectRoot, possibleLink);
        if(path.basename(possibleLink).indexOf(".") < 0) {
          var stat = fs.statSync(possibleLink);
          if(stat.isFile() && stat.size < 1024 ) {
            
            // Now open each of these small files and see if the contents resolves to a valid path
            var srcPath = fs.readFileSync(possibleLink, "utf8");
            if(fs.existsSync(path.join(possibleLink, "..", srcPath))) {

              // If so, convert the file to a symlink
              console.log("Reparing symlink " + possibleLink);
              fs.unlinkSync(possibleLink);
              fs.symlinkSync(srcPath,possibleLink);
            } 
          }
        }
      });
    });
  }
}
