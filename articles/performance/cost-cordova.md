<properties
   pageTitle="Title goes here"
   description="Title goes here"
   services="na"
   documentationCenter=""
   authors="normesta"
   tags=""/>
<tags
   ms.service="na"
   ms.devlang="javascript"
   ms.topic="article"
   ms.tgt_pltfrm="mobile-multiple"
   ms.workload="na"
   ms.date="09/10/2015"
   ms.author="normesta"/>

# The question

If you are considering using Cordova for your cross-platform strategy, your CIO will walk into your office very soon with this question: “Aren’t web apps slow? I heard that Facebook tried this and gave up. They couldn’t figure it out and we don’t have the resources that Facebook has, is Cordova something we should even consider?” You pause for a moment…

Understanding the costs imposed by the nature of Cordova will help you as you evaluate the platform and plan ahead as you develop for it. There are some main areas that deserve special attention: startup and resume overhead due to the interpreted nature of the web languages, memory overhead from hosting an entire browser in your app, serialization overhead when sending data to and from native code, and the general performance concerns that come with web applications.

> **Note**: For most of the results described below, a Nexus 7, iPad Mini 3, and Lumia 928 were used as the target devices.

# <a id="startup"></a>The startup cost

The first impression you get to make is when a user launches your app for the first time. Are they pulled right into the app or is there a long loading period? Launching a Cordova app feels almost like setting off a Rube Goldberg machine: you’re launching a native app that hosts a webview that points to an HTML file that initializes your application and pulls in all your JavaScript and HTML templates. Unsurprisingly, this can take a moment.

We don’t know the complexity of your app but we experimented with launch times for a “Hello World” app that updated some text on page when the “deviceready” event fires. For the timings in the table below, we used a camera to measure from when the touch was visually registered until we could see the text update. Additionally, we define “cold” as launching the app immediately following a reboot (when assets should be completely cleared from RAM) and “warm” as launching the app right after we close it (when maybe the OS hasn’t really cleaned everything up yet).

<style>
    table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
    }
    th, td {
        padding: 5px;
    }
</style>
<table>
<tbody><tr>
  <th>
    <p>**Platform**</p>
  </th>
  <th>
    <p>**Cordova Cold**</p>
  </th>
  <th>
    <p>**Native Cold**</p>
  </th>
  <th>
    <p>**Cordova Warm**</p>
  </th>
  <th>
    <p>**Native Warm**</p>
  </th>
</tr>
 <tr>
   <td>**Android 4.4**</td><td>3425 ms</td><td>557 ms</td>
   <td>3358 ms</td><td>454 ms</td>
 </tr>
 <tr>
   <td>**iOS 8**</td><td>3142 ms</td><td>5825 ms</td>
   <td>1921 ms</td><td>2000 ms</td>
 </tr>
 <tr>
   <td>**WP 8.0**</td><td>2433 ms</td><td>1667 ms</td>
   <td>1083 ms</td><td>1098 ms</td>
 </tr>
</table>

If you’re struggling with this, see what you can defer or cut to minimize your time to paint. Are you requesting all your resources on launch or can some be deferred to load on demand? Does the UI library you are using include components you aren’t using?

# <a id="resume"></a>The resume cost

Like startup, resuming your app isn’t instant either. If your app needs to do anything to respond to the “resume” event, you’ll want to keep an eye on this. We tested this with a “Hello World” app that additionally changed background color when the “resume” event fired, then measured with a camera the time from tap on the app switching screen being visually registered until the background color was updated. We don’t have comparisons for native but it seemed like times we saw were based more on the animation the OS played to smoothly bring the app full screen than necessarily taking a while to wake the app up.

<table>
<tbody><tr>
  <th>
    <p>**Platform**</p>
  </th>
  <th>
    <p>**Time**</p>
  </th>
  </tr>
 <tr>
   <td>**Android 4.4**</td><td>450 ms</td>
 </tr>
 <tr>
   <td>**iOS 8**</td><td>58.3 ms</td>
 </tr>
 <tr>
   <td>**WP 8.0**</td><td>595.8 ms</td>
 </tr>
</table>

If you’re struggling with this, see what code is running when you resume your app and if you can move that activity to another place.

# <a id="memory"></a>The memory cost

