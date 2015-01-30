/* global Ember */

function trackerFun() {
  return function(){
    console.log('Ember-Insights event');
    console.log('\tAction: ', arguments[0]);
    console.log('\tAction argument: ', arguments[1]);
    if(arguments.length > 2){
      console.log('\tAdditional arguments: ');
      for(var i=2; i < arguments.length; i++){
         console.log('\t\t', arguments[i]);
      }
    }
  };
}

function trackingNamespace(name) {
  return function(action) {
    return (name ? name + '.' : '') + action;
  };
}


export default {
  factory: function(settings) {

    var tracker   = trackerFun(settings.trackerFun);
    var namespace = trackingNamespace(settings.trackingNamespace);

    // Runtime conveniences as a wrapper for tracker function
    var wrapper = {
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
        tracker(namespace('set'), 'location', document.URL);
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
  trackingNamespace: trackingNamespace
};
