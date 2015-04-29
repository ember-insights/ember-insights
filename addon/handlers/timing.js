class TimingHandler {
  constructor(settings) {
    this.settings = settings;
  }

  // static factory(settings) {
  //   return new TimingHandler(settings);
  // }

  handle(type, data, tracker) {
    switch(type) {
      case 'transition':
        this.transitionHandler(data, tracker);
        break;
    }
  }

  transitionHandler(data, tracker) {
    if(this.settings.timing.transitions) {
      // ...
    }
  }
}

export default TimingHandler;
