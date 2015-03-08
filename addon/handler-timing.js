export default {
  factory: function(settings) { // jshint ignore:line
    var timingHandler = function(measureName, tracker, data) { // jshint ignore:line
      var measures = window.performance.getEntriesByName(measureName);
      var measure = measures[measures.length-1];
      tracker.processTimingEvent(measure);
    };
    return timingHandler;
  }
};
