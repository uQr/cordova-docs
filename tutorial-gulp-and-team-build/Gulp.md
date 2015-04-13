#Using Gulp with Your Cordova Projects

[Gulp](http://gulpjs.com/) is an increasingly popular JavaScript based task runner with a large number of [useful plugins](http://gulpjs.com/plugins/) designed to automate common “tasks” for everything from compilation, to packaging, deployment, or simply copying files around. Both Gulp and the Apache Cordova™ Command Line interface (CLI) are node.js based which makes the two highly complementary technologies. In this tutorial we will cover a few ways Gulp can be used with Cordova:

1.  [Invoking Gulp Tasks in a Cordova Build](#invoke)
2.  [Using Gulp to Build Cordova in a Team / CI Environment](#ci)
3.  [Compiling TypeScript](#ts)

##<a name="invoke"></a>Invoking Gulp Tasks in a Cordova Build
When using a gulp task to do some pre-processing of code for languages like [TypeScript](https://www.npmjs.com/package/typescript), [LESS](https://www.npmjs.com/package/gulp-less), or [SASS](https://www.npmjs.com/package/gulp-sass) or to minify your JavaScript code, you may find it useful to fire off this task every time you do something that results in a build operation in Cordova. Fortunately, this is quite easy to do via a “before prepare” “hook.” When using the Apache Cordova Command Line Interface (CLI), you may use [hooks](http://aka.ms/cordovahooks) to fire off shell or node.js scripts at any number of different points in the build lifecycle. They cover everything from platform or plugin add to compilation and emulation.

The “prepare” step in Cordova is in charge of transforming all of your content in www, plugins, and merges and preparing a native project for a given platform for compilation. The “build” command in Cordova does a “prepare” before moving on to compilation and as a result it is useful to use the “before prepare” hook to wire in pre-build tasks.

###Using the Visual Studio Task Runner Explorer
The Visual Studio Task Explorer provides a convenient way to run Gulp tasks right from Visual Studio. If you haven’t already installed Gulp globally, go to the command line and type the following:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install -g gulp
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You should also create a “package.json” file in your project. This will be the location you will use to reference any [Gulp plugins](http://gulpjs.com/plugins/) you want to use.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
{
  "devDependencies": {
	"gulp": "latest"
  }
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Type the following to install whatever you have added to package.json:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can then update package.json with additional dependencies by hand or use the npm “—save-dev” flag. For example, this will both install the [uglify Gulp plugin](https://www.npmjs.com/package/gulp-uglify) and add it as a dependency:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install --save-dev gulp-uglify
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Next, create a file called “gulpfile.js” and add it to the root of your project.
For example, here is a simple Gulp task.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gulp = require('gulp');
gulp.task('before-build', function() {
	// Add anything you want to do before the build here
});
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In Visual Studio, open the Task Runner Explorer if you have not already by going to View \> Other Windows \> Task Runner Explorer.

![View Menu](<media/gulp-1.png>)

You will then see the Task Runner Explorer with the before-build task we created visible.

![Before Build Task](<media/gulp-2.png>)

Now to attach this to the “Before Build” event, right click and select Bindings \> Before Build.

![Before Build Task Binding](<media/gulp-3.png>)

If you want to be able to use the “Before Build” and “After Build” event bindings outside of Visual Studio (say from the Cordova CLI itself) you may install the sample [Visual Studio Tools for Apache Cordova CLI Support Plugin](http://aka.ms/vstacoplugin). This plugin works by wiring the “Before Build” event to “Before Prepare” in Cordova and “After Build” to “After Compile” when building outside of Visual Studio. **Note that currently this plugin only supports bindings in gulpfile.js in the root of your project.**

1.  Open your project in Visual Studio
2.  Double click on config.xml in your project
3.  Select the “Plugins” tab
4.  Select “Custom” and choose “Git”
5.  Enter the following URI: https://github.com/Chuxel/taco-cordova-support-plugin.git
6.  Click “Add”

See the [GitHub repo](http://aka.ms/vstacoplugin) for additional information. We will detail what the plugin does behind the scenes in the next section.

###Using a Gulp Task Runner Cordova Hook
If you are looking for a quick way to add in support for firing Grunt tasks for Cordova build events, consider using the sample [Visual Studio Tools for Apache Cordova CLI Support Plugin](http://aka.ms/vstacoplugin). However, if you do not like the way this plugin works, you can easily wire in your own Cordova hook.

Hooks can be implemented in a number of different ways: shell scripts, Node.js scripts, or Node modules. Fortunately, the code to call a Gulp task from a hook is trivial. In this example we’ll use a Node.js module since it can run on both Windows and OSX and has less overhead than starting up a shell script.

1.  Run the following commands in the command line from the root of your  project. We’ll automate this away next.
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    npm install gulp
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
2.  Create a file called “hook-gulp.js” in a new “hooks” folder in your Cordova     project (or any other location you would prefer)
3.  Place the following code in it:
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    module.exports = function (context) {

		var Q = context.requireCordovaModule('q'),
        fork = require('child_process').fork;

        // Use the gulp node module to execute the task and return a promise
        var deferred = Q.defer();
        var child = fork("./node_modules/gulp/bin/gulp.js", context.hook);
        child.on("error", function (err) {
            deferred.reject(err);
        });
        child.on("exit", function (code, signal) {
            if (code === 0 && signal === null) {
                deferred.resolve();
            } else {
                deferred.reject("Non-zero exit code or signal.");
            }
        });
        return deferred.promise;
    }
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    This code simply looks at the “context” object that is passed into Cordova hook modules for the name of the hook event currently firing and then invokes a Gulp task of that same name via by “[forking](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options)” the Gulp node module. Since this is done asynchronously, a promise is returned to Cordova.
4.  Add the following XML element to config.xml in your Cordova project. In Visual Studio you can do this using Right-Click \> View Code.
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    \<hook type="before\_prepare" src="hooks/hook-gulp.js" /\>
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	You can wire Gulp tasks to any number of valid Cordova [hook events](http://aka.ms/cordovahooks) by simply adding additional hook elements to config.xml and replacing “before\_prepare” with the event you want to wire into.
5.  Create a file called “gulpfile.js” and put it in the root of your Cordova project with the following in it:
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var gulp = require('gulp');
    gulp.task('before_prepare', function() {
            // Add anything you want to do before the build here
    });
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
	As with step 4, you can add a Gulp task for each hook event you want to wire into Gulp.
6.  Now run a Cordova build and try it out!

### Automating Dependency Installation for our Gulp Task Runner
At this point, anything you add to the “before\_prepare” Gulp task will be fired off on each build. It is really common to want to use other node modules in a Gulp task particularly in the form of plugins. You can install these manually, but let’s take the next step and automate installation of Gulp and any other node modules you may want to use.
1.  Create a “package.json” file in the root of your project and place the following in it:

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    {
      "devDependencies": {
        "gulp": "latest"
      }
    }
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

2.  Update “hook-gulp.js” as follows:

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    module.exports = function (context) {
        var Q = context.requireCordovaModule('q'),
            fs = require('fs'),
            path = require('path'),
            fork = require('child_process').fork,
            exec = Q.nfbind(require('child_process').exec);

            // Check to see if Gulp is installed and if not use "npm install" to 
            // install the contents of package.json in the node_modules folder
        if (!fs.existsSync(path.join(process.cwd(), "node_modules", "gulp"))) {
            console.log("Gulp not found. Installing package dependencies.")
            return exec("npm install").then(function (result) {
                    console.log(result[0]);
                    if (result[1] != "") {
                        console.error(result[1]);
                    }
                })
        .then(function () { return runGulpTask(context.hook); });
        } else {
            return runGulpTask(context.hook);
        }

        function runGulpTask(hook) {
                // Use the gulp node module to execute the task and return a promise
            var deferred = Q.defer();
            var child = fork("./node_modules/gulp/bin/gulp.js", hook);
            child.on("error", function (err) {
                deferred.reject(err);
            });
            child.on("exit", function (code, signal) {
                if (code === 0 && signal === null) {
                    deferred.resolve();
                } else {
                    deferred.reject("Non-zero exit code or signal.");
                }
            });
            return deferred.promise;
        }
    }
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	This will then first check to see if Gulp is already installed and if not install everything you have in package.json automatically by executing the “npm install” command from the root of your project. Either way it calls the task matching the Cordova hook event.

3.  Now run a Cordova build and try it out!

#### Adding Other Dependencies
While building your Gulp script you can install any additional dependencies via the command line and use the “--save-dev” flag to update package.json. For example, this will add the [“gulp-typescript” module](https://www.npmjs.com/package/gulp-typescript) as a dependency:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install gulp-typescript --save-dev
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

##<a name="ci"></a>Using Gulp to Build Cordova in a Team / CI Environment
Gulp can also be useful as a build language for automating and testing your builds in a team build / continuous integration (CI) environment in a number of different build server technologies including [Team Foundation Services 2015 and Visual Studio Online](http://aka.ms/cordovatfs2015). Be aware that [TFS 2013 requires a different approach](http://aka.ms/cordovatfs2013) because MSBuild must be the primary build language.

The Cordova CLI internally uses a node module called cordova-lib. It is relatively straight forward to use cordova-lib directly from a Gulp script. For example:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gulp = require('gulp'),
    cordova = require('cordova-lib');

gulp.task('default', function () {
	return cordova.raw.build({
    	"platforms": ["android"],
    	"options": ["--release"]
    });
});
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

However, there are a number of considerations to bear in mind when doing a team build that are covered broadly [in this tutorial](http://aka.ms/cordovaci). Rather than focusing on these details, we’ll go over how to use Gulp to build a number of different platforms at once using a fairly simple helper node module. You can find the module along with a sample gulpfile.js and package.json in this Git repo.

###The taco-team-build Node Module
The taco-team-build node module is a sample general module designed to help alleviate [common problems](http://aka.ms/cordovaci) when building Cordova projects automatically. It can be used with any number of build systems including Jake, Grunt, and Gulp or even a command line tool. Here we will focus on how to set it up and use it with Gulp. You can see documentation on the module’s methods in the Git repo.

The easiest way to get started is to simply place the contents of the “samples/gulp” folder in the Git repo to the root of your project. Otherwise you can you should do the following:

1.  Add a package.json to the root of your project with at least the following
    contents:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    {
        "devDependencies": {
	        "gulp": "latest",
	        "taco-team-build": "http://aka.ms/tacoteambuild-rel"
        }
    }
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	Note that you may also opt to use node module from inside your project so you can modify it. To do this, you can simply add taco-team-build.js to the root of your project and require “./taco-team-build” instead of “taco-team-build”.

2.  Create a gulpfile.js file in the root of your project if you do not already have one. We’ll cover what goes in it in the next section.

3.  Type “npm install” from the command line in the root of your project

4.  If Gulp is installed on your system (npm install -g gulp), you simply need to type “gulp” from your project root to use the script.

###The Gulp Script
As in the previous section, you will need to include a “gulpfile.js” file in your project. At its simplest, this is all you need to do to use Gulp to build using this module.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gulp = require('gulp'),
cordovaBuild = require('taco-team-build');

gulp.task('default', function () {
    return cordovaBuild.buildProject("android", ["--release"]
        .then(function() { return cordovaBuild.pacakgeProject("android"); });
});
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This script will do the following:

1.  Check “taco.json” to see if a Cordova version is specified. If not, it assumes you want Cordova 4.3.0.

2.  It checks to see if that version has already been installed at a location set in the CORDOVA\_CACHE environment variable. This will default to \_cordova in the project folder if the environment variable is missing. You can also set this location programmatically using the module’s configure method. If Cordova isn’t installed yet, it installs it in the cache.

3.  It then does the following:
    1.  Adds the [Visual Studio Tools for Apache Cordova Support Plugin](http://aka.ms/vstacoplugin) to the project if it is not already present.
	2.  Adds the specified platform to the project
    3.  Builds the project
    4.  Packages the project (which is really only useful for iOS currently)

Each method returns a promise so that you can chain the steps or run them concurrently. While this is easy to use, you may want to create a script that will automatically build all of the platforms your project supports across OSX and Windows. This is extremely useful for team build scenarios where you need to be able to check in a script that automates all of your build and test steps. In addition, you may want add some additional tasks for other pre or post build steps. Here is an enhanced script that provides you with this flexibility:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gulp = require('gulp'),
	cordovaBuild = require('taco-team-build');

var winPlatforms = ["android", "windows", "wp8"],
	osxPlatforms = ["ios"],
	buildArgs = {
		android: ["--release", "--ant"],
		ios: ["--release", "--device"],
		windows: ["--release"],
		wp8: ["--release"]
	}

// "Darwin" is the platform name returned for OSX.
var platformsToBuild = process.platform == "darwin" ? osxPlatforms : winPlatforms;

gulp.task('default', ['package'], function () {
	// Copy results to bin folder
	gulp.src("platforms/android/ant-b	uild/*.apk").pipe(gulp.dest("bin/release/android"));
	gulp.src("platforms/android/build/*.apk").pipe(gulp.dest("bin/release/android"));
	gulp.src("platforms/windows/AppPackages/**/*").pipe(gulp.dest("bin/release/windows/AppPackages"));
	gulp.src("platforms/wp8/bin/Release/*.xap").pipe(gulp.dest("bin/release/wp8"));
	gulp.src("platforms/ios/build/device/*.ipa").pipe(gulp.dest("bin/release/ios"));
});

gulp.task('build', function () {
	return cordovaBuild.buildProject(platformsToBuild, buildArgs);
});

gulp.task('package', ['build'], function () {
	return cordovaBuild.pacakgeProject(platformsToBuild);
});
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

###Configuring Your Build Server
If you haven’t already, you’ll need to set up your build server with all of the necessary native dependencies. See “Installing Dependencies” in the [Building Cordova Apps in a Team / Continuous Integration Environment](http://aka.ms/cordovaci) tutorial for details.

While each build server is slightly different in terms of how you configure tasks, all you will need to do is run the following two commands:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install
gulp
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

See the [Team Foundation Services 2015](http://aka.ms/cordovatfs2015) tutorial for a specific example.

###Adding Other Dependencies
As is the case for having Cordova trigger a build task, while you are creating your gulp tasks you can install any additional dependencies manually and use the “--save” flag to update package.json automatically. For example, this will add the [uglify Gulp plugin](https://www.npmjs.com/package/gulp-uglify) as a dependency:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install --save-dev gulp-uglify
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

##<a name="ts"></a>Compiling TypeScript
If you’re using TypeScript in your project, you’ll want to compile it in your team / CI build environment. You also may want to be able to compile your TypeScript code from the command line rather than Visual Studio. Fortunately this is straight forward to do with Gulp.

1.  Add “gulp-typescript” as a devDependency in a package.json file in the root
    of you project. If you already have a package.json file, type the following
    from the command line in your project folder:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    npm install --save-dev gulp-typescript
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    This will install the “gulp-typescript” plugin and update package.json as follows:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    {
        "devDependencies": {
            "gulp": "latest",
            "gulp-typescript": "latest"
            "taco-team-build": "http://aka.ms/tacoteambuild-rel"
    	}
    }
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

2.  Add the following task to gulpfile.js:

 	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var ts = require('gulp-typescript');

    gulp.task('scripts', function () {
        // Compile TypeScript code
        gulp.src('scripts/**/*.ts')
        	.pipe(ts({
            	noImplicitAny: false,
                noEmitOnError: true,
                removeComments: false,
            	sourceMap: true,
                out: "appBundle.js",
                target: "es5"
    		}))
    		.pipe(gulp.dest("www/scripts"));
    });
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	This will compile anything in the “scripts” folder in the root of your Cordova project and copy them as a single JavaScript file called “appBuilde.js” under the “www/scripts” folder. You should update this with the location of all of the TypeScript files you want compiled. You can add an array of locations to compile as follows:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	gulp.src(['scripts/**/*.ts','www/typescript/**/*.ts'])
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

3.  You should also update your build task to require that the “scripts” task is
    run first.

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    gulp.task('build', ['scripts'], function () {

    …
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You may also find it useful to set up a “file watcher” that automatically compiles your TypeScript code whenever you make an edit. Gulp’s “watch” feature
makes this easy to do.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
gulp.task("watch", ["scripts"], function () {
    gulp.watch("scripts/**/*.ts", ["scripts"]);
});
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You then can start up the watcher by simply typing the following from the
command line:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
gulp watch
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

See the [sample Git Repo](http://aka.ms/tacoteambuild) for a gulpfile with TypeScript already configured for use.