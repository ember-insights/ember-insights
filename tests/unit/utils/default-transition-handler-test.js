import Ember    from 'ember';
import { test } from 'ember-qunit';

import Utils from 'ember-insights/lib/utils';

var handler = Utils.defaultTransitionHandler;

module('Default handler for matched transitions');

test('Transition as event', function() {
  expect(3);

  var trackAs = 'event',
      data = {
        oldRouteName: 'outer.inner.nested',
        routeName: 'outer.inner.index',
      },
      tracker = {
        sendEvent: function(type, json) {
          var parsed = JSON.parse(json);
          equal(type, 'ember_transition', 'sendEvent received correct type');
          equal(parsed.from, 'outer.inner.nested', 'sendEvent received correct from route');
          equal(parsed.to,   'outer.inner.index' , 'sendEvent received correct to route');
        }
      };

  handler(data, tracker, { trackTransitionsAs: trackAs });
});

test('Transition as pageview', function() {
  expect(1);

  var trackAs = 'pageview',
      data = { url: '/outer/inner' },
      tracker = {
        trackPageView: function(url) {
          equal(url, '/outer/inner', 'trackPageView received correct url');
        }
      };

  handler(data, tracker, { trackTransitionsAs: trackAs });
});

test('Transition only as event', function() {
  expect(1);

  var trackAs = 'event',
      tracker = {
        sendEvent: function() {
          ok(true, 'sendEvent called');
        },
        trackPageView: function() {
          ok(false, 'trackPageView method should not be called at all');
        }
      };

  handler({}, tracker, { trackTransitionsAs: trackAs });
});

test('Transition only as pageview', function() {
  expect(1);

  var trackAs = 'pageview',
      tracker = {
        sendEvent: function() {
          ok(false, 'sendEvent method should not be called at all');
        },
        trackPageView: function() {
          ok(true, 'trackPageView called');
        }
      };

  handler({}, tracker, { trackTransitionsAs: trackAs });
});

test('Transition both as pageview and as event', function() {
  expect(2);

  var trackAs = 'both',
      tracker = {
        sendEvent:     function() { ok(true,     'sendEvent called'); },
        trackPageView: function() { ok(true, 'trackPageView called'); }
      };

  handler({}, tracker, { trackTransitionsAs: trackAs });
});
