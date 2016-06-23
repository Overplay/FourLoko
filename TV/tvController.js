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