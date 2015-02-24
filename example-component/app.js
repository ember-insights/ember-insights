var Insights = require('ember-insights')['default'];

Ember.Application.initializer({
  name: 'Insights',
  initialize: function (container, application) {
    Insights.configure('demo', {
      trackerFactory: Insights.ConsoleTracker.factory
    }).track({
      insights: {
        TRANSITIONS: ['index', 'execution'], ALL_ACTIONS: true
      }
    }).track({
      insights: {
        TRANSITIONS: ['result']
      },
      handler: function(type, context, tracker) {
        var model = context.route.get('controller.model');
        var label, value;

        if (model.get('isValid')) {
          label = 'success';
          value = { first_attempt: model.get('firstAttempt'), second_attempt: model.get('secondAttempt') };
        }
        else {
          label = 'failed';
          value = { errors: model.errors() };
        }

        tracker.sendEvent('result_page', 'entered', label, value);
      }
    });

    Insights.start('demo');
  }
});

App = Ember.Application.create({});

App.Router.map(function() {
  this.resource('index',     { path: '/' });
  this.resource('execution', { path: '/execution' });
  this.resource('result',    { path: '/result' });
});

App.Task = Ember.Object.extend({
  validateInput:    Ember.computed.equal('taskID', 'Mnemonics'),
  validateRadio:    Ember.computed.equal('selectedRadio', 'should'),
  validateCheckbox: Ember.computed.and('checkedOptions.s', 'checkedOptions.l'),
  isValid:          Ember.computed.and('validateInput', 'validateRadio', 'validateCheckbox'),
  firstAttempt:     Ember.computed.equal('attempts', 1),
  secondAttempt:    Ember.computed.equal('attempts', 2),

  errors: function() {
    var errors = {};
    if (!this.get('validateRadio')) {
      errors.selectedRadio = this.get('selectedRadio');
    }
    if (!this.get('validateInput')) {
      errors.taskID = this.get('taskID');
    }
    if (!this.get('checkedOptions.s')) {
      errors.notChecked = ['s'];
    }
    if (!this.get('checkedOptions.l')) {
      errors.notChecked = errors.notChecked || [];
      errors.notChecked.push('l');
    }
    return errors;
  }
});

App.ExecutionRoute = Ember.Route.extend({
  model: function(){
    return App.Task.create({
      attempts:       0,
      taskID:         '',
      selectedRadio:  'must',
      checkedOptions: { s:false, o:false, l:false, i:false, d:false }
    });
  }
});

App.ResultRoute = Ember.Route.extend({
  model: function(){ return this.modelFor('execution'); }
});


App.IndexController = Ember.Controller.extend({
  actions: {
    next: function(){ this.transitionTo('execution'); }
  }
});

App.ExecutionController = Ember.ObjectController.extend({
  submitted:    false,
  radioButtons: { must: 'must', should: 'should', could: 'could', wont: 'wont' },

  actions: {
    submit: function(){
      this.incrementProperty('model.attempts');

      if(this.get('model.isValid') || this.get('model.attempts') > 1){
        this.transitionTo('result');
      }
    }
  }
});

App.ResultController = Ember.Controller.extend({
  actions: {
    restart: function(){ this.transitionTo('index'); }
  }
});

App.RadioButtonComponent = Ember.Component.extend({
  tagName:            'input',
  type:               'radio',
  attributeBindings:  [ 'disabled', 'checked', 'name', 'type', 'value' ],

  checked: function () {
    return this.get('value') === this.get('selectedRadio');
  }.property('value', 'selectedRadio'),

  change: function () {
    this.set('selectedRadio', this.get('value'));
  }
});
