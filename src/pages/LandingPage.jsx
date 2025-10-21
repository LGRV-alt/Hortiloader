import React from "react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          <a href="/" className="text-lg font-bold tracking-tight">
            🌿 Hortiloader
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-slate-950">
              Features
            </a>
            <a href="#how" className="hover:text-slate-950">
              How it Works
            </a>
            <a href="#contact" className="hover:text-slate-950">
              Contact
            </a>
          </nav>
          <div className="flex gap-3">
            <a
              href="/login"
              className="px-4 py-2 text-sm rounded-lg border hover:bg-slate-100"
            >
              Log In
            </a>
            <a
              href="/signup"
              className="px-4 py-2 text-sm rounded-lg bg-slate-900 text-white hover:bg-slate-800"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20 px-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Manage horticultural orders and deliveries with ease.
        </h1>
        <p className="text-slate-600 max-w-2xl mb-8">
          Hortiloader helps garden centres and suppliers organise orders, track
          loads, and simplify daily operations — all in one tool.
        </p>
        <div className="flex gap-4">
          <a
            href="/signup"
            className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            Try it Free
          </a>
          <a
            href="#features"
            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-8">Key Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Fast Order Creation",
                desc: "Quickly add and update orders with an intuitive interface.",
              },
              {
                title: "Track Loading Progress",
                desc: "See which trolleys are ready, in progress, or on the truck.",
              },
              {
                title: "Mobile Friendly",
                desc: "Works seamlessly across desktop, tablet, and phone.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="border rounded-2xl p-6 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-8">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            {[
              {
                step: "1",
                title: "Create Orders",
                desc: "Add customer orders or import existing data.",
              },
              {
                step: "2",
                title: "Pick & Load",
                desc: "Organise items by trolley and monitor loading progress.",
              },
              {
                step: "3",
                title: "Deliver & Confirm",
                desc: "Track deliveries and keep your records synced.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="border rounded-2xl p-6 bg-white hover:shadow-sm transition"
              >
                <div className="text-emerald-600 font-bold text-lg mb-2">
                  Step {s.step}
                </div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-slate-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to streamline your orders?
        </h2>
        <p className="mb-6 text-emerald-100">
          Join other garden centres using Hortiloader today.
        </p>
        <a
          href="/signup"
          className="px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50"
        >
          Get Started
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-600">
        <p>© {new Date().getFullYear()} Hortiloader. All rights reserved.</p>
        <div className="mt-3 flex justify-center gap-4">
          <a href="/privacy" className="hover:text-slate-950">
            Privacy
          </a>
          <a href="/terms" className="hover:text-slate-950">
            Terms
          </a>
          <a href="/login" className="hover:text-slate-950">
            Login
          </a>
        </div>
      </footer>
    </div>
  );
}
