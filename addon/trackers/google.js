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


class GoogleTracker extends AbstractTracker {
  constructor(trackerObject, propertyId, trackerOptions) {
    super();

    if(typeof trackerObject === 'undefined') { trackerObject = {}; }

    if(typeof trackerObject === 'object') {
      trackerOptions = trackerObject;
      this.ga        = () => trackerFun(trackerOptions.trackerFun || 'ga');
      this.name      = trackingNamespace(trackerOptions.name || '');
    }

    if(typeof trackerObject === 'string') {
      this.ga        = () => trackerFun(trackerObject);
      this.name      = trackingNamespace(trackerOptions.name || '');
      this.ga()('create', propertyId, trackerOptions);
    }
  }

  set(key, value) {
    this.ga()(this.name('set'), key, value);
  }

  send(fields = {}) {
    this.ga()(this.name('send'), fields);
  }

  sendEvent(category, action, ...tail) {
    let fields = ((typeof tail[0] === 'object') ? tail[0] : (tail[2] ? tail[2] : {}));
    fields.hitType       = 'event';
    fields.eventCategory = category;
    fields.eventAction   = action;
    fields.eventLabel    = tail[0];
    fields.eventValue    = tail[1];

    this.send(fields);
  }

  sendTiming(category, variable, value, ...tail) {
    let fields = ((typeof tail[1] === 'object') ? tail[1] : {});
    fields.hitType        = 'timing';
    fields.timingCategory = category;
    fields.timingVar      = variable;
    fields.timingValue    = value;
    fields.timingLabel    = tail[0];

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

function _buildFactory(trackerObject, propertyId, trackerOptions) {
  return (/* settings */) => new GoogleTracker(trackerObject, propertyId, trackerOptions);
}

export default {
  factory: _buildFactory(),
  with: function(trackerObject, propertyId, trackerOptions) { return _buildFactory(trackerObject, propertyId, trackerOptions); },

  trackerFun:        trackerFun,
  trackingNamespace: trackingNamespace,
};
