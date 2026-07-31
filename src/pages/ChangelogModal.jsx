import { useState, useEffect } from "react";

const LAST_SEEN_KEY = "changelog_last_seen";

// Change this when updating something new
const CURRENT_VERSION = "2026-07-31";

export default function ChangelogModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
    if (!lastSeen || lastSeen < CURRENT_VERSION) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = (dontShowAgain = false) => {
    if (dontShowAgain) {
      localStorage.setItem(LAST_SEEN_KEY, CURRENT_VERSION);
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 h-full p-4 overflow-auto text-xs md:text-base">
      <div className="bg-white rounded-2xl max-w-4xl w-full md:p-12 p-4 h-3/4 shadow-2xl ">
        <h2 className="text-2xl font-bold mb-4">What's New 🎉</h2>

        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-semibold text-lg">Jul 31, 2026 Update</h3>
            <ul className="list-disc pl-5 text-gray-700 ">
              <li>
                <span className="font-extrabold">Notifications</span> - New
                tasks are now highlighted, bell icon located in the header shows
                how many are unread. Click the bell icon to clear the view.
              </li>
              <li>
                <span className="font-extrabold">Trolley Mapper</span> - Added
                pallets, trees and loose trollies that can be added to each load
                map.
              </li>
              <li>
                <span className="font-extrabold">Tasks </span>- Each task now
                has a history section showing each update the task has been
                through.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Jul 2, 2026 Update</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                Dark mode is now available. Click the icon located within the
                sidebar menu to switch between light and dark mode. Your
                preference will be saved in your browser.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Jan 8, 2026 Update</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                Delivery Runs page now shows the full ordered list of customers
                directly on each run
              </li>
              <li>
                Trolley Mapper printing improved to use the full page/screen
                (recommended: landscape orientation)
              </li>
              <li>
                Daylist printing optimized for smaller file sizes + better
                scaling (recommended: portrait orientation)
              </li>
            </ul>
          </div>
          {/* Add more version blocks here later */}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" id="dontshow" className="w-4 h-4" />
            <span className="text-sm text-gray-600">Don't show again</span>
          </label>

          <button
            onClick={() => {
              const dontShow = document.getElementById("dontshow").checked;
              handleClose(dontShow);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
