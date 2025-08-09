import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

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
        await fetchCart();
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error", error);
    }
  };
  // inside CartContext.js
  // inside CartContext

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(
        "https://ecomerceapi-3.onrender.com/api/v1/cart/remove",
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete item");
      }

      // Update local cart items with fresh data from backend response (which is the updated cart)
      setCartItems(
        data.data.items.map((item) => ({
          _id: item.product._id,
          title: item.product.title,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
        }))
      );
    } catch (error) {
      console.error("Remove from cart failed:", error);
    }
  };

  const increaseQuantity = async (productId) => {
    try {
      // Find current quantity for productId
      const currentItem = cartItems.find((item) => item._id === productId);
      if (!currentItem) return;

      const newQuantity = currentItem.quantity + 1;

      const res = await fetch(
        "https://ecomerceapi-3.onrender.com/api/v1/cart/update",
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: newQuantity }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        await fetchCart();
      } else {
        alert(data.message || "Failed to increase quantity");
      }
    } catch (error) {
      console.error("Increase quantity error", error);
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      const currentItem = cartItems.find((item) => item._id === productId);
      if (!currentItem) return;

      const newQuantity = currentItem.quantity - 1;

      // If quantity drops to 0 or less, optionally remove from cart or set to 1
      if (newQuantity <= 0) {
        // Optionally remove from cart here (implement a remove function)
        alert("Quantity cannot be less than 1");
        return;
      }

      const res = await fetch(
        "https://ecomerceapi-3.onrender.com/api/v1/cart/update",
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: newQuantity }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        await fetchCart();
      } else {
        alert(data.message || "Failed to decrease quantity");
      }
    } catch (error) {
      console.error("Decrease quantity error", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        fetchCart,
        increaseQuantity,
        decreaseQuantity, // 🛠️ this was missing
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
