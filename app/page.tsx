import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 -z-10 rounded-l-[100px]" />

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 text-brand-accent text-sm font-extrabold animate-pulse">
              <Zap size={16} />
              <span>MODERNIZING CITY SERVICES</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Empowering Citizens, <br />
              <span className="text-brand-primary">Improving Communities</span>
            </h1>
            <p className="max-w-2xl text-xl text-slate-600 leading-relaxed font-medium">
              Report local issues, track progress in real-time, and collaborate with your city officials to create a better environment for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 mt-4">
              <Link
                href="/report"
                className="btn-primary text-xl px-10 py-5 group shadow-brand-primary/30"
              >
                Report an Issue
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard/citizens"
                className="flex items-center justify-center gap-2 px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all hover:border-brand-primary/30 shadow-sm"
              >
                View Dashboard
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative z-10 animate-fade-in">
              <Image
                src="/hero.png"
                alt="Civnet Illustration"
                width={600}
                height={600}
                className="rounded-3xl shadow-2xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-brand-accent/10 -z-10 rounded-3xl" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-10">
        {[
          {
            icon: <MapPin className="text-brand-primary" size={40} />,
            title: "Precision Reporting",
            description: "Pinpoint issues precisely on the map for faster response from maintenance teams."
          },
          {
            icon: <ShieldCheck className="text-brand-primary" size={40} />,
            title: "Real-time Tracking",
            description: "Stay informed with status changes from 'Submitted' to 'In Progress' and 'Resolved'."
          },
          {
            icon: <CheckCircle2 className="text-brand-primary" size={40} />,
            title: "Verified Resolution",
            description: "Get photographic evidence once the issue has been addressed by city officials."
          }
        ].map((feature, i) => (
          <div key={i} className="group p-10 bg-white rounded-3xl border-2 border-slate-100 shadow-xl hover:shadow-2xl hover:border-brand-primary/20 transition-all duration-300">
            <div className="mb-6 p-4 bg-brand-primary/5 rounded-2xl inline-block group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-extrabold mb-4 text-slate-900">{feature.title}</h3>
            <p className="text-slate-600 font-medium leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

