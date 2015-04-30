class TimingHandler {
  constructor(settings) {
    //this.settings = settings;
    this.isTimingAvailable = (typeof window.performance === 'undefined');
    this.isTransitionsEnabled = settings.timing.transitions;
  }

  handle(type, data, tracker) {
    switch(type) {
      case 'transition':
        this.transitionHandler(data, tracker); break;
    }
  }

  transitionHandler(data, tracker) {
    if(this.isTimingAvailable) { return false; }
    if(this.isTransitionsEnabled) {
      let entries = this.buildEntriesNames(data);
      let timing  = this.createTimingContext(entries);

      timing.currentMark();

      if(timing.isPrevMark) {
        let measure = timing.currentMeasure();
        tracker.sendTiming('transition', data.prevRouteName, measure.duration, { page: data.prevUrl });
        timing.releaseMeasurement();
      }
    }
  }

  buildEntriesNames(data) {
    return { prevMark: 'transition:'+data.prevUrl, currentMark: 'transition:'+data.url, currentMeasurement: 'transition:'+data.prevUrl };
  }

  createTimingContext(entries) {
    let ctx = { p: window.performance };

    ctx.prevMarks  = ctx.p.getEntriesByName(entries.prevMark);
    ctx.isPrevMark = (ctx.prevMarks.length > 0);

    ctx.currentMark = () => {
      return ctx.p.mark(entries.currentMark);
    };
    ctx.currentMeasures = () => {
      return ctx.p.getEntriesByName(entries.currentMeasurement);
    };
    ctx.currentMeasure = () => {
      ctx.p.measure(entries.currentMeasurement, entries.prevMark, entries.currentMark);
      let currentMeasures = ctx.currentMeasures();
      return currentMeasures[currentMeasures.length -1];
    };
    ctx.releaseMeasurement = () => {
      ctx.p.clearMeasures(entries.currentMeasurement);
      ctx.p.clearMarks(entries.prevMark);
    };

    return ctx;
  }
}

export default TimingHandler;
