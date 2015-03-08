/* global Ember */
import DefaultTracker from './trackers/console';
import DefaultHandler from './handler';
import DefaultTimingHandler from './handler-timing';

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
  },

  timingHandlerOpts: function(opts) {
    var assert;

    opts.timingHandler = (opts.timingHandler || DefaultTimingHandler.factory(opts));
    assert = (typeof opts.timingHandler === 'function');
    Ember.assert("'timingHandler' should be a function", assert);

    return opts;
  },

  buildTimingsConfig: function(opts, trackOpts) {
    if (!opts.timingsConfig) {
      opts.timingsConfig = {};
    }

    var timingsList;
    if (trackOpts) {
      timingsList = trackOpts.timings;
    }
    else {
      timingsList = opts.timings;
    }
    var timingHandler = (trackOpts && trackOpts.timingHandler) || opts.timingHandler || DefaultTimingHandler.factory(trackOpts || opts);
    var tracker       = (trackOpts && trackOpts.tracker      ) || opts.tracker;

    if (timingsList) {
      timingsList.forEach(function(chain) {
        var allPoints = [chain.start].concat(chain.points || []).concat([chain.end]);
        allPoints.forEach(function(point, idx, arr) {
          if (idx === 0) {
            return;
          }
          if (!opts.timingsConfig[point]) {
            opts.timingsConfig[point] = [];
          }
          var timingToPush = {
            timingHandler: timingHandler,
            tracker: tracker,
            prevPoints: arr.slice(0, idx).reverse()
          };
          if (chain.title) {
            timingToPush.chainTitle = chain.title;
          }
          opts.timingsConfig[point].push(timingToPush);
          if (idx === arr.length-1 && arr.length > 2) {
            var startEndTimingToPush = {
              timingHandler: timingHandler,
              tracker: tracker,
              prevPoints: [arr[0]]
            };
            if (chain.title) {
              startEndTimingToPush.chainTitle = chain.title;
            }
            opts.timingsConfig[point].push(startEndTimingToPush);
          }
        });
      });
    }

    return opts;
  }
};
