
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