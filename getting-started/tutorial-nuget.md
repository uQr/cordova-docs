# Using NuGet in Cordova projects

[NuGet](https://www.nuget.org/) is the package manager for the Microsoft development platform. It has client tools to produce and consume packages and a gallery where all the packages are hosted. In addition to popular .NET packages, it also hosts many popular Javascript frameworks that are typically used in ASP.NET applications. 
Cordova projects created in Visual Studio can also use NuGet to add Javascript references, just like in any other web project. Most NuGet scripts may be downloaded in a `Scripts` folder by default, depending on the package's configuration. To enable these scripts to work in Cordova and are packaged in the final application, they would need to be moved to the `www` folder. While this can happen manually, Cordova's [Hooks](http://cordova.apache.org/docs/en/edge/guide_appdev_hooks_index.md.html) are a great way to automate this step in the developer workflow. 
Hooks represent special scripts that can be added by plugins or the project itselt, to run custom commands at various stages of the Cordova build process. To define a hook in your project, you would need to declare the command and the step when it runs, it in the `config.xml`. 
To copy the resources over to the `www` folder, we could simpy write a hook in our application to run before Cordova starts anything; in the `before_prepare` step. First, we open `config.xml` in the "code-view" and add the following line anywhere under root `<widget>` element

``
<hook type="before_prepare" src="hooks/copyNuGetFiles.js" />
``

As declared in teh statement above, we now create a folder called `hooks` under the project and a new file in it called `copyNuGetFiles.js`. Cordova hooks can be Node modules, or shell scripts. Node modules are much more powerful since they are passed a context object describing the environment in which the scripts are running. The contents of the file are

```
// Contents of copyNuGetFiles.js
var path = require('path');
module.exports = function (context) {
    var shell = context.requireCordovaModule('shelljs');
    var src = path.join(context.opts.projectRoot, 'Scripts');
    var dest = path.join(context.opts.projectRoot, 'www/lib')
    shell.cp('-fr', src, dest);
};

```

The hooks itself is pretty straight forward. It first uses a module called [shelljs](https://www.npmjs.com/package/shelljs) that is already used in Cordova. It then defines the source where NuGet places the script files. 

> Note that this location may change, depending on the package. You may have to modify the source depending on where this is placed. 

After defining the destination, we simply use the `shelljs` module to perform the actual copy. Once you refer to the Javascript files in your `www/index.html` file, you can start using the libraries in your code! 
