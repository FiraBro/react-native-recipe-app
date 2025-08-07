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
          credentials: "include", // send cookies or auth headers if needed
        }
      );
      const data = await res.json();
      if (res.ok) {
        // data.data.favorites is array of { _id, user, product: {...} }
        // We want the product objects
        const products = data.data.favorites.map((fav) => fav.product);
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

  // Add product to favorites backend & local state
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
        // refresh from backend or just add locally:
        setFavorites((prev) => {
          const exists = prev.some((item) => item._id === product._id);
          return exists ? prev : [...prev, product];
        });
      } else {
        alert(data.message || "Failed to add favorite");
      }
    } catch (err) {
      console.error("Add to favorites error:", err);
    }
  };

  // Remove product from favorites backend & local state
  const removeFromFavorites = async (productId) => {
    try {
      const res = await fetch(
        `https://ecomerceapi-3.onrender.com/api/v1/favorites/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setFavorites((prev) => prev.filter((item) => item._id !== productId));
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
