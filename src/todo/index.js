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

function getVisibleTodos(todos, filter) {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
      return todos.filter(function (todo) {
        return !todo.completed;
      });
    case 'SHOW_COMPLETED':
      return todos.filter(function (todo) {
        return todo.completed;
      });
    default:
      return todos;
  }
}


// View integration
let nextTodoId = 0;

class FilterLink extends Component {
  render() {
    var filter = this.props.filter;
    var currentFilter = this.props.currentFilter;
    if (filter === currentFilter) {
      return <span>{this.props.children}</span>
    }
    return (
      <a href="#"
         onClick={function(event) {
         event.preventDefault();
         store.dispatch( {
          type : 'SET_VISIBILITY_FILTER',
          filter: filter
         })
         }}> {this.props.children} </a>
    )

  }
}


class ToDoApp extends Component {
  inputOnClick() {
    console.log('JM - ToDoApp.handleClick()');
    store.dispatch({
      type: 'ADD_TODO',
      id: nextTodoId++,
      text: this.input.value
    });
    this.input.value = '';
  }

  labelOnClick() {
    console.log('JM - ToDoApp.labelOnClick()');

  }

  textOnBlur() {
    console.log('JM - ToDoApp.textOnBlur()');
    var todoText = this.refs.todoText.value;
  }

  render() {
    console.log('JM - ToDoApp.render()');

    const {visibilityFilter, todos} = this.props;
    var visibleTodos = getVisibleTodos(todos, visibilityFilter);
    return (
      <div>
        <input type="text" ref={node => {
          this.input = node;
        }} placeholder="todo name ..."/>
        <button onClick={this.inputOnClick.bind(this)}> Add Todo</button>
        <ul>
          {visibleTodos.map(function (todo) {
            return (
              <li key={todo.id}
                  placeholder="please enter text"
                  onClick={function() {store.dispatch({type: 'TOGGLE_TODO', id: todo.id})}}
                  style={{textDecoration: todo.completed? 'line-through' : 'none'}}>
                <span> {todo.text} </span>
              </li>
            )
          })}
        </ul>
        <p>
          Show:
          {'  '}
          <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter}>All</FilterLink>
          {'  '}
          <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter}>Active</FilterLink>
          {'  '}
          <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter}>Completed</FilterLink>
        </p>
      </div>
    )
  }
}

var render = function () {
  ReactDOM.render(<ToDoApp todos={store.getState().todosReducer}
                           visibilityFilter={store.getState().visibilityFilterReducer}/>, document.getElementById("main"));
};
store.subscribe(render);
render();

