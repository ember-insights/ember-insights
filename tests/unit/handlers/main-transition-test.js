import DefaultHandler from 'ember-insights/handler';
import { it } from 'ember-mocha';


describe('Main handler for matched transitions',function(){
  var handler = DefaultHandler.transitionHandler;

  it('tests Transition as "event"', function(done) {
    var settings = { trackTransitionsAs: 'event'},
        data = {
          oldRouteName: 'outer.inner.nested',
          routeName: 'outer.inner.index',
        },
        tracker = {
          sendEvent: function(type, json) {
            var parsed = JSON.parse(json);
            expect(type).to.equal('transition');
            expect(parsed.from).to.equal('outer.inner.nested');
            expect(parsed.to).to.equal('outer.inner.index');
            done();
          }
        };
    handler(data, tracker, settings);
  });

  it('tests Transition as "pageview"', function(done) {
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

  describe('trackTransitionsAs',function(){
    var sendEventCalled;
    var trackPageViewCalled;

    beforeEach(function(){
      sendEventCalled = false;
      trackPageViewCalled = false;
    });

    it('calls sendEvent for "event" option', function() {
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

    it('calls trackPageView for "pageview" option', function() {
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
  });
});
