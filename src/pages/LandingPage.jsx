import React from "react";
import { Link } from "react-router-dom";
import LogoTree from "../Components/svg/LogoTree";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-main text-white top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-3">
            <LogoTree height="40px" width="40px" />
            <a
              href="/"
              className="text-3xl md:text-4xl font-display font-semi-bold tracking-tight"
            >
              Hortiloader
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <a
              href="#features"
              className="hover:bg-white hover:rounded-full hover:bg-opacity-15 p-4"
            >
              Features
            </a>
            <a
              href="#how"
              className="hover:bg-white hover:rounded-full hover:bg-opacity-15 p-4"
            >
              How it Works
            </a>
            <a
              href="#about"
              className="hover:bg-white hover:rounded-full hover:bg-opacity-15 p-4"
            >
              About
            </a>
            <a
              href="#contact"
              className="hover:bg-white hover:rounded-full hover:bg-opacity-15 p-4"
            >
              Contact
            </a>
          </nav>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="p-2 md:px-4 text-sm rounded-lg border hover:bg-slate-700"
            >
              Log In
            </Link>
            <Link
              to="/login"
              className="p-2 text-sm rounded-lg bg-green-600  hover:bg-green-700"
            >
              Get Started
            </Link>
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
          loads and simplify daily operations — all in one tool.
        </p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            Try it Free
          </Link>
          {/* <a
            href="#features"
            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
          >
            Learn More
          </a> */}
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
                desc: "See which trolleys are ready, in progress or on the truck.",
              },
              {
                title: "Loading Sheets",
                desc: "Group orders together in a clear map to assist in the loading and delivery of each load.",
              },
              {
                title: "Trolley Tracking",
                desc: "Trolley movements can be logged and tracked with total numbers easily shown at a glance.",
              },
              {
                title: "Account Control",
                desc: "Add team accounts with role based permissions to fit your business.",
              },
              {
                title: "Picture/File Upload",
                desc: "Attach photos and files to each order.",
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
                desc: "Add customer orders or tasks.",
              },
              {
                step: "2",
                title: "Pick & Load",
                desc: "Orders organised by weekdays and weeks, monitor status of tasks at a glance.",
              },
              {
                step: "3",
                title: "Deliver & Confirm",
                desc: "Complete orders can be grouped together and delivery sheets produced.",
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
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50"
        >
          Get Started
        </Link>
      </section>

      <section id="about" className="py-16 bg-white border-t">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">About Hortiloader</h2>
          <p className="text-slate-600 text-sm leading-relaxed max-w-2xl mx-auto">
            Hortiloader is a side project built out of a love for plants and
            practical tools. It started as a hobby idea to make organising
            horticultural orders and trolleys a little easier.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed mt-3 max-w-2xl mx-auto">
            It’s currently in <span className="font-semibold">beta</span> — that
            means it’s still growing and may change over time. Feel free to
            explore, test it out and share feedback if you find it useful!
          </p>
          <p className="text-slate-500 text-xs mt-6 max-w-2xl mx-auto">
            This project is shared freely as a hobby and learning experience.
            There are no guarantees or support obligations but you’re very
            welcome to use it and see what you think.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="border-t bg-slate-50 border-slate-200 py-8 text-center text-sm text-slate-600"
      >
        <p>© {new Date().getFullYear()} Hortiloader. All rights reserved.</p>
        <p className="mt-2 text-xs text-slate-500">
          Version 0.9 – Beta release. Hortiloader is a personal project shared
          for testing and feedback. No warranties or guarantees are provided.
        </p>
        <div className="mt-3 flex justify-center gap-4">
          <Link to="/privacy" className="hover:text-slate-950">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-slate-950">
            Terms
          </Link>
          <Link to="/login" className="hover:text-slate-950">
            Login
          </Link>
          <a
            className="hover:text-slate-950"
            href="mailto:support@hortiloader.com"
          >
            Email Us
          </a>
        </div>
      </footer>
    </div>
  );
}
