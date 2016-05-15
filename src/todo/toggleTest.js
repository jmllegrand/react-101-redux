/**
 * Created by jmlegrand on 15/05/16.
 */


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

console.log('All tests are successful');
