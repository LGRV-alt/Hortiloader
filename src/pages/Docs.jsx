import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaRocket,
  FaTable,
  FaEdit,
  FaBoxOpen,
  FaSearch,
  FaDolly,
  FaRoute,
  FaTags,
  FaCog,
  FaClipboardList,
  FaChevronRight,
} from "react-icons/fa";
import HortiLoaderWordmark from "../Components/svg/HortiLoaderWordmark";
import useAuth from "../hooks/useAuth";

const DOCS_NAV = [
  {
    group: "Overview",
    items: [
      { slug: "getting-started", title: "Getting Started", icon: FaRocket },
    ],
  },
  {
    group: "Daily Workflow",
    items: [
      { slug: "board", title: "The Board & Tasks", icon: FaTable },
      { slug: "editing-tasks", title: "Editing & Viewing Tasks", icon: FaEdit },
      { slug: "collections", title: "Collections", icon: FaBoxOpen },
      { slug: "search", title: "Search", icon: FaSearch },
    ],
  },
  {
    group: "Trolleys & Deliveries",
    items: [
      { slug: "trolley-tracker", title: "Trolley Tracking", icon: FaDolly },
      {
        slug: "trolley-mapper",
        title: "Trolley Mapper & Delivery Runs",
        icon: FaRoute,
      },
    ],
  },
  {
    group: "Tools & Administration",
    items: [
      { slug: "label-manager", title: "Label Manager", icon: FaTags },
      { slug: "settings", title: "Settings", icon: FaCog },
      { slug: "admin-logs", title: "Admin Logs", icon: FaClipboardList },
    ],
  },
];

