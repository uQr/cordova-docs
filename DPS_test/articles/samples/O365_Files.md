#Cordova Sample App with O365 Discovery Service and the Files API

In this topic, you will learn how to leverage some of the new APIs in the client libraries for Office 365 in an app built using Visual Studio Tools for Apache Cordova.

##Office 365 API Tools for Visual Studio 2013
If you are trying to consume the Office 365 APIs for the first time in a Cordova application workflow, please follow instructions in the [documentation](https://msdn.microsoft.com/library/dn771546.aspx#Office) to [install Office 365 API Tools for Visual Studio](https://visualstudiogallery.msdn.microsoft.com/7e947621-ef93-4de7-93d3-d796c43ba34f) and to add the service into your project.

Office 365 provides REST-based APIs that enable developers to access Office resources such as calendar, contacts, mail, files, and more. You can program directly against the REST APIs to interact with Office 365, but if you use the REST APIs you must write and maintain code around managing authentication tokens, constructing the right URLs, querying for the API you want to access, and performing other tasks. By using Office 365 client libraries to access the Office 365 APIs instead of REST, you reduce the complexity of the code that you need to write in your Cordova application.

The latest update for [Office 365 API Tools for Visual Studio](http://blogs.office.com/2014/08/05/office-365-api-tool-visual-studio-2013-summer-update/) includes support for SharePoint File services, which provides access to the MyFiles service. In addition to SharePoint services, support for the O365 Discovery service is provided which helps to find the SharePoint service endpoints for the logged in user. These services can be used to build a simple file explorer that enumerates files in OneDrive for Business.

##Building a Simple File Explorer for OneDrive for Business
The goal of this app is to enumerate files stored in OneDrive for Business. The source for the sample is on [GitHub](http://go.microsoft.com/fwlink/?LinkID=517836).

***INSERT PICTURE!!!!***

##Getting Started
The following frameworks and libraries are used in this application:

 - [Bootstrap](http://getbootstrap.com/), for layout and styling.
 - [AngularJS](https://angularjs.org/), for binding data with the UI.
 - [Office 365 APIs](https://msdn.microsoft.com/library/office/dn605892%28v=office.15%29), for interacting with Office365 to enumerate OneDrive for Business.

The services used in the demo application to fetch files from OneDrive are:

 - [O365 Discovery Services](https://msdn.microsoft.com/library/office/dn776441%28v=office.15%29.aspx), to find SharePoint service endpoints for the logged in user. 
 - [Files API](https://msdn.microsoft.com/library/office/dn605900%28v=office.15%29.aspx), to retrieve the file and folders information for the user’s OneDrive for Business.

