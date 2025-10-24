import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    userStats: null,
    activeUsers: null,
    blockedUsers: null,
    archivedUsers: null,
    onlineUsers: null,
    pendingUsers: [],
    recentActivity: [],
  });

  // Fetch all relevant data once
  useEffect(() => {
    const fetchAll
