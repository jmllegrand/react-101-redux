/**
 * Created by jmlegrand on 08/05/16.
 */

import expect from 'expect';
import Redux from 'redux';

import {createStore} from 'redux';

// counter is the reducer that manage the state for the counter example
const counter = (state = 0 , action) => {
  return (action.type === 'INCREMENT') ? state + 1 :
    (action.type === 'DECREMENT') ? state - 1 :
      state;
};

const store = createStore(counter);

console.log('JM - store.getState()', store.getState());

const render = () => {
  document.body.innerText = store.getState()
};

// Register a callback that the store will call ... anytime an action has been dispatched
store.subscribe(render);
render();


//anytime the body is clicked, increment of the counter
document.addEventListener('click', () => {
  store.dispatch({type: 'INCREMENT'});
});


expect (
  counter(0, {type: 'INCREMENT'})
).toEqual(1);

expect (
  counter(1, {type: 'INCREMENT'})
).toEqual(2);

expect (
  counter(1, {type: 'DECREMENT'})
).toEqual(0);

expect (
  counter(1, {type: 'CRAP'})
).toEqual(1);

expect(counter(undefined, {})
).toEqual(0);

console.log('JM - Tests passed!');