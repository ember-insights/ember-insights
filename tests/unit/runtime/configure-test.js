import { it } from 'ember-mocha';
import runtime from 'ember-insights/runtime';


describe('Runtime', function() {

  var addon;
  beforeEach(function() {
    addon = { configs: [] };
  });


  describe('#configure/2', function() {

    describe('by default', function() {

      var settings;
      function assertSettings() {
        expect(settings).to.be.ok();
        expect(typeof settings.trackerFactory === 'function').to.be.ok();
        expect(typeof settings.tracker === 'object').to.be.ok();
        expect(settings.trackTransitionsAs).to.equal('pageview');
        expect(settings.updateDocumentLocationOnTransitions).to.equal(true);
        expect(settings.mappings.length).to.equal(0);
      }

      it('w/ out environment title', function() {
        runtime(addon).configure();

        settings = addon.configs['default'];
        assertSettings();
      });

      it('as a "test" environment', function() {
        runtime(addon).configure('test');

        settings = addon.configs['test'];
        assertSettings();
      });

    });

    describe('by settings', function() {

      var settings;
      beforeEach(function() {
        settings = { updateDocumentLocationOnTransitions: false };
      });

      function assertSettings() {
        expect(settings).to.be.ok();
        expect(settings.updateDocumentLocationOnTransitions).to.equal(false);
        expect(settings.mappings.length).to.equal(0);
      }

      it('w/ out environment title', function() {
        runtime(addon).configure(settings);

        settings = addon.configs['default'];
        assertSettings();
      });

      it('as a "test" environment', function() {
        runtime(addon).configure('test', settings);

        settings = addon.configs['test'];
        assertSettings();
      });

      it('with multiple environments', function() {
        var instance = runtime(addon);
        instance.configure('production', { debug: false });
        instance.configure('development');

        var production = addon.configs['production'];
        expect(production.debug).to.equal(false);

        var development = addon.configs['development'];
        expect(development.debug).to.equal(true);
      });

    });

  });


  describe('#configure/1', function() {

    describe('by settings', function() {

      function assert(settings) {
        expect(settings).to.be.ok();
        expect(typeof settings.trackerFactory === 'function').to.be.ok();
        expect(typeof settings.tracker === 'object').to.be.ok();
        expect(settings.trackTransitionsAs).to.equal('pageview');
        expect(settings.updateDocumentLocationOnTransitions).to.equal(true);
        expect(settings.mappings.length).to.equal(0);
      }

      it('with multiple environments', function() {
        runtime(addon).configure({
          production:  { debug: false },
          development: {}
        });

        var production = addon.configs['production'];
        assert(production);
        expect(production.debug).to.equal(false);

        var development = addon.configs['development'];
        assert(development);
        expect(development.debug).to.equal(true);
      });

    });

  });
});
