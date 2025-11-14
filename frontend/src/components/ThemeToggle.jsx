/* eslint-disable no-unused-vars */
import { useTheme } from "../hooks/useTheme";
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative inline-flex items-center w-16 h-8 transition-colors rounded-full sm:w-20 sm:h-10 bg-muted group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
    >
      <motion.span
        className="inline-block w-6 h-6 rounded-full shadow-lg sm:w-8 sm:h-8 bg-background"
        animate={{
          x: isDark ? 36 : 4,
        }}
        whileHover={{ scale: 1.1 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <span className="flex items-center justify-center w-full h-full">
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4 h-4 text-yellow-400 sm:w-5 sm:h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </span>
      </motion.span>
    </button>
  );
}