/* global Ember */
import AbstractTracker from './abstract-tracker';

function logger(label, params) {
  var message = Ember.String.fmt('LOG: Ember-Insights: ConsoleTracker.%@(%@)', label, params);
  Ember.Logger.log(message);
}

export default {
  factory: function() {
    var Tracker = AbstractTracker.extend({
      getTracker: function() {
        return logger;
      },
      set: function(key, value) {
        logger('set', [key, value]);
      },
      send: function(fieldNameObj) {
        logger('send', [fieldNameObj]);
      },
      sendEvent: function(category, action, label, value) {
        logger('sendEvent', [category, action, label, value]);
      },
      trackPageView: function(path, fieldNameObj) {
        logger('trackPageView', ['pageview', path, fieldNameObj]);
      }
    });

    return new Tracker();
  }
};
