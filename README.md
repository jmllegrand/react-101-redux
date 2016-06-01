
### Redux

#### The first principle of Redux: have a single immutable state tree
Everything that changes in the application (data and UI state) is contained in a single object called the *State* or the *State Tree*.
The state is a minimal representation of the data in your app.
The object used to store the *state tree* is the *store*

#### The second principle of Redux: describe State Changes with Actions
The State Tree is read only. You cannot modify or write to it directly. Anytime you want to change the state, you need to dispatch an action.
An *action* is a plain JS object describing the change.
The action is the minimal representation of the change to the data
Requirement for the structure of the action: it has have a type property. Use string for its type as it is are serializable.
The components don't know how exactly the data has been added to the State Tree. All they know is that they need to dispatch an action with a type.
Whether it is initiated by a network request or by user interaction, any data that gets into the Redux application gets there by actions.


#### The third principle of Redux: The Reducer Function
The state changes need to be described as a *pure function* that takes

* as arguments :the previous state & the action being dispatched
* returns the next state of your application

```
function counter (state, action) {
  return state;
}
```

There is a single function, the *reducer function*, that manages how the next state is calculated based on the previous state of the whole application and
the action being dispatched:

### Vanilla JS
#### Pure function
Pure functions ( as opposed to impure functions)

*  returned value depends solely on the values of their arguments

```
function square(x) {
  return x * x;
}
```

* do not have any observable side effects

* do not modify the values passed to them

#### Session: how to write a reducer for the counter example

es6 default argument 

```
function counter(state = 0 , action) {
  return (action.type === 'INCREMENT') ? state + 1 :
    (action.type === 'DECREMENT') ? state - 1 :
      state;
}
```

es6 arrow function declaration 
```
const counter = (state = 0 , action) => {
  return (action.type === 'INCREMENT') ? state + 1 :
    (action.type === 'DECREMENT') ? state - 1 :
      state;
};
```

#### Session:  Store Methods

es6 destucturing 

```
const {createStore} = Redux;
```
equivalent to 

```
var createStore = Redux.createStore;`
import {createStore} from 'redux';

```

3 methods avaialbel once a *store* has been instantiated

- getState() to retrieve the current state tree of the application 

```
store.getState()
```

- dispatch() to dispatch *actions*
This is the only way to change the data in the store


```
const actionIncrement = store.dispatch({type: 'INCREMENT'});
```

- subscribe() to add a change listener that will be called any time an action is dispatched

#### Redux & Stateless components
stateless components === functional stateless components 
*any React Component declared as a function that has no state and returns the same markup given the same props*


#### List & mutation

#### Add an element

Approach 1 : with mutation

```
function addCounter (list) {
  list.push(0);
  return list;
}
```

Approach 2 :using concat() that does not modify the original array

```
function addCounter (list) {
  return list.concat([0]);
}
```

Approach 3 :using the spread operator 

```
function addCounter (list) {
  return [...list, 0];
}
```


#### Remove an element

Approach 1 : with mutation

```
function removeCounter(index, numbers, list) {
  list.splice(index, numbers);
  return list;
}
```

Approach 2 :using slice() & concat() that does not modify the original array

```
function removeCounter(index, list) {
  return list
    .slice(0, index)
    .concat(list.slice(index + 1));
}
```

Approach 3 :using the spread operator 

```
function removeCounter(index, list) {
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
    ]
}
```

#### Change an element


#### Reducer Composition with Objects


ES6 object literal shorthand property names

```
var todoAppReducer = combineReducers({
  todosReducer: todosReducer,
  visibilityFilterReducer: visibilityFilterReducer
});
```

```
var todoAppReducer = combineReducers({
  todosReducer,
  visibilityFilterReducer
});
```


#### Todo - View Layer

Declare render() that updates the dom in response to the current application state
```
var render = function() {
  ReactDOM.render(<Todos />, document.getElementById("main"));
};
```

Subscribe/Add to store a change listener that will be called any time an action is dispatched

```
store.subscribe(render);
```
Execute the rendering at initialisation time
```
render();
```

#### Todo - Filtering

Get access to props

Approach 1
```
    var visibleTodos = getVisibleTodos(this.props.todos, this.props.visibilityFilter);
```


Approach 2
```
    var visibilityFilter = this.props.visibilityFilter;
    var visibleTodos = getVisibleTodos(this.props.todos, visibilityFilter);
