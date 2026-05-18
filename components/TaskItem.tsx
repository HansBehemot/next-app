import { Task } from "@/types";

interface Props {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        className="w-4 h-4 accent-blue-500 cursor-pointer"
      />
      <span className={`flex-1 text-sm ${task.done ? "line-through text-gray-600" : "text-gray-300"}`}>
        {task.text}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="text-xs text-red-500 hover:text-red-400 transition-colors"
      >
        Usuń
      </button>
    </li>
  );
}
