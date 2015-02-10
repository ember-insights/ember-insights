import DefaultHandler from 'ember-insights/handler';
import { it } from 'ember-mocha';


describe('Main handler for matched transitions',function(){
  var handler = DefaultHandler.transitionHandler;

  it('tests Transition as event', function(done) {
    var settings = { trackTransitionsAs: 'event'},
        data = {
          oldRouteName: 'outer.inner.nested',
          routeName: 'outer.inner.index',
        },
        tracker = {
          sendEvent: function(type, json) {
            var parsed = JSON.parse(json);
            expect(type).to.equal('ember_transition');
            expect(parsed.from).to.equal('outer.inner.nested');
            expect(parsed.to).to.equal('outer.inner.index');
            done();
          }
        };
    handler(data, tracker, settings);
  });

  it('tests Transition as pageview', function(done) {
    var settings = { trackTransitionsAs: 'pageview'},
        data = { url: '/outer/inner' },
        tracker = {
          trackPageView: function(url) {
            expect(url).to.equal('/outer/inner');
            done();
          }
        };

    handler(data, tracker, settings);
  });

  describe('Transitions handling functions called right by tracking type',function(){
    var sendEventCalled;
    var trackPageViewCalled;

    beforeEach(function(){
      sendEventCalled = false;
      trackPageViewCalled = false;
    });

    it('Transition only as event calls only sendEvent', function() {
      var settings = { trackTransitionsAs: 'event'},
          tracker = {
            sendEvent: function() {
              sendEventCalled = true;
            },
            trackPageView: function() {
              trackPageViewCalled = true;
            }
          };
      handler({}, tracker, settings);
      expect(sendEventCalled).to.be.ok();
      expect(trackPageViewCalled).not.to.be.ok();
    });

    it('Transition only as pageview calls only trackPageView', function() {
      var settings = { trackTransitionsAs: 'pageview'},
          tracker = {
            sendEvent: function() {
              sendEventCalled = true;
            },
            trackPageView: function() {
              trackPageViewCalled = true;
            }
          };
      handler({}, tracker, settings);
      expect(sendEventCalled).not.to.be.ok();
      expect(trackPageViewCalled).to.be.ok();
    });

    it('Transition both as pageview and as event calls both functions', function() {
      var settings = { trackTransitionsAs: 'both'},
          tracker = {
            sendEvent:     function() { sendEventCalled = true; },
            trackPageView: function() { trackPageViewCalled = true; }
          };
      handler({}, tracker, settings);
      expect(sendEventCalled).to.be.ok();
      expect(trackPageViewCalled).to.be.ok();
    });
  });
});
