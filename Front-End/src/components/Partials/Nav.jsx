import { SidebarTrigger } from "../ui/sidebar";
import { useLocation } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { useAdminContext } from "../../../api/context/AdminContext";
import { HoverCardUser } from "../ui/hoverCardUser";
import { ChevronRight } from "lucide-react";

function Nav() {
  const location = useLocation();
  const { admin } = useAdminContext();

  const segments = location.pathname
    .replace(/^\/dashboard/, "")
    .split("/")
    .filter(Boolean);

  const fmt = (s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <nav className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60 px-5 shadow-sm">
      {/* Left: trigger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="-ml-1 flex-shrink-0 p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" />
        <div className="flex items-center gap-1 text-sm min-w-0">
          <span className="text-slate-400 dark:text-slate-500 hidden sm:inline font-medium">Dashboard</span>
          {segments.map((seg, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight size={13} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
              <span
                className={
                  i === segments.length - 1
                    ? "font-semibold text-slate-800 dark:text-white truncate"
                    : "text-slate-400 dark:text-slate-500 hidden sm:inline truncate"
                }
              >
                {fmt(seg)}
              </span>
            </span>
          ))}
          {segments.length === 0 && (
            <span className="flex items-center gap-1">
              <ChevronRight size={13} className="text-slate-300 dark:text-slate-600" />
              <span className="font-semibold text-slate-800 dark:text-white">Overview</span>
            </span>
          )}
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <ModeToggle />
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
        <HoverCardUser admin={admin} />
      </div>
    </nav>
  );
}

export default Nav;
