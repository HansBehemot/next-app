import TasksClient from "@/components/TasksClient";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function TasksPage() {
  return (
    <ErrorBoundary>
      <TasksClient />
    </ErrorBoundary>
  );
}
