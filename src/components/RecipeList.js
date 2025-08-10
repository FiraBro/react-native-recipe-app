import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
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
        "https://ecomerceapi-3.onrender.com/api/v1/favorites",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }), // <-- Use productId, not itemId
        }
      );
      const data = await res.json();
      console.log("Add to favorites response:", data);

      if (res.ok) {
        Alert.alert("Favorited", "Added to favorites.");
      } else {
        Alert.alert("Failed", data.message || "Could not add to favorites.");
      }
    } catch (error) {
      console.error("Add to favorites error:", error);
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
      numColumns={2} // two columns
      columnWrapperStyle={{ justifyContent: "space-between" }}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
            marginHorizontal: 5,
            maxWidth: "48%", // ensures both columns have equal width
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: 150, borderRadius: 8 }}
            resizeMode="cover"
          />
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 5 }}>
            {item.title}
          </Text>
          <Text numberOfLines={2} style={{ fontSize: 12, color: "#555" }}>
            {item.description}
          </Text>
          <Text style={{ color: "#000", fontSize: 16, marginTop: 5 }}>
            ${item.price}
          </Text>

          {user?.role === "admin" ? (
            <TouchableOpacity
              onPress={() => deleteRecipe(item._id)}
              style={{
                backgroundColor: "red",
                padding: 8,
                marginTop: 8,
                borderRadius: 5,
              }}
            >
              <Text
                style={{ color: "#fff", textAlign: "center", fontSize: 12 }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => addToCart(item._id)}
                style={{
                  backgroundColor: "#4CAF50",
                  padding: 8,
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="cart" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => addToFavorites(item._id)}
                style={{
                  backgroundColor: "#2196F3",
                  padding: 8,
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="heart" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    />
  );
}
