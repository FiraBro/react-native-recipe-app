import React, { createContext, useState, useEffect } from "react";

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    try {
      const res = await fetch(
        "https://ecomerceapi-3.onrender.com/api/v1/favorites",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        // Store both product and favoriteId
        const products = data.data.favorites.map((fav) => ({
          ...fav.product,
          favoriteId: fav._id,
        }));
        setFavorites(products);
      } else {
        setFavorites([]);
        console.error("Fetch favorites failed:", data.message);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (product) => {
    if (!product || !product._id) return;

    try {
      const res = await fetch(
        "https://ecomerceapi-3.onrender.com/api/v1/favorites",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        const newFavorite = {
          ...product,
          favoriteId: data.data.favorite._id,
        };

        setFavorites((prev) => {
          const exists = prev.some((item) => item._id === product._id);
          return exists ? prev : [...prev, newFavorite];
        });
      } else {
        alert(data.message || "Failed to add favorite");
      }
    } catch (err) {
      console.error("Add to favorites error:", err);
    }
  };

  const removeFromFavorites = async (favoriteId) => {
    try {
      const res = await fetch(
        `https://ecomerceapi-3.onrender.com/api/v1/favorites/${favoriteId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setFavorites((prev) =>
          prev.filter((item) => item.favoriteId !== favoriteId)
        );
      } else {
        alert(data.message || "Failed to remove favorite");
      }
    } catch (err) {
      console.error("Remove from favorites error:", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <FavoriteContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, loading }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
