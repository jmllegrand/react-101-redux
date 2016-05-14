/**
 * Created by jmlegrand on 14/05/16.
 */


import expect from 'expect';
import deepFreeze from 'deep-freeze';
import _ from 'lodash';


// objective: build an array list counter

// state: an array of javascript numbers


function addCounter(list) {
  return list
    .concat(0);
}

function removeCounter(index, list) {
  return list
    .slice(0, index)
    .concat(list.slice(index + 1));
}


function incrementCounter(list, index) {
  return list
    .slice(0, index)
    .concat(list[index] + 1)
    .concat(list.slice(index + 1));
}

function toggleTodo(todo) {
  //return  _.assign(_.clone(todo), {completed: !todo.completed});
  return Object.assign({}, todo, {
    completed: !todo.completed
  })
};



var testAddCounter = function () {
  var listBefore = [];
  var listAfter = [0];

  deepFreeze(listBefore);
  expect(
    addCounter(listBefore)
  ).toEqual(listAfter);

};

var removeCounterTest = function () {
  var listBefore = [0, 10, 20];
  var index = 1;
  var listAfter = [0, 20];
  deepFreeze(listBefore);
  expect(
    removeCounter(index, listBefore)
  ).toEqual(listAfter);
};

var incrementCounterTest = function () {
  var listBefore = [0, 10, 20];
  var listAfter = [0, 11, 20];
  var index = 1;
  deepFreeze(listBefore);
  expect(
    incrementCounter(listBefore, index)
  ).toEqual(listAfter)
};


var toggleTodoTest = function() {
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

testAddCounter();

removeCounterTest();

incrementCounterTest();

toggleTodoTest();

console.log('All tests are successful');
