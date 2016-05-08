/**
 * Created by jmlegrand on 08/05/16.
 */

var expect = require('expect');


const counter = (state = 0 , action) => {
  return (action.type === 'INCREMENT') ? state + 1 :
    (action.type === 'DECREMENT') ? state - 1 :
      state;
};

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