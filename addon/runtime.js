/* global Ember */
import optparse from './optparse';

export default function(addon) {
  var runtime = {
    configure: function(env, settings) {
      env      = (env || 'default');
      settings = (settings || {});

      // apply defaults
      optparse.mainOpts(settings);
      optparse.trackerOpts(settings);

      addon.configs[env]        = settings;
      addon.configs[env].groups = [];

      return this;
    },
    addGroup: function(env, cfg) {
      cfg.insights = Ember.Object.create(cfg.insights);
      addon.configs[env].groups.push(cfg);
    },
    removeGroup: function(env, name) {
      var groups = addon.configs[env].groups;

      for (var i=groups.length-1; i>=0; i--) {
        if (groups[i].name === name) {
          groups.splice(i, 1);
          return;
        }
      }
    },
    start: function(env) {
      addon.settings = addon.configs[env];
      Ember.assert("can't find settings for '" + env + "' environment", addon.settings);

      addon.isActivated = true;

      return addon.tracker;
    },
    stop: function() {
      addon.isActivated = false;
    }
  };

  return runtime;
}
