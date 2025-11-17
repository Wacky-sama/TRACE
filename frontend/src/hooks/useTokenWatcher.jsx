/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { getToken, userLogout } from "../utils/storage";

export default function useTokenWatcher() {
  const warnedRef = useRef(false);
  const logoutTimerRef = useRef(null);
  const warnTimerRef = useRef(null);

  const token = getToken();

  useEffect(() => {
    // Clear old timers
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
    warnedRef.current = false;

    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return;

      const exp = decoded.exp * 1000;
      const now = Date.now();
      const remaining = exp - now;

      const warnThreshold = 30 * 1000;

      // Token already expired?
      if (remaining <= 0) {
        toast.error("Your session has expired. Please log in again.");
        userLogout();
        return;
      }

      // If within warning threshold immediately
      if (remaining <= warnThreshold) {
        toast("Your session will expire soon.");
        warnedRef.current = true;
      }

      // Delay warning
      warnTimerRef.current = setTimeout(() => {
        if (!warnedRef.current) {
          warnedRef.current = true;
          toast("Your session will expire soon.");
        }
      }, Math.max(0, remaining - warnThreshold));

      // Auto logout
      logoutTimerRef.current = setTimeout(() => {
        toast.error("Your session has expired. Please log in again.");
        userLogout();
      }, remaining);
    } catch (_) {
      // silent fail
    }

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
    };
  }, [token]);
}
