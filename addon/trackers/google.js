/* global Ember */

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

export default {
  factory: function(settings) {

    var tracker   = trackerFun(settings.trackerFun);
    var namespace = trackingNamespace(settings.trackingNamespace);

    // Runtime conveniences as a wrapper for tracker function
    var wrapper = {
      _setFields: function() {
        setFields(tracker, namespace, settings.fields);
      },

      isTracker: function() {
        return (tracker && typeof tracker === 'function');
      },
      getTracker: function() {
        if (! this.isTracker()) {
          Ember.debug("Can't find in `window` a `" + settings.trackerFun + "` function definition");
        }
        return tracker;
      },

      set: function(key, value) {
        tracker(namespace('set'), key, value);
      },

      send: function(fieldNameObj) {
        fieldNameObj = fieldNameObj || {};
        tracker(namespace('send'), fieldNameObj);
      },
      sendEvent: function(category, action, label, value) {
        var fieldNameObj = {
          'hitType':       'event',  // Required
          'eventCategory': category, // Required
          'eventAction':   action    // Required
        };

        if (label != null) {
          fieldNameObj.eventLabel = label;
          if (value != null) {
            fieldNameObj.eventValue = value;
          }
        }

        tracker(namespace('send'), fieldNameObj);
      },
      trackPageView: function(path, fieldNameObj) {
        fieldNameObj = fieldNameObj || {};

        if (!path) {
          var loc = window.location;
          path = loc.hash ? loc.hash.substring(1) : (loc.pathname + loc.search);
        }

        tracker(namespace('send'), 'pageview', path, fieldNameObj);
      }
    };


    return wrapper;
  },

  trackerFun: trackerFun,
  trackingNamespace: trackingNamespace,
  setFields: setFields
};
