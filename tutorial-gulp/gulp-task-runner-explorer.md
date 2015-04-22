#<a name="invoke"></a>Invoking Gulp Tasks in a Cordova Build
This tutorial is part of a series on [using Gulp with Tools for Apache Cordova projects](http://go.microsoft.com/fwlink/?LinkID=533767).

[Gulp](http://go.microsoft.com/fwlink/?LinkID=533803) is an increasingly popular JavaScript based task runner with a large number of [useful plugins](http://go.microsoft.com/fwlink/?LinkID=533790) designed to automate common “tasks” for everything from compilation, to packaging, deployment, or simply copying files around. Both Gulp and the [Apache Cordova Command Line interface](http://go.microsoft.com/fwlink/?LinkID=533773) (CLI) are Node.js based which makes the two highly complementary technologies.

You may find it useful to fire off a Gulp task every time you do a Cordova build particularly when using a Gulp to minify your JavaScript code or compile languages like [TypeScript](http://go.microsoft.com/fwlink/?LinkID=533748), [LESS](http://go.microsoft.com/fwlink/?LinkID=533791), or [SASS](http://go.microsoft.com/fwlink/?LinkID=533792). Fortunately, this is quite easy to do via a “before prepare” “hook.” A Cordova [hooks](http://go.microsoft.com/fwlink/?LinkID=533744) enables you to fire off shell or Node.js scripts at any number of different points in the Cordova build lifecycle. In fact, hooks can cover everything from platform or plugin add to compilation and emulation.

The “prepare” step in Cordova is in charge of transforming all of your content in www, plugins, and merges and preparing a native project for a given platform for compilation. The “build” command in Cordova does a “prepare” before moving on to compilation and as a result it is useful to use the “before prepare” hook to wire in pre-build tasks.

##Using the Visual Studio Task Runner Explorer
The Visual Studio Task Explorer provides a convenient way to run Gulp tasks right from Visual Studio. First let's install Gulp globally so it's convienent to use from the command line as well as Visual studio. Type:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install -g gulp
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Next, create a [package.json](http://go.microsoft.com/fwlink/?LinkID=533781) file in your project. This will be the location you will use to reference Gulp or any [Gulp plugins](http://go.microsoft.com/fwlink/?LinkID=533790) you want to use.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
{
  "devDependencies": {
	"gulp": "latest"
  }
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Visual Studio will **automatically** execute the following command for you on save if you’re editing package.json in VS, but if you’re updating package.json outside of VS, type the following to install whatever you have added to package.json:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If editing from the command line you can then update package.json with additional dependencies by hand or use the npm “—save-dev” flag. For example, this will both install the [uglify Gulp plugin](http://go.microsoft.com/fwlink/?LinkID=533793) and add it as a dependency:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install --save-dev gulp-uglify
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Next, create a file called “gulpfile.js” and add it to the root of your project. For example, here is a simple Gulp task.

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

The next time you run a build this task will automatically fire!

###Supporting the Gulp Task Runner Explorer from Command Line Builds
If you want to be able to use the “Before Build” and “After Build” event bindings **outside** of Visual Studio (say from the Cordova CLI itself) you may install the sample [Visual Studio Tools for Apache Cordova CLI Support Plugin](http://go.microsoft.com/fwlink/?LinkID=533753). This plugin works by wiring the “Before Build” event to “Before Prepare” in Cordova and “After Build” to “After Compile” when building outside of Visual Studio. **Note that currently this plugin only supports bindings in gulpfile.js in the root of your project.**

1.  Open your project in Visual Studio
2.  Double click on config.xml in your project
3.  Select the “Plugins” tab
4.  Select “Custom” and choose “Git”
5.  Enter the following URI: https://github.com/Chuxel/taco-cordova-support-plugin.git
6.  Click “Add”

See the [GitHub repo](http://go.microsoft.com/fwlink/?LinkID=533753) for additional information. We will detail what the plugin does behind the scenes in the next section.

###Behind the Scenes: VS Task Runner Explorer Cordova Hook
If you are looking for a quick way to add in support for firing Grunt tasks for Cordova build events outside of Visual Studio, consider using the sample [Visual Studio Tools for Apache Cordova CLI Support Plugin](http://go.microsoft.com/fwlink/?LinkID=533753). However, if you do not like the way this plugin works, you can easily wire in your own Cordova hook.

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

    This code simply looks at the “context” object that is passed into Cordova hook modules for the name of the hook event currently firing and then invokes a Gulp task of that same name via by “[forking](http://go.microsoft.com/fwlink/?LinkID=533804)” the Gulp node module. Since this is done asynchronously, a promise is returned to Cordova.
4.  Add the following XML element to config.xml in your Cordova project. In Visual Studio you can do this using Right-Click \> View Code.

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    <hook type="before_prepare" src="hooks/hook-gulp.js" />
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	You can wire Gulp tasks to any number of valid Cordova [hook events](http://go.microsoft.com/fwlink/?LinkID=533744) by simply adding additional hook elements to config.xml and replacing “before\_prepare” with the event you want to wire into.
5.  Create a file called “gulpfile.js” and put it in the root of your Cordova project with the following in it:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var gulp = require('gulp');
    gulp.task('before_prepare', function() {
            // Add anything you want to do before the build here
    });
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
	As with step 4, you can add a Gulp task for each hook event you want to wire into Gulp.
6.  Now run a Cordova build and try it out!

#### Automating Dependency Installation for our Task Runner Cordova Hook
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
Adding additional dependencies is simple from Visual Studio. VS will also **automaticlly** install any package added to the "devDependencies" list in package.json when you save the file.

You can also install any additional dependencies and update package.json using the “--save” flag when calling "npm install" from the command line. For example, this command will add the [uglify Gulp plugin](http://go.microsoft.com/fwlink/?LinkID=533793) as a dependency:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install --save-dev gulp-uglify
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
