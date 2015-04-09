/* global Ember */
import optparse from './optparse';
import { ConsoleTracker, GoogleTracker } from './trackers';


export default function(addon) {
  let _settings = {}; // current configuration stage
  var runtime = {
    configure: function() {
      optparse.defaultConfigureOpts(arguments);
      if (typeof arguments[0] === 'string') {
        if (!(arguments[2] && arguments[2].append)) {
          _settings = {};
        }
        let env         = arguments[0];
        let settings    = arguments[1];
        _settings[env]  = settings;

        // apply defaults
        optparse.basicOpts(settings);
        optparse.trackerOpts(settings);

        settings.mappings  = [];
        addon.configs[env] = settings;
      } else if (typeof arguments[0] === 'object') {
        let envs = arguments[0];
        Object.keys(envs).forEach( (envName) => {
          this.configure(envName, envs[envName], { append: true });
        });
      }
      return this;
    },
    track: function(mapping) {
      mapping = optparse.defaultTrackOpts(mapping);

      Object.keys(_settings).forEach( (settingsName) => {
        let newMapping = Ember.$.extend(true, {}, mapping);
        newMapping.insights = Ember.Object.create(newMapping.insights);

        let setting = _settings[settingsName];
        // apply defaults
        optparse.mergeTrackerOpts(newMapping, setting);
        optparse.dispatcherOpts(newMapping);
        // setup tracking mapping
        setting.mappings.push(newMapping);
      });

      return this;
    },
    start: function(env = 'default') {
      addon.settings = addon.configs[env];
      Ember.assert("can't find settings for '" + env + "' environment", addon.settings);
      Ember.assert("can't start without specified mappings", addon.settings.mappings.length > 0);

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
