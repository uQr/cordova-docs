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
 8. Use O365 API to fetch Outlook service data :
 - For the Mail app, mails flagged as important, unread mails and All mails
 - For the Calendar app, today's meeting (event start date equals today), tomorrow's meeting (event start date equals tomorrow) and all events with start date greater or equal to today
 - For the Contacts app, all contacts
 9. Use O365 API to create and delete data :
 - Delete mail, calendar event
 - Create new calendar event, contact
 10. Run the app
