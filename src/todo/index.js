/**
 * Created by jmlegrand on 14/05/16.
 */


import expect from 'expect';
import deepFreeze from 'deep-freeze';
import _ from 'lodash';

//reducer function
// - state: an array of todos
//reducer: a pure function to implement the update of the application

var todosReducer = function (state = [], action) {
  var structure = {
    id: 0,
    text: '',
    completed: false
  };
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat(Object.assign({}, structure, {text: action.text}));

    case 'TOGGLE_TODO':
      return state.map(function(todo){
        return todo.id !== action.id ? todo : Object.assign({}, todo, {completed: !todo.completed});
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
