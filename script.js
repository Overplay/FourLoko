var cp = require('child_process');
var tvWindow;

var sails_proc = cp.fork('AmstelBrightSimulator/app.js');

process.on('exit', function(data){
    console.log('about to die, killing the sails process');
    sails_proc.kill('SIGKILL');
})

sails_proc.on('message', function(m){
   console.log("SAILS PROCESS: " + m);
    resume();
});

function resume() {
    var fs = require('fs');
    var http = require('http');
    var querystring = require('querystring');

    //this is the main nwjs script
    var gui = require('nw.gui');

    //get the information for the applications
    var apps = fs.readdirSync('SymLinked/www/opp');
    var appInfoObjects = [];
    apps.forEach(function (app) {
        if ( fs.lstatSync( 'SymLinked/www/opp/'+app ).isDirectory()) {
            try {
                var fileCont = fs.readFileSync('SymLinked/www/opp/' + app + '/info/info.json', {encoding: 'UTF-8'});
                var fileInfoObj = JSON.parse(fileCont);
                if (fileInfoObj) appInfoObjects.push(fileInfoObj);
            } catch (e) {
                console.error("ingnoring entry: " + app + " \n" + e);
            }
        }
    });

    // Toss off the GUI
    gui.Window.open('TV/index.html', function (newWin) {
        tvWindow = newWin;
        tvWindow.height = 720;
        tvWindow.width = 1080;
        tvWindow.setResizable(false);
    });
    
    //spawn the sails server

    //load the application info into the sails database
    appInfoObjects.forEach(function (info) {
        var objToPost = {
            "appId": info.reverseDomainName,
            "appType": info.appType,
            "slotNumber": 0,
            "height": 0,
            "yPos": 0,
            "xPos": 0,
            "onLauncher": true,
            "width": 0,
            "running": false
        }
        var post_data = querystring.stringify(objToPost);
        var post_options = {
            host: 'localhost',
            port: '1337',
            path: '/api/OGApp',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };

        var post_request = http.request(post_options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                //console.log(chunk);
            })
        })

        post_request.write(post_data);
        post_request.end();
    });
}
function sendData(data){
    tvWindow.window.postMessage(data, '*');
}
