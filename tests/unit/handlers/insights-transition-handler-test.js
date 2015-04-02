import DefaultHandler from 'ember-insights/insights-handler';
import { it } from 'ember-mocha';


describe('Insights Handler in context of #transitionHandler', function() {
  var handler = DefaultHandler.transitionHandler;

  describe('#trackTransitionsAs', function() {

    it('as an "event"', function(done) {
      var settings = { trackTransitionsAs: 'event'};
      var data = {
        prevRouteName: 'outer.inner.nested', routeName: 'outer.inner.index',
      };
      var tracker = {
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

    it('as a "pageview"', function(done) {
      var settings = { trackTransitionsAs: 'pageview'};
      var data = {
        url: '/outer/inner'
      };
      var tracker = {
        trackPageView: function(url) {
          expect(url).to.equal('/outer/inner');
          done();
        }
      };

      handler(data, tracker, settings);
    });

  });

  describe('#trackTransitionsAs', function() {
    var sendEventCalled;
    var trackPageViewCalled;

    beforeEach(function(){
      sendEventCalled = false;
      trackPageViewCalled = false;
    });

    it('calls #sendEvent in case of "event"', function() {
      var settings = { trackTransitionsAs: 'event'};
      var tracker = {
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

    it('calls #trackPageView in case of "pageview"', function() {
      var settings = { trackTransitionsAs: 'pageview'};
      var tracker = {
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
