import DefaultHandler from 'ember-insights/handlers/insights';
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
        sendEvent: function(category, action, label) {
          expect(category).to.equal('transition');
          expect(action).to.equal('outer.inner.index');
          expect(label).to.equal('outer.inner.nested');
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
      expect(sendEventCalled).to.be.true();
      expect(trackPageViewCalled).to.be.false();
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
      expect(sendEventCalled).to.be.false();
      expect(trackPageViewCalled).to.be.true();
    });
  });
});
