/**
 * OGAppController
 *
 * @description :: Server-side logic for managing Ogapps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  handler: function(req, res){
    if(req.method == 'GET'){
      //console.log('attempted to get /api/appdata/:appid');
      if(!req.params || !req.params.appid){
        return res.badRequest();
      }
      var appid = req.params.appid;
      OGApp.find({appId: appid}).exec(function(err, apps){
        if(err){
          return res.negotiate(err);
        }
        if(!apps.length){
          return res.ok({});
        }
        return res.ok(apps[0].publicData);
      })
    }
    else if(req.method == 'POST' || req.method == 'PUT'){
      console.log('attempted to post /api/appdata/:appid');
      if(!req.params || !req.params.appid || !req.body){
        console.log('what the fuck');
        return req.badRequest();
      }
      var appid = req.params.appid;
        console.log(appid);
      OGApp.findOne({appId: appid}).exec(function(err, app){
        if(err){
          return res.negotiate(err);
        }
        if(app){
          app.publicData = req.body;
          app.save(function(err, updated){
            return err ? res.negotiate(err) : res.ok(req.body);
          });
        }
          else {
            res.badRequest('Application: ' + appid + '' +
                ' not found');
        }
      })
    }
    else {
      return res.badRequest();
    }
  },

  create: function(req,res){
    console.log(req.body);
    OGApp.findOrCreate({appId: req.body.appId}, req.body).exec(function(err, created){
      if(err){
        return res.negotiate(err);
      }
      return res.ok(created);
    })
  }
};

