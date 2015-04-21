import Ember from 'ember';
import { it } from 'ember-mocha';
import { GoogleTracker }  from 'ember-insights/trackers';


describe('Google Tracker', ()=> {

  describe('Configuration', ()=> {

    let assertTrackerByDefault = (tracker, name) => {
      expect(tracker.ga).to.be.ok();
      expect(tracker.name('')).to.be.equal(name);
    };

    describe('.factory/0', ()=> {

      it('creates by default', ()=> {
        let t = GoogleTracker.factory;
        assertTrackerByDefault(t(), '');
      });

    });

    describe('.with', ()=> {

      it('creates by default', ()=> {
        let t = GoogleTracker.with();
        assertTrackerByDefault(t(), '');
      });

      it('creates by params', ()=> {
        let params = { name:'newTracker' };
        let t = GoogleTracker.with(params);
        assertTrackerByDefault(t(), 'newTracker');
      });

    });
  });

  describe('Custom tracking object name', ()=> {

    it('with namespace', ()=> {
      let command = GoogleTracker.trackingNamespace('namespace')('send');
      expect(command).to.equal('namespace.send');

      command = GoogleTracker.trackingNamespace('namespace')();
      expect(command).to.equal('namespace');
    });

    it('with out namespace', ()=> {
      let command = GoogleTracker.trackingNamespace()('set');
      expect(command).to.equal('set');

      command = GoogleTracker.trackingNamespace('')('set');
      expect(command).to.equal('set');
    });
  });

  describe('Custom tracking object', ()=> {
    it('as a string', ()=> {
      let actual = GoogleTracker.trackerFun('global', { global: true });
      expect(actual).to.be.ok();
    });

    it('as a function', ()=> {
      let expected = function() {};
      let actual   = GoogleTracker.trackerFun(expected);
      expect(actual).to.equal(expected);
    });
  });


  it.skip('sets application fields', function(done) {
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

  it.skip('uses custom `trackerFun` and `name`', function(done) {
    var bckp = window['gaNew'];
    window['gaNew'] = function (cdm, params) {
      expect(cdm).to.equal('nmspc.send');
      expect(params).to.equal('a');
      window['gaNew'] = bckp;
      done();
    };
    var factory = GoogleTracker.with({
      trackerFun: 'gaNew',
      name: 'nmspc'
    });
    var tracker = factory();
    tracker.send('a');
  });

  it.skip('sets GA fields on init', function(done) {
    var bckp = window['gaNew'];
    window['gaNew'] = function (cdm, key, val) {
      expect(cdm).to.equal('nmspc.set');
      expect(key).to.equal('appName');
      expect(val).to.equal('app name');
      window['gaNew'] = bckp;
      done();
    };
    var factory = GoogleTracker.with({
      trackerFun: 'gaNew',
      name: 'nmspc',
      fields: { appName: 'app name' }
    });
    var tracker = factory();
  });

});
