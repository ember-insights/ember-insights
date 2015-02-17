/* global Ember */

import Class from '../vendor/inheritance';

function notYetImplemented(signature) {
  Ember.Logger.error("You should override '" + signature + "' method in your tracker");
}

var AbstractTracker = Class.extend({
  init: function() {
  },

  isTracker: function() {
    notYetImplemented('isTracker()');
  },
  getTracker: function() {
    notYetImplemented('getTracker()');
  },
  set: function(key, value) { // jshint ignore:line
    notYetImplemented('set(key, value)');
  },
  send: function(fieldNameObj) { // jshint ignore:line
    notYetImplemented('send(fieldNameObj)');
  },
  sendEvent: function(category, action, label, value) { // jshint ignore:line
    notYetImplemented('sendEvent(category, action, label, value)');
  },
  trackPageView: function(path, fieldNameObj) { // jshint ignore:line
    notYetImplemented('trackPageView(path, fieldNameObj)');
  }
});

export { AbstractTracker };
