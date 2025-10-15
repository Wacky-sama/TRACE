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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">TRACE</h1>
              <p className="text-xs text-muted-foreground">CSU Gonzaga Campus</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-16 mx-auto md:py-24">
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <h2 className="text-4xl font-bold md:text-5xl text-foreground">
            Tracking Alumni for Centralized Events
          </h2>
          <p className="text-lg text-muted-foreground">
            Connect with Cagayan State University – Gonzaga Campus alumni community. 
            Manage events, update profiles, and stay engaged with your alma mater.
          </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="soft" onClick={() => (window.location.href = "/auth")}>
            Alumni Login
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/admin")}>
            Admin Portal
          </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
       <section className="container px-4 py-16 mx-auto bg-muted/30">
        <h3 className="mb-12 text-3xl font-bold text-center text-foreground">
          Platform Features
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-start p-6 transition-shadow border border-border rounded-2xl hover:shadow-md bg-card"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 mt-auto text-sm text-center border-t border-border text-muted-foreground bg-card/40 backdrop-blur-sm">
        © {new Date().getFullYear()} TRACE — CSU Gonzaga Campus. All rights reserved.
      </footer>
    </div>
  );
}
