import { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeProvider";

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

const AlumniSystemPreference = () => {
  const isDark = useDarkMode();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-4">
      <h2 className="mb-4 text-xl font-semibold">System Preference</h2>
      <div className="flex items-center justify-between">
        <span
          lassName={`text-2xl sm:text-3xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Dark Mode
        </span>
        <button
          onClick={toggleTheme}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            theme === "dark"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
          }`}
        >
          {theme === "dark" ? "Ligth Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
};

export default AlumniSystemPreference;
