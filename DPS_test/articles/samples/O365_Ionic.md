#Cordova Sample App with O365 Outlook Services and Ionic

In this tutorial, you’ll learn how to create a mail, calendar and contact client using O365 Outlook services and the Ionic framework. This app allows users to access their mail, calendar and contact through O365 Outlook services API. This sample uses JavaScript code, but you can also write your Cordova app in TypeScript.

To build this app, you’ll follow these steps:

 1. Create a project
 2. Add the Ionic Framework to your project
 3. Add NProgress to your project
 4. Add O365 services to your app
 5. Set permissions to O365 mail, calendar and contact tenet to grant appropriate access to your app
 6. Create the app folder structure , UI routing, and layout using Ionic controls
 7. Acquire an access token and get the Outlook services client using AngularJS factory
 8. Use O365 API to fetch Outlook service data:
     - For the Mail app, mails flagged as important, unread mails and All mails
     - For the Calendar app, today's meeting (event start date equals today), tomorrow's meeting (event start date equals tomorrow) and all events with start date greater or equal to today
     - For the Contacts app, all contacts
 9. Use O365 API to create and delete data :
     - Delete mail, calendar event
     - Create new calendar event, contact
 10. Run the app

The following screenshot shows the running Calendar app when completed:

***INSERT PICTURE***

The following screenshot shows the running Mail app when completed:

***INSERT PICTURE***

The following screenshot shows the running Contacts app when completed.

##Prerequisites
Before you can create a new project, make sure that you’ve met all system requirements and installed the Visual Studio Tools for Apache Cordova extension for Visual Studio. For more information, see Install Visual Studio Tools for Apache Cordova.

##Create a project
Create a new Cordova project in Visual Studio by choosing **File**, **New Project**, **JavaScript**, **Apache Cordova Apps**, and then **Blank App** template.

##Add the Ionic Framework to your project
To add the Ionic Framework:

 1. From the Ionic framework website, choose Download beta.
 2. Extract the zip file.
 3. Create a new folder named lib under your Cordova project in Solution Explorer in Visual Studio, and then copy the extracted content under lib folder.

< insert image >

 4. Update the script references.

In index.html, add the following Ionic references in the <head> element, after the Cordova and platformOverrides script references:

    <script src="lib/ionic/js/ionic.bundle.min.js"></script>

In index.html, add following ionic CSS reference:

    <link href="lib/ionic/css/ionic.min.css" rel="stylesheet" />

