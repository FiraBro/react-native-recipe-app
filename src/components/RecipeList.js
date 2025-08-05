import React, { useEffect, useState } from "react";
import { FlatList, Text, View, ActivityIndicator, Image } from "react-native";

export default function RecipeList({ categoryId }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://ecomerceapi-3.onrender.com/api/v1/category/${categoryId}/products`
      );
      const data = await res.json();
      setRecipes(data.products || []);
      console.log("Fetched recipes:", data.products);
    } catch (err) {
      console.error("Failed to fetch recipes", err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [categoryId]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} size="large" />;
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
          style={{ padding: 16, borderBottomWidth: 1, borderColor: "#eee" }}
        >
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: 200, borderRadius: 10 }}
            resizeMode="cover"
          />
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
          <Text>{item.description}</Text>
          <Text style={{color:'#000',fontSize:22,fontFamily:"bold"}}>${item.price}</Text>
        </View>
      )}
    />
  );
}
