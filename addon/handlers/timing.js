export default {
  factory: (settings) => {
    return (type/*, data, tracker*/) => {
      if(settings.timing.transitions && type === 'transition') {
        // ...
      }
    };
  }
};
