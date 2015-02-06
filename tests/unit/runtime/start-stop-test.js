import { it } from 'ember-mocha';
import runtime from 'ember-insights/runtime';


describe('Engine Start/Stop', function() {

  it('try to start', function() {
    function attempt() {
      var addon = { configs: [] };
      runtime(addon).configure().start();
    }
    expect(attempt).to.throw(Error);
  });

  it('start behavior', function() {
    var addon = { configs: [] };
    runtime(addon).configure('test').start('test');
    expect(addon.isActivated).to.be.ok();
  });

  it('stop behavior', function() {
    var addon = { configs: [] };
    runtime(addon).configure('test').stop();
    expect(addon.isActivated).to.not.be.ok();
  });

});
