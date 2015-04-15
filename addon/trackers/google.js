import AbstractTracker from './abstract-tracker';

function trackerFun(trackerFun, global = window) {
  if (typeof trackerFun === 'string') {
    trackerFun = global[trackerFun];
  }
  return trackerFun;
}

function trackingNamespace(name) {
  return (action) => (name ? name + '.' : '') + action;
}

function setFields(tracker, namespace, fields) {
  for (var propName in fields) {
    tracker(namespace('set'), propName, fields[propName]);
  }
}

class GoogleTracker extends AbstractTracker {
  constructor(trackerOptions = {}) {
    super();
    this.tracker  = () => trackerFun(trackerOptions.trackerFun || 'ga');
    this.name     = trackingNamespace(trackerOptions.name || '');

    if (trackerOptions.fields) {
      setFields(this.tracker(), this.name, trackerOptions.fields);
    }
  }

  set(key, value) {
    this.tracker()(this.name('set'), key, value);
  }

  send(fields = {}) {
    this.tracker()(this.name('send'), fields);
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
    this.tracker()(this.name('send'), 'pageview', path, fields);
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
