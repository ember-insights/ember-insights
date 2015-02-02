/* global Ember */
import optparse from './optparse';
import { ConsoleTracker, GoogleTracker } from './trackers';


export default function(addon) {
  var _settings; // current configuration stage
  var runtime = {
    configure: function(env, settings) {
      env       = (env || 'default');
      settings  = (settings || {});
      _settings = settings;

      // apply defaults
      optparse.basicOpts(settings);
      optparse.trackerOpts(settings);

      settings.tracker._setFields();

      settings.mappings  = [];
      addon.configs[env] = settings;

      return this;
    },
    track: function(mapping) {
      Ember.assert("Can't find `insights` property inside", mapping.insights);
      // fields object is not allowed in track,
      //   for more visit https://github.com/roundscope/ember-insights/issues/56
      delete mapping.fields;
      mapping.insights = Ember.Object.create(mapping.insights);
      // apply defaults
      optparse.mergeTrackerOpts(mapping, _settings);
      optparse.handlerOpts(mapping);
      // setup tracking mapping
      _settings.mappings.push(mapping);

      return this;
    },
    start: function(env) {
      addon.settings = addon.configs[env];
      Ember.assert("can't find settings for '" + env + "' environment", addon.settings);

      addon.isActivated = true;

      return addon.settings.tracker;
    },
    stop: function() {
      addon.isActivated = false;
    },

    // Custom trackers
    ConsoleTracker: ConsoleTracker,
    GoogleTracker:  GoogleTracker

  };

  return runtime;
}
