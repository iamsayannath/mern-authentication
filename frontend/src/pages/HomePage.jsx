export default function HomePage({ user, onLogout }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user.username}!</h1>
        <p className="text-gray-700">Email: {user.email}</p>
        <button onClick={onLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </div>
  );
}
