import React from 'react';
import { Subject } from 'rxjs';


const unsubscribeSubject = new Subject();

const unsubscribe = function() {
  unsubscribeSubject.next();
  unsubscribeSubject.complete();
};

// This function takes a component...
export function withUnsubscription(WrappedComponent) {
  // ...and returns another component...
  return class extends React.Component {
    componentWillUnmount() {
      unsubscribe();
    }

    render() {
      return <WrappedComponent unsubscribeSubject={unsubscribeSubject} {...this.props} />;
    }
  };
}