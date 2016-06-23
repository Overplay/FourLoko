# FourLoko

Amstel Bright simulator written in NodeWebkit and Sails.js

The purpose of this project is to emulate the behavior of the Ourglass Android Amstel Bright server and UI for application development purposes.

### Steps to begin developing applications

1. Read the README inside of `AmstelBrightSimulator` for information about the server
    * The simulator's server runs at `localhost:1337`
    * The main endpoints that an application will use are `GET /api/appdata/:appid` (to retrieve current stored information associated with the application) and `POST /api/appdata/:appid` (to set the stored information associated with the application)
    * NOTE: the server does not poll this information, however, inside of the sails server, when new information is posted about an application, the information is passed to the TV window, which updates the TV
2. Set up directory structure
    * All Ourglass JS applications exist under `SymLinked/www`. There is a README in that folder. Check it before you wreck it.
    * When node webkit is run, a script grabs all directory names under `SymLinked/www/opp` and creates default appdata for them (if they don't already exist)
        * Make sure your application contains a `Apps/<appname>/info/info.json` file, the node script will read `appType` and `reverseDomainName` from this file when creating the database entries (pattern your file off of one of the existing info.json files
    * Inside of the application's folder, there needs to be an `app` folder which contains `control` and `tv` folders. These folders should each contain an `index.html` file and everything that file needs.
        * These folders will control their respective view (tv or control)
3. On Ubuntu run the project with `./run` in FourLoko root. You need to have nw.js installed.
    * To run your application, in the controller, click the launch button next to your application's name
    * NOTE: the paths are a little bit weird with all of the iframes, check the developer console (F12) if nothing happens
4. On Mac, install nw.js first then:
    * 
    
### Issues
* The simulator is only meant to be run with one controller (on actual device, there can be multiple controllers)
* Since the controller is not polling, the information about the applications may be incorrect
    * Only example I currently know of is:
    1) launch crawler 
    2) launch second crawler which implicitly kills the first crawler but the controller still thinks that both are running (however, the TV is always correct)
    