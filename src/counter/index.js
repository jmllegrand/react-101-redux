/**
 * Created by jmlegrand on 08/05/16.
 */

import expect from 'expect';
import React from 'react'
import ReactDOM from 'react-dom';

import Redux from 'redux';

import {createStore} from 'redux';

// counter is the reducer that manage the state for the counter example
const counter = (state = 0, action) => {
  return (action.type === 'INCREMENT') ? state + 1 :
    (action.type === 'DECREMENT') ? state - 1 :
      state;
};


/*const Counter = ({value,onIncrement,onDecrement}) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}> +</button>
    <button onClick={onDecrement}> -</button>
  </div>
);*/

class Counter extends React.Component {
  render() {
    var value = this.props.value;
    var onIncrement = this.props.onIncrement;
    var onDecrement = this.props.onDecrement;
    return (
      <div>
        <h1>{value}</h1>
        <button onClick={onIncrement}> +</button>
        <button onClick={onDecrement}> -</button>
      </div>
    );
  }
}


const store = createStore(counter);

console.log('JM - store.getState()', store.getState());

const render = () => {
  ReactDOM.render(<Counter
    value={store.getState()}
    onIncrement={() => store.dispatch({
    type: 'INCREMENT'
      })}
    onDecrement={() => store.dispatch({
    type: 'DECREMENT'
      })}

  />, document.getElementById("main"));
};

// Register a callback that the store will call ... anytime an action has been dispatched
store.subscribe(render);
render();


//anytime the body is clicked, increment of the counter
/*document.addEventListener('click', () => {
  store.dispatch({type: 'INCREMENT'});
});
*/

expect(
  counter(0, {type: 'INCREMENT'})
).toEqual(1);

expect(
  counter(1, {type: 'INCREMENT'})
).toEqual(2);

expect(
  counter(1, {type: 'DECREMENT'})
).toEqual(0);

expect(
  counter(1, {type: 'CRAP'})
).toEqual(1);

expect(counter(undefined, {})
).toEqual(0);

console.log('JM - Tests passed!');