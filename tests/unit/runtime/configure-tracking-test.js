import { it } from 'ember-mocha';
import runtime from 'ember-insights/runtime';


describe('Runtime #track', function() {

  let addon;
  beforeEach( ()=> {
    addon = { configs: [] };
  });

  it('requires "insights"', ()=> {
    let attempt = ()=> {
      runtime(addon).configure().track({});
    };
    expect(attempt).to.throw(Error, "Can't find `insights` property inside");
  });

  it('requires properly defined "timing" settings', ()=> {
    let attempt = ()=> {
      runtime(addon).configure().track({insights: {}, timing: true});
    };
    expect(attempt).to.throw(Error, "Can't find a properly defined `timing` settings");
  });

  function assert(settings) {
    expect(settings).to.be.ok();
    expect(settings.mappings).to.be.ok();
    expect(typeof settings.mappings[0].trackerFactory).to.equal('function');
    expect(typeof settings.mappings[0].tracker).to.equal('object');
    expect(settings.mappings.length).to.equal(1);
    expect(settings.mappings[0].insights.get('ALL_TRANSITIONS')).to.be.ok();
    expect(settings.mappings[0].insights.get('ALL_ACTIONS')).to.be.ok();
    expect(settings.mappings[0].timing.transitions).to.be.false();
  }

  describe('in context of #configure/2', function() {

    let mapping = { insights: { ALL_TRANSITIONS: true, ALL_ACTIONS: true } };

    it('w/ out environment title', function() {
      runtime(addon).configure().track(mapping);
      assert(addon.configs['default']);
    });

    it('as a "test" environment', function() {
      runtime(addon).configure('test').track(mapping);
      assert(addon.configs['test']);
    });

    it('with multiple environments', function() {
      let instance = runtime(addon);
      instance.configure('production').track({
        insights: { ALL_TRANSITIONS: true, ALL_ACTIONS: true }
      });
      instance.configure('development').track({
        insights: { ALL_TRANSITIONS: false, ALL_ACTIONS: false }
      });

      let production = addon.configs['production'];
      expect(production.mappings[0].insights.get('ALL_TRANSITIONS')).to.be.ok();
      expect(production.mappings[0].insights.get('ALL_ACTIONS')).to.be.ok();

      let development = addon.configs['development'];
      expect(development.mappings[0].insights.get('ALL_TRANSITIONS')).not.to.be.ok();
      expect(development.mappings[0].insights.get('ALL_ACTIONS')).not.to.be.ok();
    });

    describe('by default', function() {

      it('as a "test" environment', function() {
        runtime(addon).configure('test').track();
        assert(addon.configs['test']);
      });

      it('w/ out environment title', function() {
        runtime(addon).configure().track();
        assert(addon.configs['default']);
      });

    });
  });

  describe('in context of #configure/1', function() {
    let settings = { production:  {}, development: { trackTransitionsAs: 'event' } };
    let mapping = { insights: { ALL_TRANSITIONS: true, ALL_ACTIONS: true } };

    function assertEnvironments() {
      let production = addon.configs['production'];
      assert(production);
      expect(production.mappings[0].trackTransitionsAs).to.equal('pageview');

      let development = addon.configs['development'];
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
