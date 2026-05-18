import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-white mb-4">Witaj w Todo App</h1>
      <p className="text-gray-400 mb-8">Prosta lista zadań zbudowana w Next.js</p>
      <Link
        href="/tasks"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        Przejdź do zadań
      </Link>
    </div>
  );
}
