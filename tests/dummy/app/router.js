import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('main', function() {
    this.route('record', {path: ':ident'});
  });
  this.resource('outer', function() {
    this.resource('outer.inner', {path: '/inner'}, function() {
      this.route('nested', {path: ':idd'});
    });
  });
});

export default Router;
