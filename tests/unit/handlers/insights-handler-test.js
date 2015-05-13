import DefaultHandler from 'ember-insights/handlers/insights';
import { it } from 'ember-mocha';


describe.skip('Insights Handler', ()=> {

  describe('in context of transitions', ()=> {

    it('uses #transitionHandler', (done) => {
      DefaultHandler.transitionHandler = () => done();
      let handler = DefaultHandler.factory();
      handler('transition');
    });

  });

  describe('in context of actions', ()=> {

    it('uses #actionHandler', (done) => {
      DefaultHandler.actionHandler = () => done();
      let handler = DefaultHandler.factory();
      handler('action');
    });

  });
});
