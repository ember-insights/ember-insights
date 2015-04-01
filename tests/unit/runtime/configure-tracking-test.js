import { it } from 'ember-mocha';
import runtime from 'ember-insights/runtime';


describe('Runtime #track', function() {

  var addon;
  beforeEach(function() {
    addon = { configs: [] };
  });

  it('requires "insights"', function() {
    var attempt = function() {
      runtime(addon).configure().track({});
    };
    expect(attempt).to.throw(Error, "Can't find `insights` property inside");
  });

  describe('in context of #configure/2', function() {

    var mapping = { insights: { ALL_TRANSITIONS: true, ALL_ACTIONS: true } };
    var settings;
    function assertSettings() {
      expect(settings).to.be.ok();
      expect(settings.mappings).to.be.ok();
      expect(typeof settings.mappings[0].trackerFactory === 'function').to.be.ok();
      expect(typeof settings.mappings[0].tracker === 'object').to.be.ok();
      expect(settings.mappings.length).to.equal(1);
      expect(settings.mappings[0].insights.get('ALL_TRANSITIONS')).to.be.ok();
      expect(settings.mappings[0].insights.get('ALL_ACTIONS')).to.be.ok();
    }

    it('w/ out environment title', function() {
      runtime(addon).configure().track(mapping);

      settings = addon.configs['default'];
      assertSettings();
    });

    it('as a "test" environment', function() {
      runtime(addon).configure('test').track(mapping);

      settings = addon.configs['test'];
      assertSettings();
    });

    it('with multiple environments', function() {
      var instance = runtime(addon);
      instance.configure('production').track({
        insights: { ALL_TRANSITIONS: true, ALL_ACTIONS: true }
      });
      instance.configure('development').track({
        insights: { ALL_TRANSITIONS: false, ALL_ACTIONS: false }
      });

      var production = addon.configs['production'];
      expect(production.mappings[0].insights.get('ALL_TRANSITIONS')).to.be.ok();
      expect(production.mappings[0].insights.get('ALL_ACTIONS')).to.be.ok();

      var development = addon.configs['development'];
      expect(development.mappings[0].insights.get('ALL_TRANSITIONS')).not.to.be.ok();
      expect(development.mappings[0].insights.get('ALL_ACTIONS')).not.to.be.ok();
    });

    describe('by default', function() {

      it('as a "test" environment', function() {
        runtime(addon).configure('test').track();

        settings = addon.configs['test'];
        assertSettings();
      });

      it('w/ out environment title', function() {
        runtime(addon).configure().track();

        settings = addon.configs['default'];
        assertSettings();
      });

    });

  });

  describe('in context of #configure/1', function() {
    var settings = { production:  {}, development: { trackTransitionsAs: 'event' } };
    var mapping = { insights: { ALL_TRANSITIONS: true, ALL_ACTIONS: true } };

    function assert(settings) {
      expect(settings).to.be.ok();
      expect(settings.mappings).to.be.ok();
      expect(typeof settings.mappings[0].trackerFactory).to.equal('function');
      expect(typeof settings.mappings[0].tracker).to.equal('object');
      expect(settings.mappings.length).to.equal(1);
      expect(settings.mappings[0].insights.get('ALL_TRANSITIONS')).to.be.ok();
      expect(settings.mappings[0].insights.get('ALL_ACTIONS')).to.be.ok();
    }

    function assertEnvironments() {
      var production = addon.configs['production'];
      assert(production);
      expect(production.mappings[0].trackTransitionsAs).to.equal('pageview');

      var development = addon.configs['development'];
      assert(development);
      expect(development.mappings[0].trackTransitionsAs).to.equal('event');
    }

    it('with multiple environments', function() {
      runtime(addon).configure(settings).track(mapping);
      assertEnvironments();
    });

    describe('by default', function() {

      it('with multiple environments', function() {
        runtime(addon).configure(settings).track();
        assertEnvironments();
      });

    });

  });
});
