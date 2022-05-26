# Introduction 
This basic load testing tool is based on npm load testing module https://www.npmjs.com/package/loadtest. 
It enables testing specific pages of public websites under a specific load condition.

# Getting Started
In order to introduce a new project and test it using this tool:
1. Create a new branch in this repository based on 'master' branch.
2. In your new branch edit config.js file and add a specific pages that you would like to test. For config.js referenc see next section.
3. Create a new build definition in xxxx by cloning a "sample" definition.
4. In a new build definition go to "Get sources" step and update the "Default branch for manual and scheduled builds" field by selecting your newly created repository in step number 1.

# Setting up your config.js file
- siteHostName: hostname than your Sitcore site definition file use to resolve your wesbite on CD server
- protocol: protocol under which site operates (http or https)
- trafficManagerHostName: hostname pointing to your POD's UAT CD server
- requestsPerSecond: requests per second to be executed
- testDuration: test duration per page in seconds
- concurrency: the tool will create a certain number of clients; this parameter controls how many. Requests from them will arrive concurrently to the server.
Note: requests are not sent in parallel (from different processes), but concurrently (a second request may be sent before the first has been answered).
- tresholds: used to visualise in final report if results are poor, fair or good. It can be adjusted as per POD's need. 

# Executing tests
Notify platform team when and what project you would like to test. Next run a build dedicated to your project in agreed window. 
Once the test is done a HTML report will be available in build artifacts to download. Review as well CPU, DB utilisation via Azure portal and check Sitecore logs for memory consumption and any other anomalies..

# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 


docker pull mcr.microsoft.com/dotnet/framework/aspnet:4.8-windowsservercore-1909
