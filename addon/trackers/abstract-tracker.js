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
  send: function(fields) { // jshint ignore:line
    notYetImplemented('send(fields)');
  },
  sendEvent: function(category, action, label, value) { // jshint ignore:line
    notYetImplemented('sendEvent(category, action, label, value)');
  },
  trackPageView: function(path, fields) { // jshint ignore:line
    notYetImplemented('trackPageView(path, fields)');
  },
  applyAppFields: function() {
    notYetImplemented('applyAppFields()');
  }
});

export default AbstractTracker;
