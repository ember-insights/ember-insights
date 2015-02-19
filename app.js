App = Ember.Application.create({});

App.Router.map(function() {
  this.resource('index', { path: '/' });
  this.resource('execution', { path: '/execution' });
  this.resource('result', { path: '/result' });
});

App.ExecutionRoute = Ember.Route.extend({
  model: function(){
    var modelClass = Ember.Object.extend({
      validateTask: Ember.computed.equal('taskID', 'Mnemonics'),
      validateRadio: Ember.computed.equal('selectedRadio', 'should'),
      valid: Ember.computed.and('validateTask', 'validateRadio', 'checkedOptions.s', 'checkedOptions.l'),
      failsDetected: Ember.computed.gt('attempts',1)
    });

    return modelClass.create({
      attempts: 0,
      taskID: '',
      selectedRadio: 'must',
      checkedOptions: {
        s:false,
        o:false,
        l:false,
        i:false,
        d:false
      }
    });
  }
});

App.ResultRoute = Ember.Route.extend({
  model: function(){
    return this.modelFor('execution');
  }
});


App.IndexController = Ember.Controller.extend({
  actions: {
    next: function(){
      this.transitionTo('execution');
    }
  }
});

App.ExecutionController = Ember.ObjectController.extend({

  submitted: false,
  radioButtons: {
      must: 'must',
      should: 'should',
      could: 'could',
      wont: 'wont'
    },

  actions: {
    submit: function(){
      this.incrementProperty('model.attempts');

      if(this.get('model.valid') || this.get('model.attempts') > 1){
        this.transitionTo('result');
      }
    }
  }
});

App.ResultController = Ember.Controller.extend({

  actions: {
    restart: function(){
      this.transitionTo('index');
    }
  }


});

App.RadioButtonComponent = Ember.Component.extend({
  tagName: 'input',
  type: 'radio',
  attributeBindings: [ 'disabled', 'checked', 'name', 'type', 'value' ],

  checked: function () {
    return this.get('value') === this.get('selectedRadio');
  }.property('value', 'selectedRadio'),

  change: function () {
    this.set('selectedRadio', this.get('value'));
  }
});
