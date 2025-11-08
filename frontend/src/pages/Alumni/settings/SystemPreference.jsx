import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../../context/ThemeProvider";

const AlumniSystemPreference = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Appearance
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize how the interface looks just for you
        </p>
      </div>

       <div className="p-6 transition-all border rounded-lg shadow-sm border-border bg-card hover:shadow-md">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? "bg-primary/10 text-primary" 
                : "bg-secondary/20 text-secondary-foreground"
            }`}>
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Dark Mode
              </h3>
              <p className="text-sm text-muted-foreground">
                {isDark ? "Dark theme active" : "Light theme active"}
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="relative inline-flex items-center w-20 h-10 transition-colors rounded-full bg-muted group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            <span
              className={`inline-block h-8 w-8 transform rounded-full bg-background shadow-lg transition-transform group-hover:scale-110 ${
                isDark ? "translate-x-11" : "translate-x-1"
              }`}
            >
              <span className="flex items-center justify-center w-full h-full">
                {isDark ? (
                  <Moon className="w-4 h-4 text-primary" />
                ) : (
                  <Sun className="w-4 h-4 text-secondary" />
                )}
              </span>
            </span>
          </button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Theme preference syncs across all your sessions
      </div>
    </div>
  );
};

export default AlumniSystemPreference;