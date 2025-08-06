import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Svg, Path } from "react-native-svg";
import RecipeList from "../components/RecipeList";
import CategoryList from "../components/CategoryList";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../hooks/userContext";

// 🐓 Chicken Icon
const ChickenIcon = ({ width = 40, height = 40 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 40">
    <Path
      d="M20 15C22.5 15 25 17.5 25 20C25 22.5 22.5 25 20 25C17.5 25 15 22.5 15 20C15 17.5 17.5 15 20 15Z"
      fill="#FFA500"
    />
    <Path
      d="M30 15C32.5 15 35 17.5 35 20C35 22.5 32.5 25 30 25C27.5 25 25 22.5 25 20C25 17.5 27.5 15 30 15Z"
      fill="#FFA500"
    />
    <Path
      d="M10 15C12.5 15 15 17.5 15 20C15 22.5 12.5 25 10 25C7.5 25 5 22.5 5 20C5 17.5 7.5 15 10 15Z"
      fill="#FFA500"
    />
    <Path
      d="M20 5C22.5 5 25 7.5 25 10C25 12.5 22.5 15 20 15C17.5 15 15 12.5 15 10C15 7.5 17.5 5 20 5Z"
      fill="#FFA500"
    />
    <Path
      d="M20 25C22.5 25 25 27.5 25 30C25 32.5 22.5 35 20 35C17.5 35 15 32.5 15 30C15 27.5 17.5 25 20 25Z"
      fill="#FFA500"
    />
    <Path d="M20 15L20 25" stroke="#FF4500" strokeWidth={2} />
  </Svg>
);

// 🐐 Goat Icon
const GoatIcon = ({ width = 40, height = 40 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 40">
    <Path
      d="M25 10C27.5 10 30 12.5 30 15C30 17.5 27.5 20 25 20C22.5 20 20 17.5 20 15C20 12.5 22.5 10 25 10Z"
      fill="#8B4513"
    />
    <Path
      d="M15 10C17.5 10 20 12.5 20 15C20 17.5 17.5 20 15 20C12.5 20 10 17.5 10 15C10 12.5 12.5 10 15 10Z"
      fill="#8B4513"
    />
    <Path
      d="M20 20C22.5 20 25 22.5 25 25C25 27.5 22.5 30 20 30C17.5 30 15 27.5 15 25C15 22.5 17.5 20 20 20Z"
      fill="#8B4513"
    />
    <Path d="M20 15L20 20" stroke="#A0522D" strokeWidth={2} />
    <Path d="M15 15L10 10" stroke="#A0522D" strokeWidth={2} />
    <Path d="M25 15L30 10" stroke="#A0522D" strokeWidth={2} />
  </Svg>
);

// 🐑 Sheep Icon
const SheepIcon = ({ width = 40, height = 40 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 40">
    <Path
      d="M20 10C22.5 10 25 12.5 25 15C25 17.5 22.5 20 20 20C17.5 20 15 17.5 15 15C15 12.5 17.5 10 20 10Z"
      fill="#F5F5F5"
    />
    <Path
      d="M20 20C22.5 20 25 22.5 25 25C25 27.5 22.5 30 20 30C17.5 30 15 27.5 15 25C15 22.5 17.5 20 20 20Z"
      fill="#F5F5F5"
    />
    <Path d="M20 15L20 20" stroke="#D3D3D3" strokeWidth={2} />
    <Path d="M15 15L10 10" stroke="#D3D3D3" strokeWidth={2} />
    <Path d="M25 15L30 10" stroke="#D3D3D3" strokeWidth={2} />
    <Path d="M17 12L17 8" stroke="#000000" strokeWidth={1} />
    <Path d="M23 12L23 8" stroke="#000000" strokeWidth={1} />
  </Svg>
);

export default function HomeScreen() {
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [heroImageUrl, setHeroImageUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, heroRes] = await Promise.all([
          fetch(
            "https://ecomerceapi-3.onrender.com/api/v1/category/getAllCategory"
          ),
          fetch("https://ecomerceapi-3.onrender.com/api/v1/hero/hero-image"),
        ]);

        const categoriesData = await categoriesRes.json();
        const heroData = await heroRes.json();

        if (categoriesData.categories?.length) {
          setCategories(categoriesData.categories);
          setActiveCategoryId(categoriesData.categories[0]._id);
          setActiveCategoryName(categoriesData.categories[0].name);
        }

        if (heroData.imageUrl) {
          setHeroImageUrl(`${heroData.imageUrl}`);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Animal Icons Row */}
      <View style={styles.iconsContainer}>
        <ChickenIcon />
        <View style={styles.iconSpacer} />
        <GoatIcon />
        <View style={styles.iconSpacer} />
        <SheepIcon />
      </View>

      {/* Hero Image */}
      {heroImageUrl && (
        <Image
          source={{ uri: heroImageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      )}

      {/* Category List */}
      <CategoryList
        categories={categories}
        active={activeCategoryId}
        onSelect={(cat) => {
          setActiveCategoryId(cat._id);
          setActiveCategoryName(cat.name);
        }}
      />

      {/* Recipes Section */}
      <Text style={styles.sectionTitle}>
        {activeCategoryName
          ? `Recipes for ${activeCategoryName}`
          : "Loading recipes..."}
      </Text>

      {activeCategoryId && (
        <RecipeList categoryId={activeCategoryId} user={user} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  loader: {
    marginTop: 100,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  iconSpacer: {
    width: 20,
  },
  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginVertical: 10,
    color: "#333",
  },
});
