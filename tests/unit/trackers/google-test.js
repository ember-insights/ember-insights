import Ember from 'ember';
import { it } from 'ember-mocha';
import { GoogleTracker }  from 'ember-insights/trackers';


describe('Google Tracker', function() {

  it('sets tracking namespace', function() {
    var command = GoogleTracker.trackingNamespace('namespace')('send');
    expect(command).to.equal('namespace.send');
  });

  it('does not set tracking namespace', function() {
    var command = GoogleTracker.trackingNamespace()('set');
    expect(command).to.equal('set');

    command = GoogleTracker.trackingNamespace('')('set');
    expect(command).to.equal('set');
  });

  it('gets tracking function', function() {
    var actual = GoogleTracker.trackerFun('global', { global: true });
    expect(actual).to.be.ok();
  });

  it('gets custom tracking function', function() {
    var expected = function() {};
    var actual   = GoogleTracker.trackerFun(expected);
    expect(actual).to.equal(expected);
  });

  it('sets application fields', function(done) {
    var countCalled = 0;
    var _tracker = function(nmspace, propName, propVal) {
      expect(nmspace).to.equal('namespace');
      var expression = (propName === 'appName' && propVal === 'appName') || (propName === 'screenResolution' && propVal === 'screenResolution');
      expect(expression).to.be.ok();
      countCalled++;
      if (countCalled === 2) { done(); }
    };
    var _namespace = function(commandName) {
      expect(commandName).to.equal('set');
      return 'namespace';
    };
    var fields = { appName: 'appName', screenResolution: 'screenResolution' };

    GoogleTracker.setFields(_tracker, _namespace, fields);
  });

});
