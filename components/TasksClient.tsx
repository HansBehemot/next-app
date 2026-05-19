"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Task } from "@/types";
import TaskItem from "./TaskItem";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const API = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/tasks`;

export default function TasksClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { data: session, status } = useSession();
  const router = useRouter();

  const sessionLoading = status === "loading";
  const isLoggedIn = token || session;

  const fetchTasks = useCallback(async () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API}?_=${Date.now()}`, { headers });
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (sessionLoading) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    fetchTasks();
  }, [fetchTasks, isLoggedIn, sessionLoading]);

  async function addTask() {
    if (input.trim() === "") return;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    await fetch(API, { method: "POST", headers, body: JSON.stringify({ text: input }) });
    setInput("");
    await fetchTasks();
    toast.success("Zadanie dodane");
  }

  async function toggleTask(id: number) {
    const task = tasks.find((t) => t.id === id)!;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    await fetch(`${API}/${id}`, { method: "PUT", headers, body: JSON.stringify({ done: !task.done }) });
    await fetchTasks();
    toast.success(task.done ? "Oznaczono jako nieukończone" : "Oznaczono jako ukończone");
  }

  async function deleteTask(id: number) {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    await fetch(`${API}/${id}`, { method: "DELETE", headers });
    await fetchTasks();
    toast.success("Zadanie usunięte");
  }

  if (sessionLoading || loading) {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <p className="text-gray-500">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-white mb-6">Lista zadań</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Nowe zadanie..."
          className="flex-1 bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Dodaj
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
        ))}
      </ul>

      <p className="text-sm text-gray-600 mt-4">
        {tasks.filter((t) => !t.done).length} zadań do zrobienia
      </p>
    </div>
  );
}
