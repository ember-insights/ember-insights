/* global Ember */
import DefaultTracker from './trackers/console';
import DefaultHandler from './handler';

export default {
  defaultConfigureOpts: function(opts) {
    opts[0] = (opts[0] || 'default');
    if (typeof opts[0] === 'string') {
      opts[1] = (opts[1] || {});
    } else if(typeof opts[0] === 'object' && this.hasConfigureOpts(opts[0])) {
      opts[1] = opts[0];
      opts[0] = 'default';
    }
    return opts;
  },

  configureOpts: ['debug', 'trackerFactory', 'trackTransitionsAs', 'updateDocumentLocationOnTransitions'],

  hasConfigureOpts: function(opts) {
    let result = Ember.A(this.configureOpts).find( (e) => e in opts );
    return result;
  },

  defaultInsightsMapping: { insights: { ALL_TRANSITIONS: true, ALL_ACTIONS: true } },
  defaultTimingSettings:   { timing: { transitions: false } },

  defaultTrackOpts: function(opts = this.defaultInsightsMapping) {
    _assertInsightsMapping(opts);
    _assertTimingSettings(opts, this.defaultTimingSettings);
    return opts;
  },

  trackerOpts: function(opts) {
    return this.mergeTrackerOpts(opts, opts);
  },

  mergeTrackerOpts: function(opts, basicOpts) {
    let assert;

    opts.debug = (opts.debug === undefined ? true : opts.debug);

    opts.trackerFactory = (opts.trackerFactory || basicOpts.trackerFactory || DefaultTracker.factory);
    assert = (typeof opts.trackerFactory === 'function');
    Ember.assert("'trackerFactory' should be a function", assert);

    opts.tracker = opts.trackerFactory(opts);
    assert = (typeof opts.tracker === 'object');
    Ember.assert("Can't build tracker", assert);

    opts.trackTransitionsAs = (opts.trackTransitionsAs || basicOpts.trackTransitionsAs || 'pageview');

    return opts;
  },

  basicOpts: function(opts) {
    if (typeof opts.updateDocumentLocationOnTransitions === 'undefined') {
      opts.updateDocumentLocationOnTransitions = true;
    }

    return opts;
  },

  dispatcherOpts: function(opts) {
    opts.dispatch = (opts.dispatch || DefaultHandler.factory(opts));
    let assert = (typeof opts.dispatch === 'function');
    Ember.assert("'dispatch' should be a function", assert);
    opts.dispatch = DefaultHandler.proxy(opts.dispatch, opts);

    return opts;
  }
};


function _assertInsightsMapping(opts) {
  let assert = (typeof opts.insights === 'object');
  Ember.assert("Can't find `insights` property inside", assert);
}

function _assertTimingSettings(opts, defaultTimingSettings) {
  opts.timing = (opts.timing || defaultTimingSettings.timing);
  let assert = (typeof opts.timing === 'object');
  Ember.assert("Can't find a properly defined `timing` settings", assert);
}
