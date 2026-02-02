import { createIssue } from "@/actions/issueActions";

export default function ReportPage() {
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md border mt-10">
      <h1 className="text-2xl font-bold mb-6">Report a New Issue</h1>
      <form action={createIssue} className="space-y-4">
        <input name="title" placeholder="Title (e.g. Street light out)" className="w-full p-2 border rounded" required />
        <select name="category" className="w-full p-2 border rounded bg-white">
          <option value="Roads">Roads</option>
          <option value="Lighting">Lighting</option>
          <option value="Waste">Waste</option>
        </select>
        <textarea name="description" placeholder="Describe the problem..." className="w-full p-2 border rounded" rows={4} required />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
          Submit Report
        </button>
      </form>
    </div>
  );
}