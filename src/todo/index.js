/**
 * Created by jmlegrand on 14/05/16.
 */


import expect from 'expect';
import deepFreeze from 'deep-freeze';
import _ from 'lodash';
import {createStore} from 'redux';
import {combineReducers} from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import {Component} from 'react';


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


// combineReducers is called with a single argument, an object
// - with values the reducers functions
var todoAppReducer = combineReducers({
  todosReducer: todosReducer,
  visibilityFilterReducer: visibilityFilterReducer
});


const store = createStore(todoAppReducer);

// View integration
let nextTodoId = 0;

class ToDoApp extends Component {
  handleClick() {
    console.log('JM - ToDoApp.handleClick()');
    store.dispatch({
      type: 'ADD_TODO',
      id: nextTodoId++,
      text: this.input.value
    });
    this.input.value = '';
  }

  textOnBlur() {
    console.log('JM - ToDoApp.textOnBlur()');
    var todoText = this.refs.todoText.value;
  }

  render() {
    console.log('JM - ToDoApp.render()');
    return (
      <div>
        <input type="text" ref={node => {
          this.input = node;
        }} placeholder="todo name ..."/>
        <button onClick={this.handleClick.bind(this)}> Add Todo</button>
        <ul>
          {this.props.todos.map(function (todo) {
            return (
              <li key={todo.id}>
                {todo.text}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

var render = function () {
  ReactDOM.render(<ToDoApp todos={store.getState().todosReducer}/>, document.getElementById("main"));
};
store.subscribe(render);
render();

