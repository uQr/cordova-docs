<properties pageTitle="Walkthrough: Package and publish your app | Cordova"
  description="description"
  services=""
  documentationCenter=""
  authors="subhagpo" />
  <tags
     ms.service="na"
     ms.devlang="javascript"
     ms.topic="article"
     ms.tgt_pltfrm="mobile-multiple"
     ms.workload="na"
     ms.date="09/10/2015"
     ms.author="Subhag.Oak"/>

# Walkthrough: Package and Publish your Cordova Applications
Using Visual Studio Tools for Apache Cordova, you can build hybrid apps for Windows, Android, and iOS platforms. The process to create application packages for store consumption is different for each of the three supported platforms.

Here is step by step tutorial on how to go about it.

## Windows:
Once you are ready to package your app, use the Solution Platforms dropdown to change the platform to the specific Windows platform that matches the platform you are targeting as shown in the figure below:
![Windows: Debug targets](media/tutorial-package-publish-readme/windows_target.png)

Once you select the target platform, choose **Project**, **Store**, **Create App Packages** as shown below, to start the packaging wizard.

![Windows: Create Appx Packages](media/tutorial-package-publish-readme/windows_createPackage.png)

The wizard guides you through a workflow that is similar to the workflow for creating Windows desktop and Windows phone APPX packages. It asks you to first log into your developer account, then associate your package with a new or existing name, and finally it builds a release version of the package generating the Package.StoreAssociation.xml in the res\native\windows folder:

![Windows: Resources](media/tutorial-package-publish-readme/windows_assets.png)

> **Note**:

> * Cordova generates a XAP package for Windows Phone 8 platform, so **Create App Packages** is disabled if you choose Windows Phone 8 as target platform.

> * Visual Studio creates a test certificate under the res\native\windows folder when the project is created, but you can also use an existing certificate to sign your package by replacing the default certificate with yours.

> * The final APPX resides in the <ProjectRoot>\AppPackages folder.


## Android:
Once you are ready to package your application for Android, change the platform to the Android platform, the build configuration to release, and select **Device** as the debug target.
![Android: Debug Target](media/tutorial-package-publish-readme/android_debug.png)

If you initiate a build with this configuration, Visual Studio builds an unsigned release package that can be deployed to a machine but cannot be published to store.

**Cordova CLI verions < 5.0**, use ANT to build Android applications. In order to create a release signed package, you need to provide keystore information to the build in the ant.properties file under res\native\android. A keystore is a binary file that contains a set of private keys. You must keep your keystore in a safe and secure place.

![Android: Build assets](media/tutorial-package-publish-readme/android_assets.png)

**Cordova CLI verions > 5.0**, use GRADLE to build android applications. In order to create a release signed package, you need to provide keystore information to the build in the build.json file under the project root. A keystore is a binary file that contains a set of private keys. You must keep your keystore in a safe and secure place.

![Android: Build assets](media/tutorial-package-publish-readme/android_assets_cordova5.png)

You can either provide information about an existing keystore or create a new one. You can create a new keystore using standard tools from the Android SDK and the JDK using the following steps.

1. Open a new admin command prompt.

2. Change directory to %JAVA_HOME%\bin (e.g: C:\Program Files (x86)\Java\jdk1.7.0_55\bin).

3. Use the keytool command

    ```
    keytool -genkey -v -keystore c:\my-release-key.keystore -alias johnS -keyalg RSA -keysize 2048 -validity 10000**
    ```

    Running the above command, you are prompted for passwords for the keystore and key, and to provide the Distinguished Name fields for your key, as follows:

    ```
    Enter keystore password: pwd123
    Re-enter new password: pwd123
    What is your first and last name?
    [Unknown]= John Smith
    What is the name of your organizational unit?
    [Unknown]= ABC
    What is the name of your organization?
    [Unknown]= XYZ
    What is the name of your of your City or Locality?
    [Unknown]= Redmond
    What is the name of your State or Province?
    [Unknown]= WA
    What is the two-letter country code for this unit?
    [Unknown]= US
    Is CN=John Smith, OU=ABC, O=XYZ, L=Redmond, ST=WA, C=US correct??
    [no]=  y

    Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 10,000 days
    for: CN= John Smith, OU= ABC, O= XYZ, L=Redmond, ST=WA, C=US

    Enter key password for <johnS>
        (RETURN if same as keystore password):
    ```

