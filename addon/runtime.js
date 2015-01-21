/* global Ember */
import optparse from './optparse';

export default function(addon) {
  var env, settings; // current configuration stage
  var runtime = {
    configure: function(env, settings) {
      env      = (env || 'default');
      settings = (settings || {});

      // apply defaults
      optparse.basicOpts(settings);
      optparse.trackerOpts(settings);

      settings.mappings  = [];
      addon.configs[env] = settings;

      return this;
    },
    track: function(mapping) {
      Ember.assert("Can't find `insights` property inside", mapping.insights);
      mapping.insights = Ember.Object.create(mapping.insights);
      // apply defaults
      optparse.mergeTrackerOpts(mapping, settings);
      // setup tracking mapping
      settings.mappings.push(mapping);

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
    }
  };

  return runtime;
}
