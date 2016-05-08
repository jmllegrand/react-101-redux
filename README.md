
### Redux

#### The first principle of Redux: have a single immutable state tree
Everything that changes in the application (data and UI state) is contained in a single object called the *State* or the *State Tree*.
The state is a minimal representation of the data in your app

#### The second principle of Redux: describe State Changes with Actions
The State Tree is read only. You cannot modify or write to it directly. Anytime you want to change the state, you need to dispatch an action.
An *action* is a plain JS object describing the change.
The action is the minimal representation of the change to the data
Requirement for the structure of the action: it has have a type property. Use string for its type as it is are serializable.
The components don't know how exactly the data has been added to the State Tree. All they know is that they need to dispatch an action with a type.
Whether it is initiated by a network request or by user interaction, any data that gets into the Redux application gets there by actions.


#### The third principle of Redux: The Reducer Function
The state changes need to be described as a pure function that takes

* the previous state and
* the action being dispatched
* It returns the next state of your application

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
