/**
 * Created by jmlegrand on 14/05/16.
 */


import expect from 'expect';
import deepFreeze from 'deep-freeze';
import _ from 'lodash';
import {createStore} from 'redux';


var todoReducer = function (state = {}, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      return state.id !== action.id ?
        state :
        Object.assign({}, state, {completed: !state.completed});

    default:
      return state;
  }
};


//reducer function
// - state: an array of todos
//reducer: a pure function to implement the update of the application
//Initial design of the reducer  has too many concerns
// - how todos arrays are updates
// - how individual todos are updated (object level)
var todosReducer = function (state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat(todoReducer(undefined, action));

    case 'TOGGLE_TODO':
      return state.map(function (todo) {
        console.log('todoReducer for', JSON.stringify(todo), ' is ', todoReducer(todo, action));
        return todoReducer(todo, action);
      });
    default :
      return state;
  }
};


var visibilityFilterReducer = function (state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

/* var todoAppReducer = function(state = {}, action) {
 return {
 todos: todosReducer(
 state.todos,
 action
 ),
 visibilityFilterReducer: visibilityFilterReducer(
 state.visibilityFilter,
 action
 )
 }
 };*/

//combineReducers is a function with
// - arguments: reducers
// - return value is a reducer itself, a function with a state and an action
// a example of functional programming : functions can take other functions as arguments and returns
// others functions
var combineReducers = function (reducers) {
  return function (state = {}, action) {
    // returns an array of strings corresponding to the properties found in the reducers object passed
    // proceed a reduce() for each of the properties
    return Object.keys(reducers).reduce(function (nextState, key) {
        nextState[key] = reducers[key](state[key], action);
        return nextState;
      }, {}
    )
  };
};

// combineReducers is called with a single argument, an object
// - with values the reducers functions
var todoAppReducer = combineReducers({
  todosReducer: todosReducer,
  visibilityFilterReducer: visibilityFilterReducer
});


const store = createStore(todoAppReducer);

// View integration

var render = function() {
  ReactDOM.render(<Todos />, document.getElementById("main"));
};
//Adds a change listener to the store
// render will be called any time an action is dispatched
store.subscribe(render);


render();

console.log('JM - Initial state');
console.log(store.getState());
console.log('--------------------');

console.log('JM - Dispatching a ADD_TODO');
store.dispatch({
  type: 'ADD_TODO',
  id: 0,
  text: 'Learn React'
});
console.log('JM - Current state');
console.log(JSON.stringify(store.getState(), null, 2));
console.log('--------------------');

console.log('JM - Dispatching a ADD_TODO');
store.dispatch({
  type: 'ADD_TODO',
  id: 1,
  text: 'Go shopping'
});
console.log('JM - Current state');
console.log(JSON.stringify(store.getState(), null, 2));
console.log('--------------------');

console.log('JM - Dispatching a TOGGLE_TODO');
store.dispatch({
  type: 'TOGGLE_TODO',
  id: 1
});
console.log('JM - Current state');
console.log(JSON.stringify(store.getState(), null, 2));
console.log('--------------------');


console.log('JM - Dispatching a SET_VISIBILITY_FILTER');
store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
});
console.log('JM - Current state');
console.log(JSON.stringify(store.getState(), null, 2));
console.log('--------------------');

var testTodosReducer = function () {
  console.log('executing testTodosReducer()');

  var stateBefore = [];
  var action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn React'
  };
  var stateAfter = [{
    id: 0,
    text: 'Learn React',
    completed: false
  }];
  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(todosReducer(stateBefore, action)).toEqual(stateAfter);

};


var testToggleTodo = function () {
  console.log('executing testToggleTodo()');
  var stateBefore = [{
    id: 0,
    text: 'Learn React',
    completed: false
  }, {
    id: 1,
    text: 'Go to the flea market',
    completed: false
  }];

  var action = {
    type: 'TOGGLE_TODO',
    id: 0
  };
  var stateAfter = [{
    id: 0,
    text: 'Learn React',
    completed: true
  }, {
    id: 1,
    text: 'Go to the flea market',
    completed: false
  }];

  deepFreeze(stateBefore);
  deepFreeze(action);
  expect(todosReducer(stateBefore, action)).toEqual(stateAfter);
};

var testObjectKeys = function () {
  console.log('executing testObjectKeys()');
  var reducersObject = {
    todosReducer: todosReducer,
    visibilityFilterReducer: visibilityFilterReducer
  };

  var reducersObjectFinal = ['todosReducer', 'visibilityFilterReducer'];
  expect(Object.keys(reducersObject)).toEqual(reducersObjectFinal);

};



testTodosReducer();
testToggleTodo();
testObjectKeys();

console.log('All tests are successful');
