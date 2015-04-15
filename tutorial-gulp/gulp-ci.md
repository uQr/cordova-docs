#<a name="ci"></a>Using Gulp to Build Cordova in a Team / CI Environment
This tutorial is part of a series on [using Gulp with Tools for Apache Cordova projects](http://go.microsoft.com/fwlink/?LinkID=533767).

[Gulp](http://go.microsoft.com/fwlink/?LinkID=533803) is an increasingly popular JavaScript based task runner with a large number of [useful plugins](http://go.microsoft.com/fwlink/?LinkID=533790) designed to automate common “tasks” for everything from compilation, to packaging, deployment, or simply copying files around. Both Gulp and the [Apache Cordova Command Line interface](http://go.microsoft.com/fwlink/?LinkID=533773) (CLI) are Node.js based which makes the two highly complementary technologies.

Because it can run on Windows or OSX, Gulp can be extremely useful as a unified cross-platform build language for automating and testing your builds in a team / continuous integration (CI) environment such as Team Foundation Services 2015 or Visual Studio Online.

For specifics on using TFS 2015, see the  [abridged tutorial on specifics building Cordova apps using Gulp and TFS 2015 or Visual Studio Online](http://go.microsoft.com/fwlink/?LinkID=533771). Be aware that [TFS 2013 requires a different approach](http://go.microsoft.com/fwlink/?LinkID=533770) because MSBuild must be the primary build language.

The Cordova CLI internally uses a node module called cordova-lib. It is therefore relatively straight forward to use cordova-lib directly from a Gulp script in concept. For example:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gulp = require('gulp'),
    cordova = require('cordova-lib').cordova;

gulp.task('default', function () {
	return cordova.raw.build({
    	"platforms": ["android"],
    	"options": ["--release"]
    });
});
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

However, there are a number of considerations to bear in mind when doing a team build that are covered broadly [in this tutorial](http://go.microsoft.com/fwlink/?LinkID=533743). Rather than focusing on these details, we’ll go over how to use Gulp to build a number of different platforms at once using a fairly simple helper node module. You can find the module along with a sample gulpfile.js and package.json in [this Git repo](http://go.microsoft.com/fwlink/?LinkID=533736).

##The taco-team-build Node Module
The [taco-team-build](http://go.microsoft.com/fwlink/?LinkID=533736) node module is designed to help alleviate [common problems](http://go.microsoft.com/fwlink/?LinkID=533743) when building Cordova projects in a team or CI environment. It can be used with any number of build systems including Jake, Grunt, and Gulp or even a command line tool. Here we will focus on how to set it up and use it with Gulp. You can see documentation on the module’s methods in [the Git repo](http://go.microsoft.com/fwlink/?LinkID=533736).

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

	Note that you may also opt to use the node module from inside your project so you can modify it. To do this, you can simply add taco-team-build.js to the root of your project and require “./taco-team-build” instead of “taco-team-build”.

2.  Create a gulpfile.js file in the root of your project if you do not already have one. We’ll cover what goes in it in the next section.

3.  Type “npm install” from the command line in the root of your project

4.  If Gulp is installed on your system (npm install -g gulp), you simply need to type “gulp” from your project root to use the script.

##The Gulp Script
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

1.  Check **taco.json** to see if a Cordova version is specified. If not, it assumes you want Cordova 4.3.0.

2.  It checks to see if that version has already been installed at a location set in the **CORDOVA\_CACHE** environment variable. This will default to \_cordova in the project folder if the environment variable is missing. You can also set this location programmatically using the module’s configure method. If Cordova isn’t installed yet, it installs it in the cache.

3.  It then does the following:
    1.  Adds the sample [Visual Studio Tools for Apache Cordova CLI Support Plugin](http://go.microsoft.com/fwlink/?LinkID=533753) to the project if it is not already present.
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

##Configuring Your Build Server
If you haven’t already, you’ll need to set up your build server with all of the necessary native dependencies for the platforms you intend to build. See “Installing Dependencies” in the [Building Cordova Apps in a Team / Continuous Integration Environment](http://go.microsoft.com/fwlink/?LinkID=533743) tutorial for details.

While each build server is slightly different in terms of how you configure tasks, all you will need to do is run the following two commands:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install
./node_modules/.bin/gulp
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You should then set an environment variable called **CORDOVA_CACHE** that points to the location on your build server that you would like to use to cache multiple versions of cordova-lib and Cordova platforms.

See the [Team Foundation Services 2015](http://go.microsoft.com/fwlink/?LinkID=533771) tutorial for a specific example.

##Adding Other Dependencies
As is the case for having Cordova trigger a build task, while you are creating your gulp tasks you can install any additional dependencies manually and use the “--save” flag to update package.json automatically. For example, this will add the [uglify Gulp plugin](http://go.microsoft.com/fwlink/?LinkID=533793) as a dependency:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install --save-dev gulp-uglify
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
