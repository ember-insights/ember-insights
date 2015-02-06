import {
  it
} from 'ember-mocha';

import {
  GoogleTracker
} from 'ember-insights/trackers';

describe('Mocha', function(){

  it('tests booleans :)', function(){
    expect(true).to.be.ok();
  });

  describe('GoogleTracker', function(){
    var subj;

    beforeEach(function(){
      subj = GoogleTracker;
    });

    it('tests GoogleTracker', function(){
      expect(typeof subj.factory).to.equal('function');
    });
  });
});
