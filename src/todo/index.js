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

const FilterLink = ({
  filter,
  currentFilter,
  onFilterClick,
  children
  }) => (
  filter === currentFilter ?
    <span>{children}</span> :
    <a href="#"
       onClick={function(event) {
         event.preventDefault();
         onFilterClick(filter);
         }}> {children}
    </a>
);


const Todo = ({
  text,
  completed,
  onClick
  }) => (
  <li placeholder="please enter text"
      onClick={onClick}
      style={{textDecoration: completed? 'line-through' : 'none'}}>
    <span> {text} </span>
  </li>
);

const TodoList = ({
  todos,
  onTodoClick
  }) => (
  <ul>
    {todos.map(todo => (
      <Todo
        key={todo.id}
        text={todo.text} completed={todo.completed}
        onClick={() => onTodoClick(todo.id)}
      />
    ))}
  </ul>
);

const AddTodo = ({
  onAddClick
  }) => {
  let input;
  return (
    <div>
      <input placeholder="todo name ..." type="text" ref={node => {
        input = node;
        }}/>
      <button onClick={ () => {
        onAddClick(input.value);
        input.value= '';
      }}
      >
        Add Todo
      </button>
    </div>
  )
};

const Footer = ({
  visibilityFilter,
  onFilterClick}) => (
  <p>
    Show:

    <FilterLink
      filter='SHOW_ALL'
      currentFilter={visibilityFilter}
      onFilterClick={onFilterClick}
    >
      All
    </FilterLink>

    <FilterLink
      filter='SHOW_ACTIVE'
      currentFilter={visibilityFilter}
      onFilterClick={onFilterClick}
    >
      Active
    </FilterLink>

    <FilterLink
      filter='SHOW_COMPLETED'
      currentFilter={visibilityFilter}
      onFilterClick={onFilterClick}
    >
      Completed
    </FilterLink>
  </p>
);


const ToDoApp = ({
  todos,
  visibilityFilter
  }) => (
  <div>
    <AddTodo
      onAddClick={text =>
            store.dispatch({
              type: 'ADD_TODO',
              id: nextTodoId++,
              text: text
            })
      }
    />

    <TodoList
      todos={getVisibleTodos(todos, visibilityFilter)}
      onTodoClick={id =>
            store.dispatch({
              type: 'TOGGLE_TODO',
              id: id
            })
          }
    />

    <Footer
      visibilityFilter={visibilityFilter}
      onFilterClick={filter =>
        store.dispatch({
        type : 'SET_VISIBILITY_FILTER',
        filter: filter
      })
      }
    />
  </div>
);

var render = function () {
  ReactDOM.render(
    <ToDoApp
      todos={store.getState().todosReducer}
      visibilityFilter={store.getState().visibilityFilterReducer}
    />,
    document.getElementById("main"));
};

store.subscribe(render);
render();

