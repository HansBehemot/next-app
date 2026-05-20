"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types";
import TaskItem from "./TaskItem";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const API = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/tasks`;

export default function TasksClient() {
  const [input, setInput] = useState("");
  const { token } = useAuth();
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const sessionLoading = status === "loading";
  const isLoggedIn = token || session;

  const headers = (): Record<string, string> => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  };

  // useQuery zastępuje: useState(tasks) + useEffect + fetchTasks + setLoading
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch(`${API}?_=${Date.now()}`, { headers: headers() });
      return res.json() as Promise<Task[]>;
    },
    enabled: !sessionLoading && !!isLoggedIn,
  });

  // useMutation zastępuje: async function addTask() + ręczne fetchTasks()
  const addMutation = useMutation({
    mutationFn: async (text: string) => {
      await fetch(API, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ text }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setInput("");
      toast.success("Zadanie dodane");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (task: Task) => {
      await fetch(`${API}/${task.id}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ done: !task.done }),
      });
    },
    onSuccess: (_, task) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(task.done ? "Oznaczono jako nieukończone" : "Oznaczono jako ukończone");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${API}/${id}`, { method: "DELETE", headers: headers() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Zadanie usunięte");
    },
  });

  if (sessionLoading) {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <p className="text-gray-500">Ładowanie...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    router.push("/login");
    return null;
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-white mb-6">Lista zadań</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addMutation.mutate(input.trim())}
          placeholder="Nowe zadanie..."
          className="flex-1 bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => addMutation.mutate(input.trim())}
          disabled={!input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Dodaj
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-sm">Ładowanie zadań...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={(id) => toggleMutation.mutate(tasks.find((t) => t.id === id)!)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </ul>
      )}

      <p className="text-sm text-gray-600 mt-4">
        {tasks.filter((t) => !t.done).length} zadań do zrobienia
      </p>
    </div>
  );
}
