import { useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import {
  GraduationCap,
  Calendar,
  Users,
  QrCode,
  FileText,
  UserCircle,
  MessageSquare,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "Event Management",
      description: "Create, manage, and track campus events with ease.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Alumni Directory",
      description: "Approve and manage alumni profiles and registrations.",
    },
    {
      icon: <QrCode className="w-8 h-8 text-primary" />,
      title: "QR Code Check-in",
      description: "Quick event attendance tracking via QR codes.",
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "Employment Forms",
      description: "Track and manage alumni employment information.",
    },
    {
      icon: <UserCircle className="w-8 h-8 text-primary" />,
      title: "Profile Updates",
      description: "Alumni can maintain current contact and career info.",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      title: "Community Engagement",
      description: "Stay connected with campus news and activities.",
    },
  ];

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between px-4 py-3 mx-auto sm:py-4">
          {/* Left side: Logo and text */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={goToHome}
          >
            <GraduationCap className="w-7 h-7 text-primary sm:w-8 sm:h-8" />
            <div>
              <h1 className="text-lg font-bold text-foreground sm:text-xl">
                TRACE
              </h1>
              <p className="text-[10px] text-muted-foreground sm:text-xs">
                CSU Gonzaga Campus
              </p>
            </div>
          </div>

          {/* Right side: Grouped buttons and ThemeToggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              onClick={() => navigate("/login")}
              className={`px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-lg font-semibold transition-all duration-200 rounded-full ${
                location.pathname === "/login" ||
                location.pathname === "/register"
                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:brightness-110 hover:scale-105"
                  : "border-2 border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.1)] hover:scale-105"
              }`}
            >
              Login
            </Button>
              
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(var(--primary)/0.05)] to-[hsl(var(--background))]">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/grid.svg')] bg-center"></div>

        <div className="container relative z-10 flex flex-col items-center justify-center px-4 py-24 mx-auto text-center md:py-32">
          <h2 className="text-4xl font-extrabold md:text-6xl text-[hsl(var(--foreground))] tracking-tight">
            Tracking of Alumni for Centralized Event
          </h2>
          <p className="max-w-2xl mt-6 text-lg text-[hsl(var(--muted-foreground))]">
            Connect with Cagayan State University – Gonzaga Campus alumni
            community. Manage events, update profiles, and stay engaged with
            your alma mater.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[hsl(var(--muted)/0.4)]">
        <div className="container px-4 mx-auto">
          <h3 className="mb-12 text-3xl font-bold text-center text-[hsl(var(--foreground))]">
            Platform Features
          </h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-start p-6 transition-all duration-200 border rounded-2xl border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4">{feature.icon}</div>
                <h4 className="mb-2 text-xl font-semibold">{feature.title}</h4>
                <p className="text-[hsl(var(--muted-foreground))]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-sm text-center border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 backdrop-blur-md text-[hsl(var(--muted-foreground))]">
        © {new Date().getFullYear()} TRACE — CSU Gonzaga Campus. All rights
        reserved.
      </footer>
    </div>
  );
}
