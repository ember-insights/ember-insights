/* global Ember */

import Utils from './lib/utils';

export default {
  build: function(addon) {

    var tracker = function() {
      return window[addon.settings.gaGlobalFuncName];
    };

    var trackerPrefixedCommand = function(action) {
      return Utils.trackerPrefixedCommand(action, {
        trackerName: addon.settings.gaTrackerName
      });
    };

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
        (tracker())(trackerPrefixedCommand('set'), 'location', document.URL);
      },

      send: function(fieldNameObj) {
        fieldNameObj = fieldNameObj || {};
        (tracker())(trackerPrefixedCommand('send'), fieldNameObj);
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

        (tracker())(trackerPrefixedCommand('send'), fieldNameObj);
      },
      trackPageView: function(path, fieldNameObj) {
        fieldNameObj = fieldNameObj || {};

        if (!path) {
          var loc = window.location;
          path = loc.hash ? loc.hash.substring(1) : (loc.pathname + loc.search);
        }

        (tracker())(trackerPrefixedCommand('send'), 'pageview', path, fieldNameObj);
      }
    };


    return wrapper;
  }
};
