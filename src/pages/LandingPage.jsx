import React from "react";
import { Link } from "react-router-dom";
import LogoTree from "../Components/svg/LogoTree";
import HortiLoaderWordmark from "../Components/svg/HortiLoaderWordmark";
import DarkmodeToggle from "../Components/DarkmodeToggle";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-darkMain dark:text-white bg-slate-50">
      {/* Header */}
      <header className="w-full border-b-2 border-darkBorder bg-main dark:bg-darkMain text-white top-0 z-30">
        <div className="max-w-full h-16  mx-auto flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-1">
            <span className="hidden">
              <LogoTree className="hidden" height="40px" width="40px" />
            </span>
            <a
              href="/"
              data-testid="landing-page-header"
              className="flex items-center"
            >
              <HortiLoaderWordmark height="40px" />
            </a>
          </div>
          <nav className="hidden md:flex items-center text-gray-300  text-sm">
            <a href="#features" className="hover:text-gray-200 p-2">
              Features
            </a>
            {/* <a href="#how" className="hover:text-white p-2">
              How it Works
            </a> */}
            <a href="#pricing" className="hover:text-white p-2">
              Pricing
            </a>
            {/* <a href="#about" className="hover:text-white p-2">
              About
            </a> */}
            {/* <a href="#contact" className="hover:text-white p-2">
              Contact
            </a> */}
            <Link to="/docs" className="hover:text-white p-2">
              Docs
            </Link>
            <div className="flex gap-2">
              <DarkmodeToggle />
              <Link
                to="/login"
                className="p-2 text-center text-white md:px-4 text-sm rounded-lg bg-green-600  hover:bg-green-700 "
              >
                Log In
              </Link>
              {/* <Link
              to="/login"
              className="p-2 text-xs text-center rounded-lg bg-green-600  hover:border-green-500 border"
            >
              Get Started
            </Link> */}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="dark:bg-darkSecondary flex flex-col items-center text-center py-20 px-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Manage horticultural orders and deliveries with ease.
        </h1>
        <p className="dark:text-slate-300 text-slate-600 max-w-2xl mb-8">
          Hortiloader helps garden centres and suppliers organise orders, track
          loads and simplify daily operations — all in one tool.
        </p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl dark:bg-slate-700 dark:hover:bg-slate-500 bg-slate-900 text-white hover:bg-slate-800"
          >
            Start your free 30-day trial
          </Link>
          {/* <a
            href="#features"
            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
          >
            Learn More
          </a> */}
        </div>
        <p className="dark:text-slate-400 text-slate-500 text-xs mt-4">
          No card required to start. £49.99/month after your trial ends.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 dark:bg-darkMain bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-8">Key Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Fast Order Creation",
                desc: "Quickly add and update orders with an intuitive interface — set the customer, postcode, order details and delivery day in seconds.",
              },
              {
                title: "Weekly Board View",
                desc: "Orders are laid out by day across the week, so your whole team can see what's going out and when, at a glance.",
              },
              {
                title: "Track Loading Progress",
                desc: "See which orders are ready, in progress or loaded, with status updates everyone can see.",
              },
              {
                title: "Loading Sheets",
                desc: "Group orders together in a clear map to assist in the loading and delivery.",
              },
              {
                title: "Trolley Tracking",
                desc: "Trolley movements and exchanges can be logged and tracked with total numbers easily shown at a glance.",
              },
              {
                title: "Account Control",
                desc: "Add team accounts with role based permissions — admin, super user, staff or viewer.",
              },
              {
                title: "Picture/File Upload",
                desc: "Attach photos and files to each order, useful for special instructions or proof of a completed delivery.",
              },
              {
                title: "Search",
                desc: "Quickly find any order or customer without hunting back through old weeks.",
              },
              {
                title: "Multi-User Sync",
                desc: "Everyone works off the same live board, so changes from your team show up for everyone else.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="dark:shadow-darkBorder border-darkBorder border rounded-2xl p-6 hover:shadow-md transition dark:bg-darkMain"
              >
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="dark:text-slate-300 text-slate-600 text-sm">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-16 dark:bg-darkSecondary bg-slate-50">
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
                className="border border-darkBorder rounded-2xl p-6 dark:bg-darkMain bg-white hover:shadow-sm transition"
              >
                <div className="text-emerald-600 font-bold text-lg mb-2">
                  Step {s.step}
                </div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="dark:text-slate-400 text-slate-600 text-sm">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 dark:bg-darkMain bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Simple, Honest Pricing</h2>
          <p className="dark:text-slate-300 text-slate-600 mb-10">
            Try Hortiloader free for 30 days — no card required. Keep using it
            after your trial by subscribing for a single monthly price.
          </p>
          <div className="border border-darkBorder rounded-2xl p-8 dark:bg-darkSecondary bg-slate-50 max-w-sm mx-auto">
            <div className="text-sm font-semibold text-emerald-600 mb-2">
              30-Day Free Trial
            </div>
            <div className="flex items-end justify-center gap-1 mb-1">
              <span className="text-4xl font-extrabold">£49.99</span>
              <span className="dark:text-slate-400 text-slate-500 mb-1">
                /month
              </span>
            </div>
            <p className="dark:text-slate-400 text-slate-500 text-xs mb-6">
              Billed monthly after your free trial ends. Cancel anytime.
            </p>
            <ul className="text-left text-sm dark:text-slate-300 text-slate-600 space-y-2 mb-6">
              <li>✓ Full access to all features</li>
              <li>✓ Unlimited team accounts</li>
              <li>✓ No card required to start your trial</li>
            </ul>
            <Link
              to="/login"
              className="block px-6 py-3 rounded-xl dark:bg-slate-700 dark:hover:bg-slate-500 bg-slate-900 text-white hover:bg-slate-800"
            >
              Start your free trial
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 dark:bg-emerald-900 bg-emerald-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to streamline your orders?
        </h2>
        <p className="mb-6 text-emerald-100">
          Join other garden centres using Hortiloader today — free for 30 days,
          no card required.
        </p>
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50"
        >
          Start your free trial
        </Link>
      </section>

      <section id="about" className="py-16 dark:bg-darkMain bg-white ">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">About Hortiloader</h2>
          <p className="dark:text-slate-400 text-slate-600 text-sm leading-relaxed max-w-2xl mx-auto">
            Hortiloader was built out of a love for plants and practical tools,
            to make organising horticultural orders and trolleys easier for
            garden centres and suppliers.
          </p>
          <p className="dark:text-slate-400 text-slate-600 text-sm leading-relaxed mt-3 max-w-2xl mx-auto">
            We’re always improving Hortiloader based on feedback from the
            businesses using it day to day. If you have suggestions or run into
            any issues, we’d love to hear from you.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="dark:bg-darkSecondary bg-slate-50 py-8 text-center text-sm dark:text-slate-400 text-slate-600"
      >
        <p>© {new Date().getFullYear()} Hortiloader. All rights reserved.</p>
        <p className="mt-2 text-xs dark:text-slate-400 text-slate-500">
          Try Hortiloader free for 30 days, no card required.
        </p>
        <div className="mt-3 flex justify-center gap-4">
          <Link to="/privacy" className="hover:text-slate-950">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-slate-950">
            Terms
          </Link>
          <Link to="/docs" className="hover:text-slate-950">
            Docs
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
