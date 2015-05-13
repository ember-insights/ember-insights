import DefaultHandler from 'ember-insights/handlers/insights';
import { it } from 'ember-mocha';


describe('Insights Handler in context of #actionHandler',function() {
  var handler = DefaultHandler.actionHandler;

  it('sends action', function(done) {
    var data = {
      actionName: 'btnClick', actionArguments: []
    };
    var tracker = {
      sendEvent: function(category, action, label, value) {
        expect(category).to.equal('action');
        expect(action).to.equal('btnClick');
        done();
      }
    };

    handler(data, tracker);
  });

  it('sends action with label', function(done) {
    var data = {
      actionName: 'btnClick', actionArguments: ['aLabel']
    };
    var tracker = {
      sendEvent: function(category, action, label, value) {
        expect(category).to.equal('action');
        expect(action).to.equal('btnClick');
        expect(label).to.equal('aLabel');
        done();
      }
    };

    handler(data, tracker);
  });

  it('sends action with label and value', function(done) {
    var data = {
      actionName: 'btnClick', actionArguments: ['aLabel', 'aValue']
    };
    var tracker = {
      sendEvent: function(category, action, label, value) {
        expect(category).to.equal('action');
        expect(action).to.equal('btnClick');
        expect(label).to.equal('aLabel');
        expect(value).to.equal('aValue');
        done();
      }
    };

    handler(data, tracker);
  });
});
