import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../services/authService";

// Define context type
interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = React.createContext<UserContextType | undefined>(
  undefined
);

export function UserContextProvider(props: React.PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuth = await isAuthenticated(); // Wait for the async function
      setIsLoggedIn(isAuth); // Set the authentication status
      console.log("Logged in? ", isAuth);
    };

    checkAuthentication();
  }, []); // Only run once when the component is mounted

  const value: UserContextType = {
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
}
