import { useState, useEffect } from "react";
import { UserContext } from "./UserProvider";
import { getUser, setUser, clearUser } from "../utils/storage";

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getUser());

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    } else {
      clearUser();
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};