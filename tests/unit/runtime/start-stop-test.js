import { it } from 'ember-mocha';
import runtime from 'ember-insights/runtime';


describe('Engine Start/Stop', function() {

  it('tries to start', function() {
    function attempt() {
      var addon = { configs: [] };
      runtime(addon).configure().start();
    }
    expect(attempt).to.throw(Error);
  });

  it('starts runtime', function() {
    var addon = { configs: [] };
    runtime(addon).configure('test').start('test');
    expect(addon.isActivated).to.be.ok();
  });

  it('stops runtime', function() {
    var addon = { configs: [] };
    runtime(addon).configure('test').stop();
    expect(addon.isActivated).to.not.be.ok();
  });

});
