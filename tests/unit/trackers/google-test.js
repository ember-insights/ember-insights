import Ember from 'ember';
import { it } from 'ember-mocha';
import { GoogleTracker }  from 'ember-insights/trackers';


describe('Google Tracker', ()=> {

  describe('Configuration', ()=> {

    let assertTrackerByDefault = (tracker, name) => {
      expect(tracker.ga).to.be.ok();
      expect(tracker.name('')).to.be.equal(name);
    };

    describe('through .factory/0', ()=> {

      it('creates by default', ()=> {
        let t = GoogleTracker.factory;
        assertTrackerByDefault(t(), '');
      });

    });

    describe('through .with', ()=> {

      it('creates by default', ()=> {
        let t = GoogleTracker.with();
        assertTrackerByDefault(t(), '');
      });

      it('creates by params', ()=> {
        let t = GoogleTracker.with({ name: 'newTracker' });
        assertTrackerByDefault(t(), 'newTracker');
      });

      it('creates by params w/ undefined `trackerFun`', ()=> {
        let t = GoogleTracker.with({ name: 'newTracker', trackerFun: undefined });
        assertTrackerByDefault(t(), 'newTracker');
      });

      describe('by creating tracker object', ()=> {

        let createMock = (expectedProperyId, expectedParams, done) => {
          return (command, propertyId, params) => {
            expect(command).to.be.equal('create');
            expect(propertyId).to.be.equal(expectedProperyId);
            expect(params).to.be.equal(expectedParams);
            done();
          };
        };

        it('creates by default', (done)=> {
          window['ga'] = createMock('UA-XXXX-Y', 'auto', done);
          let t = GoogleTracker.with('ga', 'UA-XXXX-Y', 'auto');
          assertTrackerByDefault(t(), '');
        });

        it('creates by params', (done)=> {
          let params = { name: 'newTracker' };
          window['ga'] = createMock('UA-XXXX-Y', params, done);
          let t = GoogleTracker.with('ga', 'UA-XXXX-Y', params);
          assertTrackerByDefault(t(), 'newTracker');
        });

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

  describe('API', ()=> {

    let t, trackerFun, assert;

    describe('#sendEvent', ()=> {

      beforeEach( ()=> {
        trackerFun = (command, fields) => {
          expect(command).to.be.equal('send');
          expect(fields.hitType).to.be.equal('event');
          expect(fields.eventCategory).to.be.equal('category');
          expect(fields.eventAction).to.be.equal('action');
          if(assert) assert(fields);
        };
        t = GoogleTracker.with({trackerFun: trackerFun})();
      });

      it('specifies event by required params', ()=> {
        assert = (fields) => {
          expect(fields.eventLabel).not.to.be.ok();
          expect(fields.eventValue).not.to.be.ok();
        };
        t.sendEvent('category', 'action');
      });
      it('specifies event by required params and fields', ()=> {
        assert = (fields) => {
          expect(fields.nonInteraction).to.be.equal(1);
        };
        t.sendEvent('category', 'action', {'nonInteraction': 1});
      });
      it('specifies event by params', ()=> {
        assert = (fields) => {
          expect(fields.eventLabel).to.be.equal('label');
          expect(fields.eventValue).to.be.equal(-1);
        };
        t.sendEvent('category', 'action', 'label', -1);
      });
      it('specifies event by params and fields', ()=> {
        assert = (fields) => {
          expect(fields.eventLabel).to.be.equal('label');
          expect(fields.eventValue).to.be.equal(-1);
          expect(fields.nonInteraction).to.be.equal(3);
        };
        t.sendEvent('category', 'action', 'label', -1, {'nonInteraction': 3});
      });
    });
  });

  it('uses custom `trackerFun` and `name`', function(done) {
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

});
