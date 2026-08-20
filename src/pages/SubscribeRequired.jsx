import toast from "react-hot-toast";
import { signout } from "../api/pocketbase";
import HortiLoaderWordmark from "../Components/svg/HortiLoaderWordmark";

const PAYMENT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK;

export default function SubscribeRequired() {
  function handleSubscribeClick(e) {
    if (!PAYMENT_LINK) {
      e.preventDefault();
      toast.error("Subscribing isn't set up yet — contact support.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-6 px-6 text-center dark:bg-darkMain dark:text-white bg-slate-50">
      <HortiLoaderWordmark height="40px" />
      <div className="max-w-md">
        <h1 className="text-2xl font-bold mb-2">Your free trial has ended</h1>
        <p className="dark:text-slate-300 text-slate-600">
          Subscribe for £49.99/month to keep using Hortiloader.
        </p>
      </div>
      <a
        href={PAYMENT_LINK || "#"}
        onClick={handleSubscribeClick}
        className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
      >
        Subscribe — £49.99/month
      </a>
      <button
        onClick={signout}
        className="text-sm dark:text-slate-400 text-slate-500 hover:underline"
      >
        Log out
      </button>
    </div>
  );
}
