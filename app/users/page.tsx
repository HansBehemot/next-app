import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

export default async function UsersPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users: User[] = await res.json();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-white mb-6">Użytkownicy</h1>
      <ul className="flex flex-col gap-3">
        {users.map((user) => (
          <li key={user.id}>
            <Link
              href={`/users/${user.id}`}
              className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 rounded-xl px-5 py-4 transition-colors"
            >
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
              <span className="text-gray-600 text-sm">{user.company.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
