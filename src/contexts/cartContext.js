import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items from backend
  const fetchCart = async () => {
    try {
      const res = await fetch(
        "https://ecomerceapi-3.onrender.com/api/v1/cart",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log("Cart data:", data);

      if (res.ok && data.data && data.data.items) {
        const items = data.data.items.map((item) => ({
          _id: item.product._id,
          title: item.product.title,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity,
        }));
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  // Call this on mount to load cart initially
  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    try {
      const res = await fetch(
        "https://ecomerceapi-3.onrender.com/api/v1/cart/add",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: product._id, quantity: 1 }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Refresh cart after adding
        await fetchCart();
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error", error);
    }
  };

  // Similarly, implement increaseQty and decreaseQty by calling backend and refetching cart

  return (
    <CartContext.Provider value={{ cartItems, addToCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
