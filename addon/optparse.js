/* global Ember */
import tracker from './tracker';

export default {
  trackerOpts: function(opts) {
    var assert, typeOf;

    opts.trackerFun = (opts.trackerFun || 'ga');
    typeOf = typeof opts.trackerFun;
    assert = (typeOf === 'function' || typeOf === 'string');
    Ember.assert("'trackerFun' should be either a function or string option", assert);

    opts.trackerFactory = (opts.trackerFactory || tracker.build);
    assert = (typeof opts.trackerFactory === 'function');
    Ember.assert("'trackerFactory' should be a function", assert);

    opts.tracker = opts.trackerFactory(opts);
    assert = (typeof opts.tracker === 'object');
    Ember.assert("Can't build tracker", assert);

    opts.trackTransitionsAs = (opts.trackTransitionsAs || 'pageview');

    return opts;
  },

  mainOpts: function(opts) {
    if (typeof opts.updateDocumentLocationOnTransitions === 'undefined')
      opts.updateDocumentLocationOnTransitions = true;

    return opts;
  }
};
