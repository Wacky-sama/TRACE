import { Moon, Sun } from "lucide-react";
import ThemeToggle from "../../../components/ThemeToggle";
import { useTheme } from "../../../context/ThemeProvider";

const AlumniSystemPreference = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize how the interface looks just for you
        </p>
      </div>

      <div className="p-6 transition-all border rounded-lg shadow-sm border-border bg-card hover:shadow-md">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary/20 text-secondary-foreground"
              }`}
            >
              {isDark ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Dark Mode</h3>
              <p className="text-sm text-muted-foreground">
                {isDark ? "Dark theme active" : "Light theme active"}
              </p>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Theme preference syncs across all your sessions
      </div>
    </div>
  );
};

export default AlumniSystemPreference;