import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 2px solid #eee;
`;
const Text = styled.span`
  flex: 1;
  margin-left: 10px;
  color: ${(p) => (p.completed ? "#888" : "#222")};
  text-decoration: ${(p) => (p.completed ? "line-through" : "none")};
`;
const TextInput = styled.input`
  flex: 1;
  margin-left: 10px;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;
const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.bg || "transparent"};
  color: white;
  border: none;
  padding: 6px;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 8px;
  &:hover { opacity: 0.9; }
`;

const DeleteButton = styled(IconButton).attrs({ title: "Delete" })`
  background: #dc3545;
`;
const RestoreButton = styled(IconButton).attrs({ title: "Restore" })`
  background: #28a745;
  &:hover { background: #218838; }
`;
const EditButton = styled(IconButton).attrs({ title: "Edit" })`
  background: #17a2b8;
  &:hover { background: #138496; }
`;
const SaveButton = styled(IconButton).attrs({ title: "Save" })`
  background: #007bff;
`;
const CancelButton = styled(IconButton).attrs({ title: "Cancel" })`
  background: #6c757d;
`;

const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
    {children}
  </svg>
);

const TodoItem = ({ todo, toggleTodo, deleteTodo, restoreTodo, editTodo }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text || "");
  const inputRef = useRef(null);

  useEffect(() => {
    setText(todo.text || "");
  }, [todo.text]);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const startEdit = () => {
    if (todo.is_deleted) return;
    setEditing(true);
  };

  const saveEdit = () => {
    const newText = text.trim();
    const original = (todo.text || "").trim();
    if (newText === "" || newText === original) {
      setText(todo.text || "");
      setEditing(false);
      return;
    }
    editTodo && editTodo(newText);
    setEditing(false);
  };

  const cancelEdit = () => {
    setText(todo.text || "");
    setEditing(false);
  };

  return (
    <Item>
      <input
        type="checkbox"
        style={{
          transform: "scale(1.4)",
          accentColor: "#007bff",
          cursor: "pointer"
        }}
        checked={!!todo.completed}
        onChange={toggleTodo}
        disabled={todo.is_deleted}
        aria-label="Toggle todo"
      />

      {editing ? (
        <>
          <TextInput
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEdit();
            }}
          />
          <SaveButton onClick={saveEdit} aria-label="Save">
            <Svg>
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
            </Svg>
          </SaveButton>
          <CancelButton onClick={cancelEdit} aria-label="Cancel">
            <Svg>
              <path d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.3 9.19 12 2.88 5.71 4.29 4.29 10.59 10.6 16.88 4.29z" />
            </Svg>
          </CancelButton>
        </>
      ) : (
        <>
          <Text completed={todo.completed}>{todo.text}</Text>

          {!todo.is_deleted && (
            <EditButton onClick={startEdit} aria-label="Edit">
              <Svg>
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.41l-2.34-2.34a1.003 1.003 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </Svg>
            </EditButton>
          )}

          {todo.is_deleted ? (
            <RestoreButton onClick={restoreTodo} aria-label="Restore">
              <Svg>
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6 0 1.63-.66 3.11-1.73 4.19l1.42 1.42C20.11 17.46 21 15.82 21 14c0-4.97-4.03-9-9-9zM6.73 6.73 5.32 5.32C4.45 6.19 4 7.29 4 8.5 4 12.42 7.58 16 11.5 16c1.21 0 2.31-.45 3.18-1.22l-1.41-1.41C12.99 13.88 12.26 14 11.5 14 8.46 14 6 11.54 6 8.5c0-.76.12-1.49.73-2.27z" />
              </Svg>
            </RestoreButton>
          ) : (
            <DeleteButton onClick={deleteTodo} aria-label="Delete">
              <Svg>
                <path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </Svg>
            </DeleteButton>
          )}
        </>
      )}
    </Item>
  );
};

export default TodoItem;