const DOCS_SECTIONS = {
  "getting-started": {
    title: "Getting Started",
    description:
      "A quick orientation before your first delivery week — what HortiLoader is and how to sign in.",
    subsections: [
      {
        heading: "What is HortiLoader?",
        body: [
          "HortiLoader is a shared whiteboard and calendar for planning weekly deliveries and tasks and tracking trolleys. Everyone on your team works against the same board and changes sync automatically so you always see up to date information.",
        ],
      },
      {
        heading: "Signing in",
        body: [
          "Log in with your organization name, username and password — all three are required. ",
          "If you don't have an account yet, ask an admin at your organization to create one for you. Admins can add accounts from the Settings page.",
        ],
      },
      {
        heading: "Finding your way around",
        body: [
          "The header along the top gives you week/year navigation, quick actions and a menu with links to every area of the app. Most day-to-day work happens on the main board.",
        ],
      },
    ],
    callout: {
      type: "note",
      text: "New here? Start with The Board & Tasks to see how weekly deliveries are organized day by day.",
    },
  },
  board: {
    title: "The Board & Tasks",
    description:
      "The main board is where weekly deliveries and tasks are planned, reordered and tracked day by day.",
    subsections: [
      {
        heading: "Viewing the board",
        body: [
          "The board shows tasks laid out across the days of the current week. Use the week and year controls in the header to move backward or forward in time.",
        ],
      },
      {
        heading: "Moving tasks around",
        body: [
          "Click a task to open it, then update its proposed day from there — an easy way to keep the week current.",
        ],
      },
      {
        heading: "Task status at a glance",
        body: [
          "Each task card is designed to be scannable — you should be able to tell what's outstanding for a given day without opening anything. Icons show load status and colours indicate different customer or task types. On desktop, hovering over a task name will also display any saved notes.",
        ],
      },
    ],
  },
  "editing-tasks": {
    title: "Editing & Viewing Tasks",
    description:
      "Open any task to see full details, make changes or remove it from the board.",
    subsections: [
      {
        heading: "Opening a task",
        body: [
          "Selecting a task from the board opens a detailed view with everything recorded against it — customer, quantities and delivery information.",
        ],
      },
      {
        heading: "Editing details",
        body: [
          "From the detailed view you can update any of a task's information. Changes are saved back to the shared board so other users see them right away.",
        ],
      },
      {
        heading: "Deleting a task",
        body: [
          "Deleting a task doesn't erase it permanently — it's soft-deleted and kept in the Admin Logs, so a record of past work is preserved even after it leaves the board.",
        ],
      },
    ],
  },
  collections: {
    title: "Collections",
    description:
      "Track tasks that need to be picked up separately from the day-by-day delivery board.",
    subsections: [
      {
        heading: "What counts as a collection",
        body: [
          "Some tasks are about collecting stock rather than delivering it. The Collections page brings these together in one place. Although the collections are also found on the main board, this view allows a clear view of the orders for collection.",
        ],
      },
      {
        heading: "Where to find it",
        body: [
          "Open Collections from the header menu. It follows the same chosen week and year as the main board.",
        ],
      },
    ],
  },
  search: {
    title: "Search",
    description:
      "Quickly find a task or customer without scrolling through weeks of the board.",
    subsections: [
      {
        heading: "What you can search",
        body: [
          "Search looks across tasks and customers, so you can jump straight to what you need instead of hunting week by week.",
        ],
      },
      {
        heading: "Tips",
        body: [
          "Search works best with a customer name or a distinctive part of a task's details.",
        ],
      },
    ],
  },
  "trolley-tracker": {
    title: "Trolley Tracking",
    description:
      "Keep an eye on where trolleys are and make sure they make their way back.",
    subsections: [
      {
        heading: "Why trolleys are tracked",
        body: [
          "Trolleys used for deliveries are tracked separately from tasks. Because they're reused across many delivery runs, it's easy for them to go missing without a dedicated view.",
        ],
      },
      {
        heading: "Viewing trolley counts",
        body: [
          "The Trolley Tracker gives you a running view of how many trolleys are currently out with each customer, so outstanding trolleys are easy to spot.",
        ],
      },
    ],
    callout: {
      type: "tip",
      text: "Trolley counts are most useful when kept up to date after every delivery run — see Trolley Mapper & Delivery Runs.",
    },
  },
  "trolley-mapper": {
    title: "Trolley Mapper & Delivery Runs",
    description:
      "Group tasks into a delivery run, plan the route and export it for the day.",
    subsections: [
      {
        heading: "Creating a run",
        body: [
          "Click Create Delivery Group in the header to enter selection mode, where you can pick tasks from the board to add to your list. Once you've selected the tasks you want, create the run — this opens the Trolley Mapper page with those tasks loaded in.",
        ],
      },
      {
        heading: "Task List",
        body: [
          "Once tasks are imported, they're placed in a numbered list. Reorder them with drag and drop to match the delivery sequence.",
        ],
      },
      {
        heading: "Load Map",
        body: [
          "The load map starts as a blank area representing the load space. Use the buttons above to fill a standard 4×6 grid — once you've selected the right number of rows, empty boxes will appear. Click any task/order, then click a box to assign it a name, building a readable map for loading. You can also drag and drop non-fixed items, like pallets or loose trees into place.",
        ],
      },
      {
        heading: "Printing",
        body: [
          "Once the load map is complete, save and print the current view. This opens a print screen where you can check everything is displayed properly — the maps are best viewed in landscape orientation, and a custom scale may be needed depending on your screen size.",
        ],
      },
      {
        heading: "Viewing past runs",
        body: [
          "Every run you create appears under Delivery Runs, where you can review and update its contents at any time.",
        ],
      },
      {
        heading: "Exporting a run",
        body: [
          "Open a run from Delivery Runs to view or export its details for printing or sharing with a driver.",
        ],
      },
    ],
  },
  "label-manager": {
    title: "Label Manager",
    description: "Manage plant labels",
    subsections: [
      {
        heading: "Label stock",
        body: [
          "The Label Manager is used to maintain label stock. You can input the name of a label and mark it as currently in stock or needing printing — this suits an organization that uses print-on-demand services but also keeps some labels in stock on site.",
        ],
      },
      {
        heading: "Naming",
        body: [
          "To keep the list working as intended, label names should stay uniform — even slightly different spelling can create a new item instead of matching an existing one.",
        ],
      },
    ],
  },
  settings: {
    title: "Settings",
    description: "Organization-wide preferences and user management.",
    subsections: [
      {
        heading: "Organization-wide settings",
        body: [
          "The Settings page holds preferences for your organization. Settings are shared across everyone in your organization, not just your own account.",
        ],
      },
      {
        heading: "Who can change settings",
        body: [
          "Admins can also manage team accounts and roles from Settings — this is where new users get added and the weekly headings can be changed or updated.",
        ],
      },
    ],
  },
  "admin-logs": {
    title: "Admin Logs",
    description: "A history of deleted tasks, kept for accountability.",
    subsections: [
      {
        heading: "What's logged",
        body: [
          "Admins can view a log of deleted tasks, including who deleted them and when, giving a history of changes made to the board. Tasks can be permanently deleted or restored from this page.",
        ],
      },
      {
        heading: "Who can access it",
        body: ["This page is only available to users with the admin role."],
      },
    ],
  },
};

