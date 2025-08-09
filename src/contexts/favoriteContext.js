import React, { createContext, useState, useEffect, useCallback } from "react";

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://ecomerceapi-3.onrender.com/api/v1/favorites",
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(
        "Fetched favorites:",
        JSON.stringify(data.data.favorites, null, 2)
      );

      if (res.ok && data.data && Array.isArray(data.data.favorites)) {
        setFavorites(data.data.favorites);
      } else {
        setFavorites([]);
        console.error(
          "Failed to fetch favorites or data.favorites is not an array",
          data
        );
      }
    } catch (error) {
      console.error("Fetch favorites error", error);
    } finally {
      setLoading(false);
    }
  }, []); // no dependencies, stable function

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]); // only runs once, fetchFavorites is stable

  const removeFromFavorites = async (favoriteId) => {
    try {
      const res = await fetch(
        `https://ecomerceapi-3.onrender.com/api/v1/favorites/${favoriteId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        await fetchFavorites(); // refresh after delete
      } else {
        alert(data.message || "Failed to remove favorite");
      }
    } catch (error) {
      console.error("Remove favorite error", error);
    }
  };

  return (
    <FavoriteContext.Provider
      value={{ favorites, loading, fetchFavorites, removeFromFavorites }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
