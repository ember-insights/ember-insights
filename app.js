var Insights = require('ember-insights')['default'];

Ember.Application.initializer({
  name: 'Insights',
  initialize: function (container, application) {
    Insights.configure('demo', {
      debug: true,
      trackerFactory: Insights.ConsoleTracker.factory
    }).track({
      insights: {
        TRANSITIONS: ['index', 'execution'],
        ALL_ACTIONS: true
      }
    }).track({
      insights: {
        TRANSITIONS: ['result']
      },
      handler: function(type, data, tracker) {
        var label, value;
        var category = 'results_page';
        var action = 'entered';
        var model = data.route.get('controller.model');

        if (!model) { return console.error('no model found'); }

        if (model.get('isValid')) {
          label = 'valid';
          value = {
            fails: model.get('isFails')
          };
        }
        else {
          label = 'not valid';
          var errors = {};
          if (!model.get('validateRadio')) {
            errors.selectedRadio = model.get('selectedRadio');
          }
          if (!model.get('validateTask')) {
            errors.taskID = model.get('taskID');
          }
          if (!model.get('checkedOptions.s')) {
            errors.notChecked = ['s'];
          }
          if (!model.get('checkedOptions.l')) {
            errors.notChecked = errors.notChecked || [];
            errors.notChecked.push('l');
          }
          value = { errors: errors };
        }
        value = JSON.stringify(value);
        tracker.sendEvent(category, action, label, value);
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
  validateTask:  Ember.computed.equal('taskID', 'Mnemonics'),
  validateRadio: Ember.computed.equal('selectedRadio', 'should'),
  isValid:       Ember.computed.and('validateTask', 'validateRadio', 'checkedOptions.s', 'checkedOptions.l'),
  isFails:       Ember.computed.gt('attempts',1)
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
