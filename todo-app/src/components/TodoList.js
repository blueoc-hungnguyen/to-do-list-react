import React from "react";
import styled from "styled-components";
import TodoItem from "./TodoItem";

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const TodoList = ({ todos, toggleTodo, deleteTodo, restoreTodo, editTodo }) => {
  return (
    <List>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={() => toggleTodo(todo.id)}
          deleteTodo={() => deleteTodo(todo.id)}
          restoreTodo={() => restoreTodo && restoreTodo(todo.id)}
          editTodo={(newText) => editTodo && editTodo(todo.id, newText)}
        />
      ))}
    </List>
  );
};

export default TodoList;
