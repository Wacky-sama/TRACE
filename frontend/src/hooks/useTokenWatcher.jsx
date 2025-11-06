import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { getToken, userLogout } from "../utils/storage";

export default function useTokenWatcher() {
  const notifiedRef = useRef(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.log("No token found — skipping watcher.");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);

      if (!decoded.exp) {
        console.warn("No exp field in token");
        return;
      }

      const expTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const remaining = expTime - currentTime;

      console.log(`Token remaining: ${remaining / 1000}s`);

      const notifyThreshold = 30 * 1000;

      if (remaining <= 0) {
        console.log("Token already expired — forcing logout.");
        toast.error("Your session has expired. Please log in again.");
        userLogout();
        return;
      }

      if (remaining <= notifyThreshold) {
        console.log("Token will expire soon — showing immediate warning.");
        toast.info("Your session will expire soon.");
      }

      const notifyTimer = setTimeout(() => {
        if (!notifiedRef.current) {
          notifiedRef.current = true;
          console.log("Triggering token expiration warning toast");
          toast.info("Your session will expire soon.");
        }
      }, Math.max(0, remaining - notifyThreshold));

      const logoutTimer = setTimeout(() => {
        console.log("Token expired, logging out...");
        toast.error("Your session has expired. Please log in again.");
        userLogout();
      }, remaining);

      return () => {
        clearTimeout(notifyTimer);
        clearTimeout(logoutTimer);
      };
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }, []);
}
