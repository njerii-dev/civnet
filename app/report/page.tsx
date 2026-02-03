import { createIssue } from "@/app/actions/issueActions";
import { AlertCircle, FileText, MapPin, Tag } from "lucide-react";

export default function ReportPage() {
  return (
    <div className="max-w-2xl mx-auto mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-10 md:p-12 rounded-[2rem] shadow-2xl shadow-brand-primary/10 border-2 border-slate-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-brand-primary rounded-2xl text-white">
            <AlertCircle size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Report an Issue</h1>
            <p className="text-slate-500 font-medium">Help us make your neighborhood better.</p>
          </div>
        </div>

        <form action={createIssue} className="space-y-8">
          <div className="floating-label-group">
            <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2 px-1 flex items-center gap-2">
              <FileText size={16} className="text-brand-primary" />
              Short Title
            </label>
            <input
              id="title"
              name="title"
              placeholder="e.g. Broken street light on Main St"
              className="input-field"
              required
              aria-label="Issue Title"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="floating-label-group">
              <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-2 px-1 flex items-center gap-2">
                <Tag size={16} className="text-brand-primary" />
                Category
              </label>
              <select
                id="category"
                name="category"
                className="input-field appearance-none"
                required
                aria-label="Issue Category"
              >
                <option value="" disabled selected>Select category...</option>
                <option value="Roads">Roads & Pavements</option>
                <option value="Lighting">Street Lighting</option>
                <option value="Waste">Waste Management</option>
                <option value="Water">Water & Sewage</option>
              </select>
            </div>

            <div className="floating-label-group">
              <label htmlFor="location" className="block text-sm font-bold text-slate-700 mb-2 px-1 flex items-center gap-2">
                <MapPin size={16} className="text-brand-primary" />
                Neighborhood
              </label>
              <input
                id="location"
                name="location"
                placeholder="e.g. Morningside"
                className="input-field"
                aria-label="Neighborhood"
              />
            </div>
          </div>

          <div className="floating-label-group">
            <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-2 px-1">
              Detailed Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Please provide as much detail as possible to help us resolve the issue quickly..."
              className="input-field min-h-[150px]"
              rows={4}
              required
              aria-label="Detailed Description"
            />
          </div>

          <button type="submit" className="btn-primary w-full py-5 text-xl shadow-brand-primary/30 mt-4">
            Submit Report
          </button>
        </form>
      </div>

      <div className="mt-8 p-6 bg-brand-accent/5 rounded-2xl border-2 border-brand-accent/10 flex gap-4">
        <AlertCircle className="text-brand-accent shrink-0" size={24} />
        <p className="text-sm text-slate-600 font-medium">
          <strong>Important:</strong> Please do not use this form for life-threatening emergencies. Call emergency services immediately if there is an immediate danger.
        </p>
      </div>
    </div>
  );
}
