/* global Ember */
import DefaultTracker from './tracker';

export default {
  trackerOpts: function(opts) {
    return this.mergeTrackerOpts(opts, opts);
  },

  mergeTrackerOpts: function(opts, basicOpts) {
    var assert, typeOf;

    opts.trackerFun = (opts.trackerFun || basicOpts.trackerFun || 'ga');
    typeOf = typeof opts.trackerFun;
    assert = (typeOf === 'function' || typeOf === 'string');
    Ember.assert("'trackerFun' should be either a function or string option", assert);

    opts.trackingNamespace = (opts.trackingNamespace || basicOpts.trackingNamespace || '');
    typeOf = typeof opts.trackingNamespace;
    assert = (typeOf === 'string');
    Ember.assert("'trackingNamespace' should be a string option", assert);

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
    if (typeof opts.updateDocumentLocationOnTransitions === 'undefined')
      opts.updateDocumentLocationOnTransitions = true;

    return opts;
  }
};
