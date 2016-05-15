/**
 * Created by jmlegrand on 14/05/16.
 */


import expect from 'expect';
import deepFreeze from 'deep-freeze';
import _ from 'lodash';


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


testTodosReducer();
testToggleTodo();

console.log('All tests are successful');
