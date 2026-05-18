import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string };
  address: { city: string; street: string };
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: Props) {
  const { id } = await params;
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const user: User = await res.json();

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <Link href="/users" className="text-gray-500 hover:text-white text-sm transition-colors">
        ← Wróć do listy
      </Link>

      <div className="bg-gray-900 rounded-2xl p-6 mt-4">
        <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
        <p className="text-blue-400 text-sm mb-6">{user.company.name}</p>

        <div className="flex flex-col gap-3">
          <Row label="Email" value={user.email} />
          <Row label="Telefon" value={user.phone} />
          <Row label="Strona" value={user.website} />
          <Row label="Miasto" value={user.address.city} />
          <Row label="Ulica" value={user.address.street} />
        </div>

        <p className="text-gray-600 text-xs mt-6 italic">{user.company.catchPhrase}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-800 pb-2">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-300 text-sm">{value}</span>
    </div>
  );
}
