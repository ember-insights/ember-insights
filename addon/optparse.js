/* global Ember */
import DefaultTracker from './trackers/console';
import DefaultHandler from './handler';

export default {
  trackerOpts: function(opts) {
    return this.mergeTrackerOpts(opts, opts);
  },

  mergeTrackerOpts: function(opts, basicOpts) {
    var assert;

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
    var assert = (typeof opts.dispatch === 'function');
    Ember.assert("'dispatch' should be a function", assert);

    return opts;
  }
};
