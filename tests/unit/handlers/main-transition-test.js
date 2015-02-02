import DefaultHandler from 'ember-insights/handler';


module('Main handler for matched transitions');
var handler = DefaultHandler.transitionHandler;

test('Transition as event', function() {
  expect(3);
  var settings = { trackTransitionsAs: 'event'},
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

  handler(data, tracker, settings);
});

test('Transition as pageview', function() {
  expect(1);
  var settings = { trackTransitionsAs: 'pageview'},
      data = { url: '/outer/inner' },
      tracker = {
        trackPageView: function(url) {
          equal(url, '/outer/inner', 'trackPageView received correct url');
        }
      };

  handler(data, tracker, settings);
});

test('Transition only as event', function() {
  expect(1);
  var settings = { trackTransitionsAs: 'event'},
      tracker = {
        sendEvent: function() {
          ok(true, 'sendEvent called');
        },
        trackPageView: function() {
          ok(false, 'trackPageView method should not be called at all');
        }
      };

  handler({}, tracker, settings);
});

test('Transition only as pageview', function() {
  expect(1);
  var settings = { trackTransitionsAs: 'pageview'},
      tracker = {
        sendEvent: function() {
          ok(false, 'sendEvent method should not be called at all');
        },
        trackPageView: function() {
          ok(true, 'trackPageView called');
        }
      };

  handler({}, tracker, settings);
});

test('Transition both as pageview and as event', function() {
  expect(2);
  var settings = { trackTransitionsAs: 'both'},
      tracker = {
        sendEvent:     function() { ok(true,     'sendEvent called'); },
        trackPageView: function() { ok(true, 'trackPageView called'); }
      };

  handler({}, tracker, settings);
});
