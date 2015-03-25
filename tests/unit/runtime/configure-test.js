import { it } from 'ember-mocha';
import runtime from 'ember-insights/runtime';


describe('Runtime #configure', function() {

  it('configures by default', function() {
    // case #1
    var addon = { configs: [] };
    runtime(addon).configure('');
    var settings = addon.configs['default'];
    expect(settings).to.be.ok();

    // case #2
    addon = { configs: [] };
    runtime(addon).configure('test');
    settings = addon.configs['test'];

    expect(settings).to.be.ok();
    expect(typeof settings.trackerFactory === 'function').to.be.ok();
    expect(typeof settings.tracker === 'object').to.be.ok();
    expect(settings.trackTransitionsAs).to.equal('pageview');
    expect(settings.updateDocumentLocationOnTransitions).to.equal(true);
    expect(settings.mappings.length).to.equal(0);
  });

  it('configures by params', function() {
    // case #1
    var addon    = { configs: [] };
    var settings = { updateDocumentLocationOnTransitions: false };
    runtime(addon).configure('test', settings);
    settings = addon.configs['test'];

    expect(settings).to.be.ok();
    expect(settings.updateDocumentLocationOnTransitions).to.equal(false);
    expect(settings.mappings.length).to.equal(0);
  });

  it('configures by object with multiple envs', function() {
    // case #1
    var addon    = { configs: [] };
    runtime(addon).configure({
      production:  { updateDocumentLocationOnTransitions: false },
      development: { updateDocumentLocationOnTransitions: true }
    });
    var configProd = addon.configs['production'];
    expect(configProd).to.be.ok();
    expect(configProd.updateDocumentLocationOnTransitions).to.equal(false);
    expect(configProd.mappings.length).to.equal(0);
    var configDev = addon.configs['development'];
    expect(configDev).to.be.ok();
    expect(configDev.updateDocumentLocationOnTransitions).to.equal(true);
    expect(configDev.mappings.length).to.equal(0);
  });

});
