import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import RecipeList from "../components/RecipeList";
import CategoryList from "../components/CategoryList";

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://ecomerceapi-3.onrender.com/api/v1/category/getAllCategory"
        );
        const data = await res.json();
        console.log("Fetched categories:", data);
        setCategories(data.categories); // adjust this based on actual response
        if (data.categories.length > 0) {
          setActiveCategoryId(data.categories[0]._id);
          setActiveCategoryName(data.categories[0].name);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    setActiveCategoryId(category._id);
    setActiveCategoryName(category.name);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 100 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://yourcdn.com/recipe-top-banner.jpg" }}
        style={styles.headerImage}
        resizeMode="cover"
      />
      <CategoryList
        categories={categories}
        active={activeCategoryId}
        onSelect={handleCategorySelect}
      />
      <Text style={styles.sectionTitle}>Recipes for {activeCategoryName}</Text>
      {activeCategoryId && <RecipeList categoryId={activeCategoryId} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerImage: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 16,
    marginTop: 10,
  },
});
