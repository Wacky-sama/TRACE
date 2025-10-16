import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@radix-ui/themes";
import { GraduationCap } from "lucide-react";
import LoginForm from "./LoginForm";
import ThemeToggle from "../ThemeToggle";

function AdminAuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "admin";

  const goToLandingPage = () => {
    navigate("/");
  };

  const getWelcomeMessage = () => {
    switch (role) {
      case "alumni":
        return "Welcome, Alumni!";
      case "admin":
        return "Welcome Back, Admin!";
      default:
        return "Welcome!";
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          {/* Left side: Logo and text */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={goToLandingPage}
          >
            <GraduationCap className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">TRACE</h1>
              <p className="text-xs text-muted-foreground">
                CSU Gonzaga Campus
              </p>
            </div>
          </div>

          {/* Right side: Grouped buttons and ThemeToggle */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/alumni-login")}
              className="px-6 py-3 text-lg font-semibold transition-all duration-200 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:brightness-110 hover:scale-105"
            >
              Alumni Login
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin-login")}
              className="px-6 py-3 text-lg font-semibold transition-all duration-200 rounded-full border-2 border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.1)] hover:scale-105"
            >
              Admin Portal
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="flex items-center justify-center min-h-screen px-4 bg-[hsl(var(--background))]">
        <div className="flex flex-col w-full max-w-4xl overflow-hidden transition-transform duration-300 transform bg-white shadow-lg rounded-xl md:flex-row hover:-translate-y-2">
          <div className="flex items-center justify-center flex-1 p-4 bg-gray-800 md:p-8">
            <div className="text-center">
              <img
                src="/TRACE LOGO.png"
                alt="TRACE Logo"
                className="w-32 h-auto mx-auto mb-4 md:w-48"
              />
              <h3 className="mb-2 text-xl font-semibold text-white">
                {getWelcomeMessage()}
              </h3>
              <p className="text-sm text-gray-200">
                Track, Reconnect, and Connect with Excellence
              </p>
            </div>
          </div>

          <div className="flex-1 p-6 md:p-10 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
            <div className="w-full max-w-md mx-auto text-center">
              <h2 className="mb-6 text-2xl font-semibold">Login</h2>
              <AnimatePresence mode="wait">
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm />
                </motion.div>
              </AnimatePresence>

              <p className="mt-6 text-sm text-gray-500">
                Developed by:
                <br />
                Balgos, Wendel B.
                <br />
                Salviejo, Victor Louis R.
                <br />
                Taguba, Philip Joshua V.
                <br />
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=tabugadirkenjibrocks@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Tabugadir, Kenji "Brocks" I.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminAuthPage;
