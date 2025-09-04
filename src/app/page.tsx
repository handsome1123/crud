"use client";

import { useState, useEffect } from "react";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  async function fetchTodos() {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    fetchTodos();
  }

  async function toggleComplete(id: string, completed: boolean) {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTodos();
  }

  async function deleteTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Next.js + MongoDB CRUD</h1>

      <form onSubmit={addTodo} className="mt-4 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {todos.map((todo) => (
          <li key={todo._id} className="flex justify-between items-center border p-2 rounded">
            <span
              onClick={() => toggleComplete(todo._id, todo.completed)}
              className={todo.completed ? "line-through cursor-pointer" : "cursor-pointer"}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
