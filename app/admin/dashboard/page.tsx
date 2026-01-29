import { redirect } from 'next/navigation';
// Imagine we have a way to get the current user, like a cookie or session
// For now, let's keep it simple.

export default function AdminDashboard() {
  // Logic: If user is not an admin, kick them back to the citizen dashboard
  const isAdmin = true; // This will be a real check later!

  if (!isAdmin) {
    redirect('/dashboard');
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-red-600">City Official Dashboard</h1>
      <p className="mt-2 text-gray-600">Review and manage all community reports here.</p>
      
      {/* This is where the list of all reported potholes/issues will go */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Reports</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Issue</th>
              <th className="py-2">Category</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">Pothole on Main St</td>
              <td className="py-2">Roads</td>
              <td className="py-2 text-yellow-600 font-bold">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}