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

##Add NProgress to your project
NProgress will be used to show a progress bar while fetching mail, calendar and contacts from O365.

To add Nprogress to your project:

 1. From the NProgress [website](http://ricostacruz.com/nprogress/), choose Download.

 2. Extract the zip file.
 3. Create a folder named **nprogress** under the **lib** folder in Solution Explorer and copy **nprogress.js** into the folder.

 4. Copy **nprogress.css** under the css folder
 5. In index.html, add the following NProgress references in the <head> element:

    <link href="css/nprogress.css" rel="stylesheet" />
    <script src="lib/nprogress/nprogress.js"></script>

##Add O365 services to your app
Sign up for an Office 365 Developer Site and set up Azure Active Directory access for your Developer Site by following instructions at [Setup your Office 365 development environment](https://msdn.microsoft.com/office/office365/howto/setup-development-environment).

Once you have set up your Developer Site, follow these steps to add and configure Office 365 APIs using the Services Manager in Visual Studio.

**To add and configure Office 365 APIs:**

 1. Download and install the [Office 365 API tools](https://visualstudiogallery.msdn.microsoft.com/a15b85e6-69a7-4fdf-adda-a38066bb5155) from the Visual Studio Gallery.
 2. From the shortcut menu of the project node, choose **Add**, and then choose **Connected Service**.
 3. At the top of the Services Manager dialog box, choose the Office 365 link, and then choose Register your app. Sign in with a tenant administrator account for your Office 365 developer organization:

{image}

##Set permissions for O365 mail, calendar and contact tenet to grant appropriate access to app
After you sign in to O365 account you will see a list of O365 services like mail, calendar, contacts, and files under your tenant account. Select the service that you want to use in your app and set the permission you want your app to access, as specified below for each app.

###Mail app
Select **Mail** and click the **Permissions**... link in the right pane. Then choose to read and write to user's mail because the app will need to perform read and delete mail operations. Similarly, if you want the app to send mail, then select mail as a user option.

{ insert image }

###Calendar app
Select **Calendar** and click the **Permissions**... link in the right pane, and then select **have full access to users' calendar**. Similarly, if you want to give only read access to the app, then select **Read users' calendar**.

{ insert image }


###Contact app
Select **Contact** and click the **Permissions**... link in the right pane, and then select **have full access to users' contact**. Similarly, if you want to give only read access to app, select **Read users' contact**.

{ insert image }


###Apply changes and update references
To apply changes and update references:

 1. Click **Apply** and **Ok** to set the permissions and add the O365 API to your project. Services Manager adds the services folder to your project.

{ insert image }

 2. 
