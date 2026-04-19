import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";

/**
 * Compact icon button that cycles between light and dark mode.
 * Reads/writes the theme via the existing ThemeProvider context.
 */
const ThemeToggle = ({ className = "" }) => {
  const { theme, setTheme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`p-2.5 text-on-surface-variant hover:text-secondary transition-colors ${className}`}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
