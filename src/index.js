/**
 * Created by jmlegrand on 08/05/16.
 */

var expect = require('expect');

function counter(state, action) {
  return (action.type === 'INCREMENT') ? state + 1 :
    (action.type === 'DECREMENT') ? state - 1 : null;
}

expect (
  counter(0, {type: 'INCREMENT'})
).toEqual(1);

expect (
  counter(1, {type: 'INCREMENT'})
).toEqual(2);

expect (
  counter(1, {type: 'DECREMENT'})
).toEqual(0);

console.log('JM - Tests passed!');