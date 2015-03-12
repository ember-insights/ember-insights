/* global Ember */

import Class from '../vendor/inheritance';

function notYetImplemented(signature) {
  Ember.warn("function '" + signature + "' is not yet implemented");
}

var AbstractTracker = Class.extend({
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
  },
  applyAppFields: function() {
    notYetImplemented('applyAppFields()');
  }
});

export default AbstractTracker;
