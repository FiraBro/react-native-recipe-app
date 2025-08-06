// import React, { useEffect, useState } from "react";
// import { FlatList, Text, View, ActivityIndicator, Image } from "react-native";

// export default function RecipeList({ categoryId }) {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchRecipes = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(
//         `https://ecomerceapi-3.onrender.com/api/v1/category/${categoryId}/products`
//       );
//       const data = await res.json();
//       setRecipes(data.products || []);
//       console.log("Fetched recipes:", data.products[0]);
//     } catch (err) {
//       console.error("Failed to fetch recipes", err);
//       setError("Failed to load recipes");
//       setRecipes([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecipes();
//   }, [categoryId]);

//   if (loading) {
//     return <ActivityIndicator style={{ marginTop: 20 }} size="large" />;
//   }

//   if (error) {
//     return <Text style={{ textAlign: "center", marginTop: 20 }}>{error}</Text>;
//   }

//   if (!recipes.length) {
//     return (
//       <Text style={{ textAlign: "center", marginTop: 20 }}>
//         No recipes found for this category
//       </Text>
//     );
//   }

//   return (
//     <FlatList
//       data={recipes}
//       keyExtractor={(item) => item._id}
//       renderItem={({ item }) => (
//         <View style={{ borderBottomWidth: 1, borderColor: "#eee" }}>
//           <Image
//             source={{ uri: item.image }}
//             style={{ width: "100%", height: 200, borderRadius: 10 }}
//             resizeMode="cover"
//           />
//           <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
//           <Text>{item.description}</Text>
//           <Text style={{ color: "#000", fontSize: 22, fontFamily: "bold" }}>
//             ${item.price}
//           </Text>
//         </View>
//       )}
//     />
//   );
// }

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
  console.log({ user: user });
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
          credentials: "include", // include cookies
        }
      );
      const data = await res.json();
      setRecipes(data.products || []);
      console.log("Fetched recipes:", data.products);
    } catch (err) {
      console.error("Failed to fetch recipes", err);
      setError("Failed to load recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (productId) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
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
                Alert.alert("Success", "Product deleted successfully.");
                fetchRecipes(); // Refresh list
              } else {
                Alert.alert("Failed", data.message || "Deletion failed.");
              }
            } catch (err) {
              console.error("Delete error", err);
              Alert.alert("Error", "Something went wrong while deleting.");
            }
          },
        },
      ]
    );
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

          {/* Show delete button only for admin */}
          {user?.role === "admin" && (
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
          )}
        </View>
      )}
    />
  );
}
