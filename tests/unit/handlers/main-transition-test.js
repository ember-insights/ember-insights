import handlers from 'ember-insights/handlers';


module('Main handler for matched transitions');
var handler = handlers.main.transitionHandler;

test('Transition as event', function() {
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
  var trackAs = 'both',
      tracker = {
        sendEvent:     function() { ok(true,     'sendEvent called'); },
        trackPageView: function() { ok(true, 'trackPageView called'); }
      };

  handler({}, tracker, { trackTransitionsAs: trackAs });
});
