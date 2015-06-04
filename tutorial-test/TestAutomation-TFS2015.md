#Test Automation Using Tools for Apache Cordova and Visual Studio Online or Team Foundation Services 2015 (RTM)
**This tutorial is part of a [series of tutorials](http://go.microsoft.com/fwlink/?LinkID=533743) on building Visual Studio 2015 Tools for Apache Cordova projects in a Team / CI environment and does not apply to Visual Studio 2013 CTPs.**

Tools for Apache Cordova is designed to work with a number of different team build systems since the projects it creates are standard [Apache Cordova Command Line interface](http://go.microsoft.com/fwlink/?LinkID=533773) (CLI) projects. Team Foundation Services 2015 provides a new [cross-platform agent](http://go.microsoft.com/fwlink/?LinkID=533789) and [Gulp](http://go.microsoft.com/fwlink/?LinkID=533742lp) based build capabilities that enables TFS to build directly on Windows or OSX which is a critical capability Cordova based development. In addition, Gulp also enables you to easily add in a large number of "[plugins](http://go.microsoft.com/fwlink/?LinkID=533790)" to perform useful build tasks in environments that you do not control directly like Visual Studio Online.

##Overview
Cordova and TFS 2015 provide quite a bit of flexibility when it comes to building and running your tests. This is because Cordova projects can use a wide array of test frameworks popular in the JavaScript space including unit test frameworks like [Mocha](http://mochajs.org/), [Jasmine](http://jasmine.github.io/), or [QUnit](http://qunitjs.com/), end-to-end test frameworks like [Protractor](https://github.com/angular/protractor), and test runners like [Karma](http://karma-runner.github.io/0.8/index.html) or [Appium](http://appium.io/). You can even tap into cloud device testing services like [SauceLabs](https://saucelabs.com/).

The reason all of these frameworks are available to you is that they all integrate with test runners that run in Node.js exactly like the Apache Cordova Command Line Interface (CLI).

This tutorial will not reccomend specific test frameworks for use, but instead illustrate two primary ways to run tests in TFS 2015 and pull the results into your TFS/VSO instance. The tutorial assumes you have already setup TFS 2015 / VSO to build your app. If you have **not** followed these steps already, see the [Team Foundation Services 2015 and Visual Studio Online team build tutorial](http://go.microsoft.com/fwlink/?LinkID=533771) for details.

##Part 1: Running Your Test Framework Directly Using Node
At its most basic, you will need to execute the following steps to run your tests using the framework of your choice:

1. Install the framework (if not installed globally)
2. Run your tests using a command line call
3. Convert the output into jUnit format
4. Publish the test results to Visual Studio Online or TFS.

Let's walk through these individually. We'll keep things simple and use the Mocha unit test framework for this tutorial.

###Modify / Create package.json in Your Project
In some cases you may opt to install your test runner in a global location that TFS can access via command line calls. However, many Node.js based JavaScript test frameworks expect that part or all of the framework is available globally and you may need to install additional add-ons. Fortunatley this is simple to do.  

1. If you followed the [Team Foundation Services 2015 and Visual Studio Online team build tutorial](http://go.microsoft.com/fwlink/?LinkID=533771) you should already have a "package.json" file in your project. If not, create one.

2. Add "mocha" and ""mocha-junit-reporter" as "devDependencies" to the package.json file. The end result should look something like this:
	
	~~~~~~~~~~~~~~~~~~~~~~~~
	{
	  "devDependencies": {
	    "gulp": "latest",
	    "mocha": "latest",
	    "mocha-junit-reporter": "latest",
	    "gulp-typescript": "latest",
	    "taco-team-build": "http://aka.ms/tacoteambuild-rel"
	  }
	}
	~~~~~~~~~~~~~~~~~~~~~~~~
	
	The specific npm packages you add will vary based on your test framework. Since VSO/TFS 2015 can consume jUnit formatted test results, the key is you need to install not only the test framework (in this case the "[mocha](https://www.npmjs.com/package/mocha)" npm package) but also a jUnit reporter for the framework (in this case "[mocha-junit-reporter](https://www.npmjs.com/package/mocha-junit-reporter)").

3. To verify things are working as expected, let's add a Mocha test under "**tests/test.js**" in the project with the following contents. It has one passing test and one failing test.

	~~~~~~~~~~~~~~~~~~~~~~~~
	var assert = require("assert")
	describe('Array', function () {
	    describe('#alwaysPass()', function () {
	        it('should always pass', function () {
	            assert.equal(1, 1);
	        })
	    })
	
	    describe('#alwaysFail()', function () {
	        it('should always fail', function () {
	            throw "Yep, I failed!!";
	        })
	    })
	})
	~~~~~~~~~~~~~~~~~~~~~~~~

4. Check in / commit these files to source control.

###Update Your Build Definition
Now, let's create a build definition to run the Mocha command line utility and pull in the test results. 

1. First, we need to "npm install" to ensure all of your dependencies and test frameworks are available. If you followed the [Team Foundation Services 2015 and Visual Studio Online team build tutorial](http://go.microsoft.com/fwlink/?LinkID=533771) you should already have a build definition with an "npm install" step in it. Edit it if so. Otherwise follow these steps: 
	1. Create a new build definition and select "Empty" as the template.
	2. Under the "Build" tab, add a new build step and select **npm install** from the **Package** category
	3. Set **Advanced =\> Working Directory** to the location of the Cordova project itself inside your solution (not the solution root).

2. Next, we'll set things up to run our Mocha tests. 
	1. Under the "Build" tab, add a new build step and select **Command Line** from the **Utility** category
	2. Use the following settings:
		- **Tool:** node
		- **Arguments:** node_modules\mocha\bin\mocha --reporter mocha-junit-reporter
		- **Advanced =\> Working Directory:** Location of the Cordova project itself inside your solution (not the solution root).

	![Run Mocha](<media/test-tfs2015-1.png>)
	
	The "Arguments" passed into node will run the Mocha command line and sets the Mocha "[--reporter](http://mochajs.org/#reporters)" argument to specify that our jUnit reporter should be used. The specifics here will vary based on your test framework.

	**Note:** This build step will **fail** if there are any test failures. This is expected.

3. Finally, we need to publish the results of the test even if the build step technically "failed" because of test errors.
	1. Under the "Build" tab, add a new build step and select **Publish Test Results** from the **Test** category
	
	2. Use the following settings:
		- **Test Result Format:** JUnit
		- **Test Result Files:** */test-results.xml
		- **Control Options => Always Run:** Checked.

	![Publish Results](<media/test-tfs2015-2.png>)
	
	Selecting "Always Run" is critical as it will ensure the test results are published even if the command line utility returned a non-zero exit code.
	
##Part 2: Using Gulp
Now that you've seen the basics, you can see that the first approach gets the job done but it can be bit awkward to set up and configure. If you are using Gulp to facilitate your build as described in the [team build tutorial](http://go.microsoft.com/fwlink/?LinkID=533771) you can simplify your configuration and take advantage of a whole host of test related Gulp plugins. While we could use the "[gulp-mocha](https://www.npmjs.com/package/gulp-mocha)" plugin to redo our previous example, let's get a bit fancier this time and illustrate automating device testing using Mocha and [Appium](http://appium.io/).

If you would prefer to test in the cloud, you can check out [SauceLabs](https://saucelabs.com/) and their [saucelabs-runner](https://www.npmjs.com/package/saucelabs-runner) node module along with [PerfectoMobile](http://www.perfectomobile.com/)

**Q: Using appium too much to add in here?**

###Install and Configure Appium
Appium runs as a server on your machine, so you will need to install and configure it for use. 

1. By far the easiest way to get going is to download the Appium app by clicking the [Download button on the Appium home page](http://appium.io/).

2. From there, unzip it on the machine running the VSO agent (Windows or cross-platform) where you will be running the tests.

3. Start up Appium by double clicking on the Appium executable / app.

1. Open a command prompt on the machine running the VSO agent (Windows or cross-platform) where you will be running the tests. Use the Terminal app for OSX.


