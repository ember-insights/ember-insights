import DefaultHandler from 'ember-insights/handler';
import { it } from 'ember-mocha';


describe('Main handler for matched actions',function(){
  var handler = DefaultHandler.actionHandler;

  it('tests Action without label and value', function(done) {
    var data = {
          actionName: 'btnClick',
          actionArguments: []
        },
        tracker = {
          sendEvent: function(category, action, label, value) {
            expect(arguments.length).to.equal(2);
            expect(category).to.equal('action');
            expect(action).to.equal('btnClick');
            done();
          }
        };

    handler(data, tracker);
  });

  it('tests Action with label', function(done) {
    var data = {
          actionName: 'btnClick',
          actionArguments: ['aLabel']
        },
        tracker = {
          sendEvent: function(category, action, label, value) {
            expect(arguments.length).to.equal(3);
            expect(category).to.equal('action');
            expect(action).to.equal('btnClick');
            expect(label).to.equal('aLabel');
            done();
          }
        };

    handler(data, tracker);
  });

  it('tests Action with label and value', function(done) {
    var data = {
          actionName: 'btnClick',
          actionArguments: ['aLabel', 'aValue']
        },
        tracker = {
          sendEvent: function(category, action, label, value) {
            expect(arguments.length).to.equal(4);
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