You shouldn’t be surprised to find out that Cordova apps have a higher memory footprint than their native counterparts. Hosting essentially a browser inside your app is not cheap. This can be significant on low-end phones. Android and iOS don't have hard numbers for allowable memory consumption, with each device and platform providing different usage allowances and those allowances change based on how much memory the device has and how much is in use at the time. Windows Phone has some hard limits, ranging from 150MB to 825MB.

For a benchmark though, here is the memory usage we recorded for "Hello World" apps across the three platforms. For the browser, we navigated to about:blank.

<table>
<tbody><tr>
  <th>
    <p>**Platform**</p>
  </th>
  <th>
    <p>**Native**</p>
  </th>
  <th>
    <p>**Browser**</p>
  </th>
  <th>
    <p>**Cordova**</p>
  </th>
</tr>
 <tr>
   <td>**Android**</td><td>26 MB</td><td>14 MB</td>
   <td>59 MB</td>
 </tr>
 <tr>
   <td>**iOS**</td><td>7 MB</td><td>20 MB</td>
   <td>18 MB</td>
 </tr>
 <tr>
   <td>**WP**</td><td>30 MB</td><td>23 MB</td>
   <td>36 MB</td>
 </tr>
</table>

While we don't have an app for comparing a full-featured app implemented both natively and with Cordova across all three platforms, we thought comparing a native app across the platforms was a data point worth keeping in mind. Note in the table below, Android ran higher and iOS ran lower. I launched the Facebook app, loaded the news feed, my profile page, and recorded the memory usage.

<table>
<tbody><tr>
  <th>
    <p>**Platform**</p>
  </th>
  <th>
    <p>**Something**</p>
  </th>
</tr>
 <tr>
   <td>**Android 4.4**</td><td>101.4 MB</td>
 </tr>
 <tr>
   <td>**iOS 8**</td><td>75.10 MB</td>
 </tr>
 <tr>
   <td>**WP 8.1**</td><td>90.42 MB</td>
 </tr>
</table>

If you’re struggling with this, see if your app is allocating large DOM trees or keeping extra copies of data in memory. Try virtualizing things that normally require large DOM trees, such as lists or tables, and make sure you are letting go of data you don’t need so the garbage collector can dispose of it.

# <a id="communication"></a>The communication cost

Due to the architecture of Cordova, a thin native shim hosting a webview, moving application state from JavaScript to the native side and back requires expensive serialization and deserialization. You may be reading and writing files, getting photos from the camera, or getting the results of computationally expensive calculations performed in native code. The good news is that our testing indicated this time is linear related to the size of the data being transferred. The table below shows the times we recorded sending an array of numbers across the barrier and back.

<table>
<tbody><tr>
  <th>
    <p>**Items**</p>
  </th>
  <th>
    <p>**1**</p>
  </th>
  <th>
    <p>**2,000**</p>
  </th>
  <th>
    <p>**20,000**</p>
  </th>
  <th>
    <p>**200,000**</p>
  </th>
</tr>
 <tr>
   <td>**Android 4.4**</td><td>4 ms</td><td>22 ms</td>
   <td>157 ms</td><td>1121 ms</td>
 </tr>
 <tr>
   <td>**iOS 8.0**</td><td>3 ms</td><td>45 ms</td>
   <td>135 ms</td><td>1120 ms</td>
 </tr>
 <tr>
   <td>**WP 8.1**</td><td>1 ms</td><td>27 ms</td>
   <td>139 ms</td><td>877 ms</td>
 </tr>
</table>

If you’re struggling with this, make sure you know what is being sent back and forth and try to figure out how to reduce it. Look for duplicate data or maybe even experiment with different data formats to see if one serializes faster than others.

# <a id="web"></a>The web cost

Although last here, perhaps the most important is the cost that comes from building with web technologies. This is a cost that your team may have already paid if you have experience building applications for the modern web. If you’re new to frontend web technologies, the learning curve appears deceptively low. This is not a magic bullet: just like any other tech stack, building a performant application requires planning and knowledge of the pitfalls. If you’re struggling with this, we have a blog post [TODO: LINK] that covers some of the bigger gotchas that you should watch for.

# <a id="answer"></a>The answer

You’ve finally crafted a response for your CIO: “There are a number of issues that can make Cordova slower but we know what these are and we’ve planned for them. Our users shouldn’t notice the difference.”
One of the key attractors to Cordova is that you use web technology to build cross-platform apps. If your team has a strong web background or has an existing web app, leveraging that experience and those assets while tracking the costs listed here should enable you to bring a quality app to your customers.
