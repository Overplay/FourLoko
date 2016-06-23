/**
 * OGDevice.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    name: {
      type: 'string'
    },

    locationWithinVenue: {
      type: 'string'
    },

    wifiMacAddress: {
      type: 'string',
      required: true
    },

    settings: {
      type: 'json'
    },

    //probably won't need this for the simulator
    /*apiToken: {
      type: 'string'
    },*/

    uuid: {
      type: 'string',
      required: true,
      primaryKey: true,
      unique: true
    }
  }
};

