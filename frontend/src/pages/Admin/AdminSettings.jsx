/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faMoon,
  faSun,
  faLock,
  faTrash,
  faSave,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";

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

const AdminSettings = () => {
  const isDark = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setCurrentUser(res.data);
        setFormData({
          firstname: res.data.firstname || "",
          lastname: res.data.lastname || "",
          email: res.data.email || "",
        });
      } catch (err) {
        toast.error("Failed to load profile information.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await api.patch("/users/update-profile", formData);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleThemeToggle = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      setTheme("light");
    } else {
      root.classList.add("dark");
      setTheme("dark");
    }
    toast.info(`Switched to ${isDark ? "Light" : "Dark"} Mode`);
  };

  const handlePasswordChange = async () => {
    toast.info("Redirecting to Change Password page...");
    // Could navigate to a password change page
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?"));
  };
}

export default AdminSettings;