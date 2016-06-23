/**
 * AppCommandController
 *
 * @description :: Server-side logic for directing commands to OGApps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var NUM_WIDGET_SLOTS = 4;
var NUM_CRAWLER_SLOTS = 2;

module.exports = {
    moveHandler: function (req, res) {
        if (!req.params || !req.params.appid) {
            return res.badRequest('make sure that the request includes appid');
        }

        var appid = req.params.appid;
        OGApp.findOne({appId: appid}).exec(function (err, app) {
            if (err) {
                return res.negotiate(err);
            }
            else {
                if (!app.running) {
                    return res.badRequest('app currently not running, so it can\'t be moved');
                }

                if (app.appType == 'crawler') {
                    app.slotNumber = (app.slotNumber + 1) % NUM_CRAWLER_SLOTS;
                }
                else if (app.appType == 'widget') {
                    app.slotNumber = (app.slotNumber + 1) % NUM_WIDGET_SLOTS;
                }
                //todo, add actual functionality

                app.save(function (err, saved) {
                    if (err) {
                        return res.negotiate(err);
                    }
                    return res.ok(app);
                })
            }
        })
    },
    launchHandler: function (req, res) {
        console.log('attempting to launch app');
        if (!req.params || !req.params.appid) {
            return res.badRequest('make sure that the request includes appid');
        }
        var appid = req.params.appid;

        OGApp.findOne({appId: appid}).exec(function (err, app) {
            if (err) {
                return res.negotiate(err);
            }
            else {
                if (app.running) {
                    return res.ok(app);
                }

                OGApp.find().exec(function (err, apps) {
                    if (err) {
                        return res.negotiate(err);
                    }

                    var slotNum = undefined;
                    var done = false;
                    for (var i = 0; i < apps.length; i++) {
                        var a = apps[i];
                        //if there is already an app of this type running, then take its slot and kill it
                        if (a.running && a.appType == app.appType) {
                            slotNum = a.slotNumber;
                            a.running = false;
                            var done = a;
                        }
                    }
                    if (done) {
                        done.save(function (err, killed) {
                            if (err) {
                                return res.negotiate(err);
                            }
                            app.running = true;
                            app.slotNumber = slotNum;
                            app.save(function (err, running) {
                                if (err) {
                                    return res.negotiate(err);
                                }
                                return res.ok(app);
                            })
                        })
                    }
                    else {
                        //there was not an app of the same type running
                        app.running = true;
                        app.save(function (err, saved) {
                            if (err) {
                                return res.negotiate(err);
                            }
                            res.ok(app);
                        })
                    }
                });
            }
        })
    },
    killHandler: function (req, res) {
        console.log("attempting to kill app");
        if (!req.params || !req.params.appid) {
            return res.badRequest('make sure that the request includes appid');
        }

        var appid = req.params.appid;

        OGApp.findOne({appId: appid}).exec(function (err, app) {
            if(err){
                return res.negotiate(err);
            }
            else {
                app.running = false;
                app.save(function(err, saved){
                    if(err) {
                        return res.negotiate(err);
                    }
                    return res.ok(app);
                })
            }
        });
    }
};

