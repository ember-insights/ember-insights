import AbstractTracker from './abstract-tracker';

function trackerFun(trackerFun, global) {
  global = (global || window);
  if (typeof trackerFun === 'string') {
    trackerFun = global[trackerFun];
  }
  return trackerFun;
}

function trackingNamespace(name) {
  return function(action) {
    return (name ? name + '.' : '') + action;
  };
}

function setFields(tracker, namespace, fields) {
  for (var propName in fields) {
    tracker(namespace('set'), propName, fields[propName]);
  }
}

function _buildFactory(trackerOptions) {
  trackerOptions = trackerOptions || {};

  return function(settings) { // jshint ignore:line
    function tracker() { return trackerFun(trackerOptions.trackerFun || 'ga'); }
    var namespace = trackingNamespace(trackerOptions.name || '');

    // Runtime conveniences as a wrapper for tracker function
    var Tracker = AbstractTracker.extend({
      init: function() {
        if (trackerOptions.fields) {
          setFields(tracker(), namespace, trackerOptions.fields);
        }
      },
      isTracker: function() {
        return (tracker() && typeof tracker() === 'function');
      },
      getTracker: function() {
        return tracker();
      },
      set: function(key, value) {
        tracker()(namespace('set'), key, value);
      },
      send: function(fields) {
        fields = fields || {};
        tracker()(namespace('send'), fields);
      },
      sendEvent: function(category, action, label, value) {
        var fields = {
          hitType:      'event',
          eventCategory: category,
          eventAction:   action,
          eventLabel:    label,
          eventValue:    value
        };
        this.send(fields);
      },
      trackPageView: function(path, fields) {
        fields = fields || {};
        if (!path) {
          var loc = window.location;
          path = loc.hash ? loc.hash.substring(1) : (loc.pathname + loc.search);
        }
        tracker()(namespace('send'), 'pageview', path, fields);
      }
    });

    return new Tracker();
  };
}

export default {
  factory: _buildFactory(),

  with: function(trackerOptions) {
    return _buildFactory(trackerOptions);
  },

  trackerFun: trackerFun,
  trackingNamespace: trackingNamespace,
  setFields: setFields
};