const DEFAULT_SLUG = "getting-started";

const CALLOUT_STYLES = {
  note: "border-blue-400 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-500/60",
  tip: "border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-500/60",
};
const CALLOUT_LABELS = { note: "Note", tip: "Tip" };

export default function Docs() {
  const { topic } = useParams();
  const isAuthenticated = useAuth();
  const slug = DOCS_SECTIONS[topic] ? topic : DEFAULT_SLUG;
  const activeSection = DOCS_SECTIONS[slug];

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-white dark:bg-darkMain dark:text-white text-gray-800">
      {/* Sidebar */}
      <aside className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-gray-200 dark:border-darkBorder px-5 py-6 md:sticky md:top-0 md:h-dvh md:overflow-y-auto">
        {!isAuthenticated && (
          <Link to="/" className="inline-flex mb-4">
            <HortiLoaderWordmark height="40px" />
          </Link>
        )}
        <h2 className="text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-3 px-1">
          Documentation
        </h2>
        <nav className="flex flex-col gap-5">
          {DOCS_NAV.map((group) => (
            <div key={group.group}>
              <p className="text-[11px] font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-1.5 px-3">
                {group.group}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const isActive = item.slug === slug;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.slug}
                      to={`/docs/${item.slug}`}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white font-medium"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkSecondary"
                      }`}
                    >
                      <Icon
                        className={isActive ? "opacity-90" : "opacity-60"}
                        size={13}
                      />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-6 md:px-12 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-3">
            <span>Docs</span>
            <FaChevronRight size={8} />
            <span>{activeSection.title}</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            {activeSection.title}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
            {activeSection.description}
          </p>

          <div className="border-t border-gray-200 dark:border-darkBorder" />

          {activeSection.subsections.map((sub, i) => (
            <section
              key={sub.heading}
              id={sub.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              className={i === 0 ? "mt-8" : "mt-10"}
            >
              <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-gray-100 dark:border-darkBorder/60">
                {sub.heading}
              </h2>
              <div className="space-y-3 text-[15px] leading-7 text-gray-700 dark:text-gray-300">
                {sub.body.map((paragraph, j) => (
                  <p key={j}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          {activeSection.callout && (
            <div
              className={`border-l-4 rounded-r-md px-4 py-3 text-sm mt-8 ${
                CALLOUT_STYLES[activeSection.callout.type]
              }`}
            >
              <p className="font-semibold mb-1">
                {CALLOUT_LABELS[activeSection.callout.type]}
              </p>
              <p>{activeSection.callout.text}</p>
            </div>
          )}
        </div>
      </main>

      {/* On this page */}
      <aside className="hidden xl:block w-56 shrink-0 px-6 py-12">
        <div className="sticky top-12">
          <p className="text-[11px] font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-3">
            On this page
          </p>
          <nav className="flex flex-col gap-2 border-l border-gray-200 dark:border-darkBorder">
            {activeSection.subsections.map((sub) => (
              <a
                key={sub.heading}
                // href={`#${sub.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="pl-3 -ml-px text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 border-l border-transparent hover:border-blue-500 transition-colors"
              >
                {sub.heading}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
