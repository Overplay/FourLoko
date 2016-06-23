/**
 * SystemController
 *
 * @description :: Server-side logic for managing the system
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  handler: function (req, res) {
    if (req.method == 'GET') {
      if (!req.params || !req.params.command) {
        return res.badRequest('missing command');
      }
      var cmd = req.params.command;
      console.log(cmd)
      if (cmd == 'apps') {
        OGApp.find().exec(function (err, apps) {
          if (err) {
            return res.negotiate(err);
          }
          return res.ok(apps);
        });
      }
      else if (cmd == 'device') {
        OGDevice.find().exec(function (err, device) {
          if (err) {
            return res.negotiate(err);
          }
          return res.ok(device);
        });
      }
      else {
        return res.badRequest("No such command");
      }
    }
    else if (req.method == 'POST' || req.method == 'PUT') {
      if (!req.params || !req.params.command) {
        return res.badRequest('missing command');
      }
      //todo might need to add a check for JWT but probably not

      var cmd = req.params.command;
      if(cmd == 'device'){
        OGDevice.findOne().exec(function (err, device) {
          if (err) {
            return res.negotiate(err);
          }

          for (var prop in req.body) {
            if (req.body.hasOwnProperty(prop) && device.hasOwnProperty(prop)) {
              device[prop] = req.body[prop];
            }
          }
          device.save(function (err, dev) {
            if (err) {
              return res.negotiate(err);
            }
            return res.ok(device);
          })
        });
      }
      else{
        return res.badRequest('no such command');
      }
    }
    else {
      return res.badRequest("Unacceptable Verb");
    }
  }
};

