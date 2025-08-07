import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function RecipeList({ categoryId, user }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://ecomerceapi-3.onrender.com/api/v1/category/${categoryId}/products`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      setRecipes(data.products || []);
    } catch (err) {
      console.error("Failed to fetch recipes", err);
      setError("Failed to load recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (productId) => {
    Alert.alert("Delete Product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const res = await fetch(
              `https://ecomerceapi-3.onrender.com/api/v1/products/${productId}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );
            const data = await res.json();
            if (res.ok) {
              Alert.alert("Success", "Product deleted.");
              fetchRecipes();
            } else {
              Alert.alert("Failed", data.message || "Deletion failed.");
            }
          } catch (err) {
            console.error("Delete error", err);
            Alert.alert("Error", "Something went wrong.");
          }
        },
      },
    ]);
  };

  const addToCart = async (productId) => {
    try {
      const res = await fetch(
        `https://ecomerceapi-3.onrender.com/api/v1/cart/add`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            quantity: 1, // 👈 send a default quantity
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Added to Cart", data.message || "Product added.");
      } else {
        Alert.alert("Failed", data.message || "Could not add to cart.");
      }
    } catch (err) {
      console.error("Add to cart error", err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const addToFavorites = async (productId) => {
    try {
      const res = await fetch(
        `https://ecomerceapi-3.onrender.com/api/v1/favorites`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        }
      );
      const data = await res.json();
      console.log("Add to favorites response:", data);
      if (res.ok) {
        Alert.alert("Favorited", data.message || "Added to favorites.");
      } else {
        Alert.alert("Failed", data.message || "Could not add to favorites.");
      }
    } catch (err) {
      console.error("Add to favorite error", err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [categoryId]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} size="large" />;
  }

  if (error) {
    return <Text style={{ textAlign: "center", marginTop: 20 }}>{error}</Text>;
  }

  if (!recipes.length) {
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        No recipes found for this category
      </Text>
    );
  }

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item._id}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "#eee",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: 200, borderRadius: 10 }}
            resizeMode="cover"
          />
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
          <Text>{item.description}</Text>
          <Text style={{ color: "#000", fontSize: 22 }}>${item.price}</Text>

          {user?.role === "admin" ? (
            <TouchableOpacity
              onPress={() => deleteRecipe(item._id)}
              style={{
                backgroundColor: "red",
                padding: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Delete</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => addToCart(item._id)}
                style={{
                  backgroundColor: "#4CAF50",
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  Add to Cart
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => addToFavorites(item._id)}
                style={{
                  backgroundColor: "#2196F3",
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  Add to Favorite
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    />
  );
}
