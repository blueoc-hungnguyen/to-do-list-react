import { useState, useEffect } from "react";
import styled from "styled-components";
import TodoList from "./components/TodoList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const InputRow = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const AddButton = styled.button`
  margin-left: 10px;
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
`;

const FilterButton = styled.button`
  background: ${(props) => (props.active ? "#007bff" : "#e9ecef")};
  color: ${(props) => (props.active ? "white" : "black")};
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #007bff;
    color: white;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? '#dc3545' : '#28a745'};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    opacity: 0.9;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0;
`;

const TodoListWrapper = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin: 20px 0;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const BottomActionRow = styled(ActionRow)`
  margin-top: 20px;
  padding-top: 5px;
`;

const Footer = styled.footer`
  text-align: center;
  color: #555;
  font-size: 13px;
  line-height: 1.6;
  padding: 14px 0 20px;
`;

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("todos")) || [];
    return saved.map((t, i) => (t.id ? t : { ...t, id: Date.now() + i }));
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === "") return;
    const textToAdd = input.trim();
    setTodos([
      ...todos,
      { id: Date.now(), text: input, completed: false, is_deleted: false },
    ]);
    toast.success(`Added "${textToAdd}"`);
    setInput("");
  };

  const toggleTodo = (id) => {
    const current = todos.find((t) => t.id === id);
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
    if (current) {
      if (!current.completed) toast.info(`Completed "${current.text}"`);
      else toast.info(`Marked "${current.text}" active`);
    }
  };

  const deleteTodo = (id) => {
    const current = todos.find((t) => t.id === id);
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, is_deleted: true } : todo
    );
    setTodos(updated);
    if (current) toast.warn(`Deleted "${current.text}"`);
  };

  const restoreTodo = (id) => {
    const current = todos.find((t) => t.id === id);
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, is_deleted: false } : todo
    );
    setTodos(updated);
    if (current) toast.success(`Restored "${current.text}"`);
  };

  const editTodo = (id, newText) => {
    const current = todos.find((t) => t.id === id);
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    setTodos(updated);
    if (current) toast.info(`Updated "${current.text}" → "${newText}"`);
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to delete all tasks?')) {
      if (filter === 'deleted') {
        setTodos(todos.filter(todo => !todo.is_deleted));
        toast.warn('Permanently deleted all items from trash');
      } else {
        const updated = todos.map(todo => ({ ...todo, is_deleted: true }));
        setTodos(updated);
        toast.warn('Moved all items to trash');
      }
    }
  };

  const makeAllDone = () => {
    const updated = todos.map(todo => 
      todo.is_deleted ? todo : { ...todo, completed: true }
    );
    setTodos(updated);
    toast.success('Marked all tasks as complete');
  };

  const makeAllActive = () => {
    const updated = todos.map(todo => 
      todo.is_deleted ? todo : { ...todo, completed: false }
    );
    setTodos(updated);
    toast.info('Marked all tasks as active');
  };

  const restoreAll = () => {
    if (!window.confirm("Restore all items from trash?")) return;
    const updated = todos.map(todo => (todo.is_deleted ? { ...todo, is_deleted: false } : todo));
    setTodos(updated);
    toast.success("Restored all items from trash");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "deleted") return todo.is_deleted;
    if (todo.is_deleted) return false;
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  return (
    <Container>
      <Title>Todo List</Title>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop />
      <InputRow>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
        />
        <AddButton onClick={addTodo}>Add</AddButton>
      </InputRow>

      <FilterRow>
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All</FilterButton>
        <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>Active</FilterButton>
        <FilterButton active={filter === "completed"} onClick={() => setFilter("completed")}>Completed</FilterButton>
        <FilterButton active={filter === "deleted"} onClick={() => setFilter("deleted")}>Deleted</FilterButton>
      </FilterRow>

      <TodoListWrapper>
        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          restoreTodo={restoreTodo}
          editTodo={editTodo}
        />
      </TodoListWrapper>

      <BottomActionRow>
        {filter === "deleted" ? (
          <>
            <ActionButton onClick={restoreAll}>
              Restore All
            </ActionButton>
            <ActionButton danger onClick={clearAll}>
              Clear Trash
            </ActionButton>
          </>
         ) : filter === "completed" ? (
           <>
             <ActionButton onClick={makeAllActive}>
               Make All Active
             </ActionButton>
             <ActionButton danger onClick={clearAll}>
               Clear All
             </ActionButton>
           </>
         ) : (
           <>
             <ActionButton onClick={makeAllDone}>
               Make All Done
             </ActionButton>
             <ActionButton danger onClick={clearAll}>
               Clear All
             </ActionButton>
           </>
         )}
      </BottomActionRow>

      <Footer>
        Contact: hung.nguyen@blueoc.tech<br />
        © Hung-Nguyen {new Date().getFullYear()}.
      </Footer>
    </Container>
  );
}

export default App;
