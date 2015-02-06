import { it } from 'ember-mocha';
import runtime from 'ember-insights/runtime';


describe('Tracking configuration', function() {

  it('basic insights', function() {
    var addon   = { configs: [] };
    var mapping = {
      insights: { ALL_TRANSITIONS:true, ALL_ACTIONS:true }
    };
    runtime(addon).configure().track(mapping);

    var settings = addon.configs['default'];
    expect(settings).to.be.ok();
    expect(settings.mappings).to.be.ok();
    expect(mapping.trackerFun).to.equal('ga');
    expect(settings.trackingNamespace).to.equal('');
    expect(typeof mapping.trackerFactory === 'function').to.be.ok();
    expect(typeof mapping.tracker === 'object').to.be.ok();
    expect(settings.mappings.length).to.equal(1);
    expect(mapping.insights.get('ALL_TRANSITIONS')).to.be.ok();
    expect(mapping.insights.get('ALL_ACTIONS')).to.be.ok();
  });

  it('custom tracking options', function() {
    var addon   = { configs: [] };
    var mapping = {
      trackerFun: 'trackerFun',
      trackingNamespace: 'trackingNamespace',
      insights: { ALL_TRANSITIONS:true, ALL_ACTIONS:true }
    };
    runtime(addon).configure().track(mapping);

    var settings = addon.configs['default'];
    expect(settings).to.be.ok();
    expect(settings.mappings).to.be.ok();
    expect(mapping.trackerFun).to.equal('trackerFun');
    expect(mapping.trackingNamespace).to.equal('trackingNamespace');
    expect(typeof mapping.trackerFactory === 'function').to.be.ok();
    expect(typeof mapping.tracker === 'object').to.be.ok();
    expect(settings.mappings.length).to.equal(1);
    expect(mapping.insights.get('ALL_TRANSITIONS')).to.be.ok();
    expect(mapping.insights.get('ALL_ACTIONS')).to.be.ok();
  });

  it('main tracking options', function() {
    var addon    = { configs: [] };
    var settings = {
      trackerFun: 'trackerFun', trackingNamespace: 'trackingNamespace'
    };
    var mapping = {
      insights: { ALL_TRANSITIONS:true, ALL_ACTIONS:true }
    };
    runtime(addon).configure('test', settings).track(mapping);

    settings = addon.configs['test'];
    expect(settings).to.be.ok();
    expect(settings.mappings).to.be.ok();
    expect(mapping.trackerFun).to.equal('trackerFun');
    expect(mapping.trackingNamespace).to.equal('trackingNamespace');
    expect(typeof mapping.trackerFactory === 'function').to.be.ok();
    expect(typeof mapping.tracker === 'object').to.be.ok();
    expect(settings.mappings.length).to.equal(1);
    expect(mapping.insights.get('ALL_TRANSITIONS')).to.be.ok();
    expect(mapping.insights.get('ALL_ACTIONS')).to.be.ok();
  });

});
