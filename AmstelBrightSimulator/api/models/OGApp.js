/**
 * OGApp.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    appId: {
      type: 'string',
      required: true,
      primaryKey: true,
      unique: true
    },

    appType: {
      type: 'string',
      required: true
    },

    /* removed temporarily because despite being tagged as required, didn't see any usages
    screenName: {
      type: 'string',
      required: true
    },*/

    running: {
      type: 'boolean'
    },

    onLauncher: {
      type: 'boolean'
    },

    slotNumber: {
      type: 'integer'
    },

    xPos: {
      type: 'integer'
    },

    yPos: {
      type: 'integer'
    },

    height: {
      type: 'integer'
    },

    width: {
      type: 'integer'
    },

    publicData: {
      type: 'json',
      defaultsTo: {}
    },

    privateData: {
      type: 'json'
    }
  }
};

