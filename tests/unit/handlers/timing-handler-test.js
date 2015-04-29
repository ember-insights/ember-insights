import TimingHandler from 'ember-insights/handlers/timing';
import { it } from 'ember-mocha';


describe('Timing Handler', ()=> {

  describe('in context of transtions', ()=> {

    it('uses #transitionHandler', (done) => {

      class Subject extends TimingHandler {
        transitionHandler() { done(); }
      }

      let subject = new Subject({});
      subject.handle('transition');
    });

  });
});
