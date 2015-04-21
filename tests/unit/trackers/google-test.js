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

      describe.skip('by creating tracker object', ()=> {

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
          window['ga'] = createMock('UA-XXXX-Y', { name: 'newTracker' }, done);
          let t = GoogleTracker.with('ga', 'UA-XXXX-Y', { name: 'newTracker' });
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

});
