import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from SecureStore on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync("user");
        if (storedUser) {
          setUserState(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Save user to SecureStore
  const setUser = async (userData) => {
    setUserState(userData);
    if (userData) {
      await SecureStore.setItemAsync("user", JSON.stringify(userData));
    } else {
      await SecureStore.deleteItemAsync("user"); // For logout
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}
