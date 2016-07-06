/**
 * Created by ethan on 6/14/16.
 */

var gui = require('nw.gui');
var win = gui.Window.get();

app.controller('tvController', function($scope, $http, $sce, $interval){
    $scope.widgetIframeInfo = {
        ready: false,
        url: '',
        slot: 0
    };

    $scope.crawlerIframeInfo = {
        ready: false,
        url: '',
        slot: 0
    };

    //polling loop to check if application moved (this is only for moves being sent outside of the main controller
    // (these will move things automatically with magic))
    var intervalReady = true;
    $interval(function(){
        if(intervalReady) {
            intervalReady = false;
            $http({
                method: 'GET',
                url: 'http://localhost:1337/api/system/apps'
            }).then(function (response) {
                response.data.forEach(function(obj){
                    if('../SymLinked/www/opp/' + obj.appId + '/app/tv/index.html' == $scope.crawlerIframeInfo.url){
                        $scope.crawlerIframeInfo.slot = obj.slotNumber
                    }
                    if('../SymLinked/www/opp/' + obj.appId + '/app/tv/index.html' == $scope.widgetIframeInfo.url){
                        $scope.widgetIframeInfo.slot = obj.slotNumber;
                    }
                })
                intervalReady = true;
            }, function (err) {
                console.warn(err);
                intervalReady = true;
            });
        }
        else {
            console.log('didn\'t successfully poll becuase last poll hadn\'t finished.' +
                'If you are seeing this alo then interval time probably needs to be lengthened');
        }
    }, 1000);

    win.window.addEventListener('message', function(event){
        var urlOfApp = $sce.trustAsResourceUrl('../SymLinked/www/opp/' + event.data.appId + '/app/tv/index.html');
        console.log(event.data);
        if(event.data.appType == 'crawler') {
            if(event.data.running) {
                $scope.crawlerIframeInfo.url = urlOfApp;
                $scope.crawlerIframeInfo.ready = true;
                $scope.crawlerIframeInfo.slot = event.data.slotNumber;
            }else{
                $scope.crawlerIframeInfo.url = undefined;
                $scope.crawlerIframeInfo.ready = false;
                $scope.crawlerIframeInfo.slot = undefined;
            }
            $scope.$apply();
        }
        else if(event.data.appType == 'widget') {
            if(event.data.running) {
                $scope.widgetIframeInfo.url = urlOfApp;
                $scope.widgetIframeInfo.ready = true;
                $scope.widgetIframeInfo.slot = event.data.slotNumber;
            }else {
                $scope.widgetIframeInfo.url = undefined;
                $scope.widgetIframeInfo.ready = false;
                $scope.widgetIframeInfo.slot = undefined;
            }
            $scope.$apply();
        }
    });

    $scope.apps = [];

    $http({
        method: 'GET',
        url: 'http://localhost:1337/api/system/apps'
    }).then(function(response){
        $scope.apps = response.data;
    }, function(err){
        alert(err);
    });
});