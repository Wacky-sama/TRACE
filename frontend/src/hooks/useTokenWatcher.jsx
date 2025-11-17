/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { getToken, userLogout } from "../utils/storage";

export default function useTokenWatcher() {
  const notifiedRef = useRef(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (!decoded.exp) {
        return;
      }

      const expTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const remaining = expTime - currentTime;

      const notifyThreshold = 30 * 1000;

      if (remaining <= 0) {
        toast.error("Your session has expired. Please log in again.");
        userLogout();
        return;
      }

      if (remaining <= notifyThreshold) {
        toast("Your session will expire soon.");
      }

      const notifyTimer = setTimeout(() => {
        if (!notifiedRef.current) {
          notifiedRef.current = true;
          toast("Your session will expire soon.");
        }
      }, Math.max(0, remaining - notifyThreshold));

      const logoutTimer = setTimeout(() => {
        toast.error("Your session has expired. Please log in again.");
        userLogout();
      }, remaining);

      return () => {
        clearTimeout(notifyTimer);
        clearTimeout(logoutTimer);
      };
    } catch (error) {
      // Silent fail - token will be handled by API interceptors
    }
  }, []);
}
