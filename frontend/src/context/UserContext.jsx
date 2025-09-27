import { createContext, useContext, useState, useEffect } from "react";
import { getUser, setUser, clearUser } from "../utils/storage";

const UserContext = createContext();

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

export const useUser = () => useContext(UserContext);
