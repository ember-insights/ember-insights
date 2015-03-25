import { it } from 'ember-mocha';
import runtime from 'ember-insights/runtime';


describe('Runtime #track', function() {

  it('sets tracking params by default', function() {
    var addon   = { configs: [] };
    var mapping = {
      insights: { ALL_TRANSITIONS:true, ALL_ACTIONS:true }
    };

    runtime(addon).configure('').track(mapping);

    var settings = addon.configs['default'];
    expect(settings).to.be.ok();
    expect(settings.mappings).to.be.ok();
    expect(typeof settings.mappings[0].trackerFactory === 'function').to.be.ok();
    expect(typeof settings.mappings[0].tracker === 'object').to.be.ok();
    expect(settings.mappings.length).to.equal(1);
    expect(settings.mappings[0].insights.get('ALL_TRANSITIONS')).to.be.ok();
    expect(settings.mappings[0].insights.get('ALL_ACTIONS')).to.be.ok();
  });

  it('configures custom environment and sets custom tracking params', function() {
    var addon    = { configs: [] };
    var settings = { };
    var mapping  = {
      insights: { ALL_TRANSITIONS:true, ALL_ACTIONS:true }
    };

    runtime(addon).configure('test', settings).track(mapping);

    settings = addon.configs['test'];
    expect(settings).to.be.ok();
    expect(settings.mappings).to.be.ok();
    expect(typeof settings.mappings[0].trackerFactory === 'function').to.be.ok();
    expect(typeof settings.mappings[0].tracker === 'object').to.be.ok();
    expect(settings.mappings.length).to.equal(1);
    expect(settings.mappings[0].insights.get('ALL_TRANSITIONS')).to.be.ok();
    expect(settings.mappings[0].insights.get('ALL_ACTIONS')).to.be.ok();
  });

  it('configures tracking params for multiple environments', function() {
    var addon    = { configs: [] };
    var settings = {
      prod: {},
      dev: { trackTransitionsAs: 'event' }
    };
    var mapping  = {
      insights: { ALL_TRANSITIONS:true, ALL_ACTIONS:true }
    };
    runtime(addon).configure(settings).track(mapping);

    var configProd = addon.configs['prod'];
    expect(configProd).to.be.ok();
    expect(configProd.mappings).to.be.ok();
    expect(typeof configProd.mappings[0].trackerFactory).to.equal('function');
    expect(typeof configProd.mappings[0].tracker).to.equal('object');
    expect(configProd.mappings.length).to.equal(1);
    expect(configProd.mappings[0].insights.get('ALL_TRANSITIONS')).to.be.ok();
    expect(configProd.mappings[0].insights.get('ALL_ACTIONS')).to.be.ok();
    expect(configProd.mappings[0].trackTransitionsAs).to.equal('pageview');

    var configDev = addon.configs['dev'];
    expect(configDev).to.be.ok();
    expect(configDev.mappings).to.be.ok();
    expect(typeof configDev.mappings[0].trackerFactory).to.equal('function');
    expect(typeof configDev.mappings[0].tracker).to.equal('object');
    expect(configDev.mappings.length).to.equal(1);
    expect(configDev.mappings[0].insights.get('ALL_TRANSITIONS')).to.be.ok();
    expect(configDev.mappings[0].insights.get('ALL_ACTIONS')).to.be.ok();
    expect(configDev.mappings[0].trackTransitionsAs).to.equal('event');
  });

});
