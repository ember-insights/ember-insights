export default {
  //
  // There are available DSL for specifying `insights` mappings:
  //
  // #1 Capture all transitions between application routes.
  //
  //   `
  //     insights: {
  //       ALL_TRANSITIONS: true
  //     }
  //   `
  //
  // #1.1 Except capturing of particural transitions.
  //
  //   Capturing of transitions to 'main.record(.index)', 'outer(.index)'
  //   routes will be excluded.
  //
  //   `
  //     insights: {
  //       ALL_TRANSITIONS: { except: ['main.record', 'outer'] }
  //     }
  //   `
  //
  // #1.2 Definition of particular transitions.
  //
  //   Capture just only transitions to 'index', 'outer.inner.nested(.index)' routes.
  //
  //   `
  //     insights: {
  //       TRANSITIONS: ['index', 'outer.inner.nested']
  //     }
  //   `
  //
  //   Capture just only transitions to 'outer(.index|.inner(.index))' routes.
  //
  //   `
  //     insights: {
  //       MAP: {
  //         outer: {
  //           // ...
  //           inner: {
  //           // ...
  //           }
  //         }
  //       }
  //     }
  //   `
  //
  // #2 Capture all application actions.
  //
  //   `
  //     insights: {
  //       ALL_ACTIONS: true
  //     }
  //   `
  //
  // #2.1 Except capturing of particural actions.
  //
  //   Capturing of actions such as 'actionOne' and 'actionTwo' will be skipped.
  //
  //   `
  //     insights: {
  //       ALL_ACTIONS: { except: ['actionOne', 'actionTwo'] }
  //     }
  //   `
  //
  // #2.2 Definition of particular actions
  //
  //   Capture just only action such as 'action'.
  //
  //   `
  //     insights: {
  //       ACTIONS: ['testAction1']
  //     }
  //   `
  //
  //   Capture just only action such as 'actionOne' which is occured for 'outer(.index)' route.
  //
  //   `
  //     insights: {
  //       MAP: {
  //         outer: { ACTIONS: ['actionOne'] }
  //       }
  //     }
  //   `
  //
  //   Capture just only action such as 'actionOne' which is occured for 'outer(.index)' route
  //   with capturing of transition to 'outer(.index)' route.
  //
  //   `
  //     insights: {
  //       MAP: {
  //         outer: { ACTIONS: ['TRANSITION','actionOne'] }
  //       }
  //     }
  //   `

  insights: {

    ALL_TRANSITIONS: true,
    ALL_ACTIONS: true,

    //
    // Advanced handling.
    // In order to redefine handling of users actions and transitions
    // you're able to specify your own 'handler' behavior. The 'handler' function calls
    // each time for certain insight.
    //
    // * __type__ (string, event type such as 'transition' or 'action')
    // * __context__ (object, event context)
    // * __tracker__ (object, instance of (Google|Console)Tracker)
    // handler: function(type, context, tracker) {
    //
    // }

  }
};
