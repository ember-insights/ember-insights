/* global Ember */
import AbstractTracker from './abstract-tracker';

function trackerFun(trackerFun, global = window) {
  if (typeof trackerFun === 'string') {
    trackerFun = global[trackerFun];
  }
  return trackerFun;
}

function trackingNamespace(name) {
  return (action) => action ? ((name ? (name + '.') : '') + action) : name;
}

function setFields(ga, namespace, fields) {
  Ember.deprecate('Settings custom application `fields` goes to be removed from next MINOR release.');
  for (var propName in fields) {
    ga(namespace('set'), propName, fields[propName]);
  }
}

class GoogleTracker extends AbstractTracker {
  constructor(trackerOptions = {}) {
    super();
    this.ga       = () => trackerFun(trackerOptions.trackerFun || 'ga');
    this.name     = trackingNamespace(trackerOptions.name || '');

    if (trackerOptions.fields) {
      setFields(this.ga(), this.name, trackerOptions.fields);
    }
  }

  set(key, value) {
    this.ga()(this.name('set'), key, value);
  }

  send(fields = {}) {
    this.ga()(this.name('send'), fields);
  }

  sendEvent(category, action, label, value) {
    let fields = {
      hitType:      'event',
      eventCategory: category,
      eventAction:   action,
      eventLabel:    label,
      eventValue:    value
    };

    this.send(fields);
  }

  trackPageView(path, fields) {
    fields = fields || {};
    if (!path) {
      let loc = window.location;
      path = loc.hash ? loc.hash.substring(1) : (loc.pathname + loc.search);
    }
    this.ga()(this.name('send'), 'pageview', path, fields);
  }
}

function _buildFactory(trackerOptions) {
  return (/* settings */) => new GoogleTracker(trackerOptions);
}

export default {
  factory: _buildFactory(),
  with: (trackerOptions) => _buildFactory(trackerOptions),

  trackerFun:        trackerFun,
  trackingNamespace: trackingNamespace,
  setFields:         setFields
};
