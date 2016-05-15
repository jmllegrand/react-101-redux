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
    default :
      return state;
  }
};


var testTodosReducer = function () {
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


function toggleTodo(todo) {
  //return  _.assign(_.clone(todo), {completed: !todo.completed});
  return Object.assign({}, todo, {
    completed: !todo.completed
  })
};


var toggleTodoTest = function () {
  console.log('executing toggleTodoTest');
  var todoBefore = {
    id: 0,
    test: 'Learn Redux',
    completed: false
  };

  var todoAfter = {
    id: 0,
    test: 'Learn Redux',
    completed: true
  };
  deepFreeze(todoBefore);


  expect(toggleTodo(todoBefore)).toEqual(todoAfter)
};


toggleTodoTest();
testTodosReducer();

console.log('All tests are successful');
