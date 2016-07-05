var home;
var ref;
function goHome(){
    home('controller');
    ref();
}

app.controller('controllerController', function ($scope, $http, $rootScope, $interval, $timeout, $sce) {
    var BASE_URL = 'http://localhost:1337/api/app/';

    $scope.apps = [];

    //once initial data is successfully gotten, this will be lengthened
    var interval = 2000;

    function getApps() {
        $http({
            method: 'GET',
            url: 'http://localhost:1337/api/system/apps'
        }).then(function (response) {
            $scope.apps = response.data;
            interval = 10000;
        }, function (err) {
            console.error(err);
        })
    }

    $interval(getApps, interval);

    $scope.sendCommand = function (appid, command) {
        $http.post(BASE_URL + appid + '/' + command)
            .then(function (response) {
                var index;
                if(response.data.running){
                    if((index = $scope.runningApps.indexOf(response.data.appId)) == -1) {
                        $scope.runningApps.push(response.data.appId);
                    }
                }
                else if((index = $scope.runningApps.indexOf(response.data.appId)) != -1){
                    $scope.runningApps.splice(index, 1);
                }
                $scope.apps.forEach(function(app){
                    if(response.data.running && app.appId != response.data.appId && app.appType == response.data.appType){
                        if((index = $scope.runningApps.indexOf(app.appId)) != -1){
                            $scope.runningApps.splice(index, 1);
                            app.running = false;
                        }
                    }
                    if(app.appId == response.data.appId){
                        app.running = response.data.running;
                    }
                })
                sendData(response.data);
            }, function (err) {
                console.warn(err);
                alert(err);
            })
    }

    $scope.setView = function(appid){
        if(appid == 'controller'){
            $scope.viewUrl = undefined;
        }
        else {
            var url = '../SymLinked/www/opp/' + appid + '/app/control/index.html';
            $scope.viewUrl = url;//$sce.trustAsHtml(url);
        }
    };

    home = $scope.setView;
    ref = $scope.$apply;
    $scope.runningApps = []
});