4. The SDK then generates the keystore as a file called **my-release-key.keystore** under *C:\* drive. The keystore contains a single key, valid for 10000 days.

5. For Cordova CLI verions < 5.0, edit the **ant.properties in res\native\android** with the information for the keystore:

    ```
    key.store=c:\\my-release-key.keystore
    key.alias=johnS
    key.store.password= pwd123
    key.alias.password= pwd123
    ```
    For Cordova CLI verions > 5.0, edit the **build.json in the project root** with the information for the keystore:

    ```
    {
    	"android": {
        	"release": {
            	"keystore":"c:\\my-release-key.keystore",
    			"storePassword":"pwd123",
    			"alias":"johnS",
				"password":"pwd123",
                "keystoreType":"",
            }
        }
    }
    ```

After you have edited the appropriate file with the keystore information and built the app for release configuration, the result is a release signed APK package at *projectroot*\bin\Android\Release. Once your app is ready for publishing, you can upload this app on Google play by signing into your [Google play developer console](https://play.google.com/apps/publish/). Please refer to [Launch Checklist for Google Play](http://developer.android.com/distribute/tools/launch-checklist.html) for successful publication of you app.

## iOS:

Since you cannot build iOS packages on the Windows platform, you have to install and run the remotebuild agent on a Mac. [Here](./getting-started/configure-vs-tools-apache-cordova.md#IosConfig) are the instructions on how to setup your Mac machine for iOS builds.

Once you have installed the remote build agent, you need to setup the machine with proper certificates and provisioning profiles for code signing, so that the build can generate a signed IPA packages. Code signing your app lets users trust that your app has been created by a source known to Apple and that it hasn’t been tampered with. All iOS apps and most Mac apps must be code signed and provisioned to launch on a device, to be distributed for testing, or to be submitted to the store. A development certificate identifies you, as a team member, in a development provisioning profile that allows apps signed by you to launch on devices. A distribution certificate identifies your team or organization in a distribution provisioning profile and allows you to submit your app to the store.

You need a developer certificate and a developer provisioning profile to install, launch, and debug your app on a device (through VS). Distribution certificate and a matching distribution profile is required for store publication. Take the following steps to create and install distribution certificates and the matching provisioning profiles, which will allow you to publish your package to Apple app store.

### Generate a distribution certificate:
1. In a browser, go to [Apple Dev Portal](https://developer.apple.com).

2. Choose **Member Center** and login with your developer account credentials.

3. Choose **Certificates, Identifiers & Profiles**.

    ![ios: CertSection](media/tutorial-package-publish-readme/ios-CertSection.png)

4. Choose **Certificates**, click the “+” sign to create a new Certificate & choose the App Store and Ad Hoc radio button.

    ![ios: Dev Cert](media/tutorial-package-publish-readme/ios-CertDis.png)

5. Scroll to the bottom of the page and choose **Continue**.

6. The next screen explains the process of creating a **Certificate Signing Request (CSR)**. Click **Continue** at the bottom of the page.

    ![ios: CSR](media/tutorial-package-publish-readme/ios-csr.png)

    > **Note:** For more detailed information, see the next section in this article.

7. Navigate to the CSR file & choose that file.

    ![ios: Using CSR](media/tutorial-package-publish-readme/ios-choosecsr.png)

8. Choose **Generate**. Once you refresh your browser, you can download the developer certificate by choosing **Download**.

  The certificate will download into your **downloads** folder & double-clicking this will install this file into Keychain.  This is what the Development Certificate looks like in Keychain Access.

    ![ios: Using CSR](media/tutorial-package-publish-readme/ios-disCertLoc.png)

#### Detailed steps to generate the Certificate Signing Request (CSR) [step 6, above]:
In order for you to generate a certificate you must request a certificate using keychain access.

* Launch **Keychain Access**. Keychain Access is located in Macintosh HD/Applications/Utilities.

    ![ios: KeyChain](media/tutorial-package-publish-readme/ios-keyChain.png)

* Once Keychain Access is launched, choose **Keychain Access**, **Certificate Assistant**, **Request a Certificate from a Certificate Authority**.

    ![ios: Request CSR](media/tutorial-package-publish-readme/ios-reqcsr.png)

* Enter your Apple Developer Account email address, Common Name (your name),CA (Certificate Assistant) [optional] & Choose: Request is **Saved to disk**.

    ![ios: Request CSR Information](media/tutorial-package-publish-readme/ios-csrInfo.png)

* Choose **Continue**, save the file to your hard drive and choose **Done**.

Now you can go back to the distribution certificate section still active in your browser [step 7, above] and choose **Choose File**.

![ios: Using CSR](media/tutorial-package-publish-readme/ios-usecsr.png)

### Generate a distribution provisioning profile:
1. In a browser, go to [Apple Dev Portal](https://developer.apple.com).

2. Choose **Member Center** and login with your developer account credentials.

3. Choose **Certificates, Identifiers & Profiles**.

    ![ios: CertSection](media/tutorial-package-publish-readme/ios-CertSection.png)

4. Choose **Provisioning**, click the “+” sign to add a new provisioning profile & choose **App Store** as shown in the figure below and choose **Continue**.

    ![ios: Distribution profile](media/tutorial-package-publish-readme/ios-proDis.png)

5. Select the correct App ID and choose **Continue**.

    ![ios: Distribution profile, Selecting App Id](media/tutorial-package-publish-readme/ios-proappid.png)

6. Select the certificates you wish to include in this provisioning profile. Choose **Continue** after you have selected the certificates.

    ![ios: Distribution profile, Choosing certificates](media/tutorial-package-publish-readme/ios-proCertChoice.png)

7. Name the profile and choose “Generate” and download the provisioning profile.

    ![ios: Distribution profile, Naming the profile](media/tutorial-package-publish-readme/ios-proNaming.png)

8. Double-click that file to install it and then add it to the **Code signing section of *Build Settings* for Xcode**.

    ![ios: XCode, build settings](media/tutorial-package-publish-readme/ios-xcodeBuildSettings.png)

    Add the provisioning profile:

    ![ios: XCode, build settings](media/tutorial-package-publish-readme/ios-xcodepro.png)

    Add the distribution certificate:

    ![ios: XCode, build settings](media/tutorial-package-publish-readme/ios-xcodecer.png)

    > **Note:** While creating the developer provisioning profile [after step 6], you will have to select the devices you wish to include in this provisioning profile. To install an app signed with this profile on a device, the device must be included.

    ![ios: Developer profile, Choosing devices](media/tutorial-package-publish-readme/ios-proDev.png)

Once you have installed the distribution certificates and the matching provisioning profiles in XCode’s build settings on the remotebuild agent, you are now ready to build a release package for iOS from VS. On your host Windows machine, in Visual Studio, change the platform to **iOS**, build configuration to **Release** and target to **Remote (or Local) Device**, as shown below:

![ios: Debug targer](media/tutorial-package-publish-readme/ios-vsrel.png)

This starts a build on the remotebuild agent and uses the distribution certificate and the matching provisioning profile to build a release signed iPhone Application package (.ipa) which is then available at *projectroot*\bin\iOS\Release** folder on the host machine after the build completes.

Once you've built your iPhone Application (.ipa) file, you'll need to fill out the required forms on the iTunes Connect site to submit the app to Apple. In filling out the information, be as transparent as possible to Apple, including any demo accounts that might be needed to run your app. Because the Apple reviewers must be able to verify your app, providing the information required ahead of time will help your app get through the review process more quickly. Note that Apple's policy stipulates that your app's keywords cannot contain your app name.

To **submit** your application to the store:

1. Navigate to the iTunes Connect area of the [iOS Dev Center](http://developer.apple.com/devcenter/ios/).
2. Go to the Manage Your Apps page and click Add New App.
3. Fill out the forms describing your company and application.
4. On the appropriate form, upload the 512 × 512 pixel icon and your application screenshots.
5. Save the app description.
6. Back on the Manage Your Apps page, select the app description you just created and click the Ready to Upload Binary button.
7. Fill out the Export compliance form.

Your app should now be in a *Waiting for upload* state. Complete the rest of the process with the Application Loader utility.  

> **Note:** The Application Loader utility is available only for Mac OS X 10.5.3 or later. In Windows, you can run Mac OS X inside a virtual machine. Here's how you use it:

>* Unzip the app IPA file (change the extension to .zip).

>* Locate the APP file within the Payload folder and compress the APP file to create a new ZIP archive.

>* Use the Application Loader to upload the compressed APP file to iTunes Connect.

The Manage Your Apps page of iTunes Connect should now list an updated status for your application. See the [iTunes Connect Developer Guide](http://itunesconnect.apple.com/docs/iTunesConnect_DeveloperGuide.pdf), available from the iTunes Connect website, for information about the application statuses.
