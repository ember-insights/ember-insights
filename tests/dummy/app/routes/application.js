import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    testAction1: function() {
      console.log('LOGGED: testAction1');
    },
    testAction2: function() {
      console.log('LOGGED: testAction2');
    },
    testAction3: function() {
      console.log('LOGGED: testAction3');
    }
  }
});
