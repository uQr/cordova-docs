#Using TypeScript in Cordova projects
[TypeScript](http://www.typescriptlang.org) is a programming language that is a superset of JavaScript - offering classes, modules, and interfaces. You can use these features while developing your Cordova app and TypeScript will compile into simple JavaScript that will be deployed as part of your app.

The Visual Studio Tools for Apache Cordova provide templates to help you get started with TypeScript and the TypeScript editor in Visual Studio.

##How do I start a TypeScript application?
Visual Studio provides a blank app template using TypeScript. To use it:

1. In Visual Studio, use the File > New > Project... menu.
2. Select the Templates > TypeScript > Apache Cordova Apps category and click on the Blank App (Apache Cordova) template.![New TypeScript project template](media\ts-project-template.PNG)
3.  Enter a name and file location for your project, then click OK.

Here's what the new project looks like:

![Solution folder | Project Folder | Folders: merges, res, scripts, www](media\ts-file-structure.png)

In the scripts folder you see typings, index.ts, and tsconfig.json files. These files are used by TypeScript:
* typings - a collection of typing definition files that define the APIs for common Cordova plugins.
* index.ts - a TypeScript file, similar to .js files. In this project, index.ts is the default file.
* tsconfig.json - a configuration file that you can use to customize the TypeScript build options.

##Can I add TypeScript to my existing JavaScript application?

##I need to build my project outside of Visual Studio, how do I do that?

##Where can I learn more about TypeScript?
