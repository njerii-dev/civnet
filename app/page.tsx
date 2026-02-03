import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
        <div className="flex flex-col items-center text-center gap-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold animate-fade-in">
            <Zap size={14} />
            <span>Modernizing City Services</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 balance">
            Empowering Citizens, <br />
            <span className="text-blue-600">Improving Communities</span>
          </h1>
          <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
            Report local issues, track progress in real-time, and collaborate with your city officials to create a better environment for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/report"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-200"
            >
              Report an Issue
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard/citizens"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <MapPin className="text-blue-600" size={32} />,
            title: "Location Tracking",
            description: "Pinpoint issues precisely on the map for faster response from maintenance teams."
          },
          {
            icon: <ShieldCheck className="text-blue-600" size={32} />,
            title: "Real-time Updates",
            description: "Stay informed with status changes from 'Submitted' to 'In Progress' and 'Resolved'."
          },
          {
            icon: <CheckCircle2 className="text-blue-600" size={32} />,
            title: "Verified Results",
            description: "Get photographic evidence once the issue has been addressed by city officials."
          }
        ].map((feature, i) => (
          <div key={i} className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
            <p className="text-slate-600">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
