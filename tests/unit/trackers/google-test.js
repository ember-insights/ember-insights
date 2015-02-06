import Ember from 'ember';
import { it } from 'ember-mocha';
import { GoogleTracker }  from 'ember-insights/trackers';


describe('Tracker', function() {

  it('tracking namespace', function() {
    var command = GoogleTracker.trackingNamespace('namespace')('send');
    expect(command).to.equal('namespace.send');
  });

  it('w/ out predefined namespace', function() {
    var command = GoogleTracker.trackingNamespace()('set');
    expect(command).to.equal('set');

    command = GoogleTracker.trackingNamespace('')('set');
    expect(command).to.equal('set');
  });

  it('tracker function as a global property', function() {
    var actual = GoogleTracker.trackerFun('global', { global: true });
    expect(actual).to.be.ok();
  });

  it('tracker function as a custom function', function() {
    var expected = function() {};
    var actual   = GoogleTracker.trackerFun(expected);
    expect(actual).to.equal(expected);
  });

  it('setFields function', function(done) {
    var countCalled = 0;
    var _tracker = function(nmspace, propName, propVal) {
      expect(nmspace).to.equal('forTracker');
      expect(
        (propName === 'appName'          && propVal === 'My Appp !') ||
        (propName === 'screenResolution' && propVal === '999x600'  )
      ).to.be.ok();
      countCalled++;
      if (countCalled === 2) { done(); }
    };
    var _namespace = function(commandName) {
      expect(commandName).to.equal('set');
      return 'forTracker';
    };
    var fields = {
      appName: 'My Appp !',
      screenResolution: '999x600'
    };

    GoogleTracker.setFields(_tracker, _namespace, fields);
  });

});
