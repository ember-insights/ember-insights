import optparse      from 'ember-insights/optparse';
import TimingHandler from 'ember-insights/handlers/timing';
import { it } from 'ember-mocha';


describe('Timing Handler', ()=> {

  describe('in context of transtions', ()=> {

    it('uses #transitionHandler', (done) => {

      class Subject extends TimingHandler {
        transitionHandler() { done(); }
      }

      let subject = new Subject(optparse.defaultTimingSettings);
      subject.handle('transition');
    });

  });

  describe('helpers API', ()=> {

    let subject = new TimingHandler(optparse.defaultTimingSettings);
    let data    = {routeName:  'routeName', prevRouteName: 'prevRouteName', url: 'url', prevUrl: 'prevUrl'};

    it('#buildEntriesNames', ()=> {
      let entries = subject.buildEntriesNames(data);
      expect(entries).to.be.ok();
      expect(entries.prevMark).to.be.equal('transition:prevUrl');
      expect(entries.currentMark).to.be.equal('transition:url');
      expect(entries.currentMeasurement).to.be.equal('transition:prevUrl');
    });

    it('#createTimingContext', ()=> {
      let entries = subject.buildEntriesNames(data);
      let timing  = subject.createTimingContext(entries);
      expect(timing).to.be.ok();
    });

    describe.skip('TimingContext behavior', ()=> {

      let entries = subject.buildEntriesNames(data);
      let timing  = subject.createTimingContext(entries);

    });

  });
});
