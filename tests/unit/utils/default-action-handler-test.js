import Ember    from 'ember';
import { test } from 'ember-qunit';

import Utils from 'ember-insights/lib/utils';

var handler = Utils.defaultActionHandler;

module('Default handler for matched actions');

test('Action without label and value', function() {
  expect(3);

  var data = {
        actionName: 'btnClick',
        actionArguments: []
      },
      tracker = {
        sendEvent: function(category, action, label, value) {
          equal(arguments.length, 2, 'sendEvent received 2 arguments');
          equal(category, 'ember_action', 'sendEvent received correct category');
          equal(action, 'btnClick', 'sendEvent received correct action');
        }
      };

  handler(data, tracker);
});

test('Action with label', function() {
  expect(4);

  var data = {
        actionName: 'btnClick',
        actionArguments: ['aLabel']
      },
      tracker = {
        sendEvent: function(category, action, label, value) {
          equal(arguments.length, 3, 'sendEvent received 3 arguments');
          equal(category, 'ember_action', 'sendEvent received correct category');
          equal(action, 'btnClick', 'sendEvent received correct action');
          equal(label, 'aLabel', 'sendEvent received correct label');
        }
      };

  handler(data, tracker);
});

test('Action with label and value', function() {
  expect(5);

  var data = {
        actionName: 'btnClick',
        actionArguments: ['aLabel', 'aValue']
      },
      tracker = {
        sendEvent: function(category, action, label, value) {
          equal(arguments.length, 4, 'sendEvent received 4 arguments');
          equal(category, 'ember_action', 'sendEvent received correct category');
          equal(action, 'btnClick', 'sendEvent received correct action');
          equal(label, 'aLabel', 'sendEvent received correct label');
          equal(value, 'aValue', 'sendEvent received correct value');
        }
      };

  handler(data, tracker);
});
