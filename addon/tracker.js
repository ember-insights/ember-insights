/* global Ember */


export default {
  build: function(addon) {

    var tracker           = this.tracker(addon.settings.gaGlobalFuncName);
    var trackingNamespace = this.trackerPrefixedCommand(addon.settings.gaTrackerName);

    // Runtime conveniences as a wrapper for tracker function
    var wrapper = {
      isTracker: function() {
        return (tracker() && typeof tracker() === 'function');
      },
      getTracker: function() {
        if (! this.isTracker()) {
          Ember.debug("Can't find in `window` a `" + addon.settings.gaGlobalFuncName + "` function definition");
        }
        return tracker();
      },

      set: function(key, value) {
        (tracker())(trackingNamespace('set'), 'location', document.URL);
      },

      send: function(fieldNameObj) {
        fieldNameObj = fieldNameObj || {};
        (tracker())(trackingNamespace('send'), fieldNameObj);
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

        (tracker())(trackingNamespace('send'), fieldNameObj);
      },
      trackPageView: function(path, fieldNameObj) {
        fieldNameObj = fieldNameObj || {};

        if (!path) {
          var loc = window.location;
          path = loc.hash ? loc.hash.substring(1) : (loc.pathname + loc.search);
        }

        (tracker())(trackingNamespace('send'), 'pageview', path, fieldNameObj);
      }
    };


    return wrapper;
  },


  tracker: function(gaGlobalFuncName) {
    return window[gaGlobalFuncName];
  },

  trackerPrefixedCommand: function(trackerName) {
    return function(action) {
      return (trackerName ? trackerName + '.' : '') + action;
    };
  }
};