```


Approach 3 - destructuring to avoid typing this.props every time

```
    const {visibilityFilter, todos} = this.props;
    var visibleTodos = getVisibleTodos(todos, visibilityFilter);
```


#### Presentational Components
#### Todo
Presentational components: it does not specify any behavior but knows how to render a Todo

```
class Todo extends Component {
  render() {
    const {text, completed, onclick} = this.props;
    return (
      <li placeholder="please enter text"
          onClick={onClick}
          style={{textDecoration: completed? 'line-through' : 'none'}}>
        <span> {text} </span>
      </li>
    )
  }
}
```

```
const Todo = ({text, completed, onClick}) => (
  <li placeholder="please enter text"
      onClick={onClick}
      style={{textDecoration: completed? 'line-through' : 'none'}}>
    <span> {text} </span>
  </li>
);
```

#### Todo list

```
const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map(function (todo) {
      return <Todo key={todo.id}
                   text={todo.text} completed={todo.completed}
                   onClick={function() {onTodoClick(todo.id)}}/>
    })}
  </ul>
);
```

#### Container Components


*TodoApp* specifies the behaviors when 
- buttons are clicked, 
- items are added, and 
- filters are applied. 

The individual presentational components, such as *AddTodo*, *TodoList*, *Footer* & *FilterLink*, etc don't dispatch actions. 
They call their callback functions in the props. 
Therefore, they are only responsible for the looks, not the behavior.

Downside of this approach: a lot of props must be passed down the tree even when intermediate components don't use them.

For example, *FilterLink* needs to know the current filter so it can change its appearance when it's active. 
In order to receive the current filter, it has to be passed down from the top. This is why *Footer* has to be given visibilityFilter as a prop
so it can be passed to a *FilterLink*.

This breaks encapsulation because the parent components need to know too much about what data the child components need. 
To fix this, we are going to extract some container components.


##### Simplify the Footer Component

Before refactoring, *Footer* component accepts 2 props: 
- visibilityFilter & 
- onFilterClick() callback as its props, 
It doesn't use either of them. It just passes down to the *FilterLink*.
The *Footer* component doesn't care about the values of its props: they only exist to pass down to *FilterLink*.


Before Refactoring 
```
    <Footer
      visibilityFilter={visibilityFilter}
      onFilterClick={filter =>
        store.dispatch({
        type : 'SET_VISIBILITY_FILTER',
        filter: filter
      })
      }
    />
```

After Refactoring 

```
<Footer/>

```

Remove 
- the props definition from the Footer component,
- the props usage from the FilterLinks as well
        
Before Refactoring 

```
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
  </p>
);

```


After Refactoring 


```
const Footer = () => (
  <p>
    Show:

    <FilterLink
      filter='SHOW_ALL'
    >
      All
    </FilterLink>
  </p>
);
```

##### Refactor FilterLink (based on the impacts created in the previous step) into Link 


we can't say *FilterLink* is presentational component; its current implementation is inseparable from its behavior.
 
Need to to split  *FilterLink* into
- a presentational component, *Link* 
- a container component to manage the logic, *FilterLink* 

The new *Link* presentational component doesn't know anything about the filter. 
It only accepts 
- active prop, 
- onFilterClick handler

*Link* is only concerned with rendering.

```

const Link = ({
  active,
  onFilterClick,
  children
  }) => (
  active ?
    <span>{children}</span> :
    <a href="#"
       onClick={(event) => {
         event.preventDefault();
         onFilterClick();
         }}> {children}
    </a>
);
```

##### Create the nex FilterLink 
The new *FilterLink* will be a class that renders the *Link* with the current data from the store. 
It's going to read the component props and read the Redux store's state.
As a container component, *FilterLink* doesn't have its own markup. It delegates rendering to the *Link* presentational 
component. 


```
class FilterLink extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate())
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <Link
        active={props.filter === state.visibilityFilterReducer}
        onFilterClick = { () =>
          store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter: props.filter
          })
        }
      >
        {props.children}
      </Link>
    )
  }
}
```


It calculates *Link* active prop by comparing its own filter prop with the visibilityFilter from the Redux store's state.
- The filter prop is the one that is passed to the FilterLink from the Footer
- The visibilityFilter corresponds to the current chosen visibility filter that is held in Redux store's state. 
If they match, we want the link to appear active.

The container component also needs to specify the behavior. In this case, the FilterLink specifies that when a particular Link is clicked, we should dispatch an action of the type 'SET_VISIBILITY_FILTER' along with the filter value that we take from the props.

