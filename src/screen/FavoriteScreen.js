import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { FavoriteContext } from "../contexts/favoriteContext";
import { Button } from "react-native-paper";

const FavoriteScreen = () => {
  const { favorites, removeFromFavorites, loading } =
    useContext(FavoriteContext);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  const renderItem = ({ item }) => {
    if (!item) return null;
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/100" }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title || "No Title"}</Text>
          <Text style={styles.price}>
            {item.price ? `$${item.price}` : "Price Unavailable"}
          </Text>
          <Button
            onPress={() => removeFromFavorites(item._id)}
            mode="outlined"
            icon="delete"
            style={styles.removeButton}
          >
            Remove
          </Button>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={favorites.filter(Boolean)}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={styles.empty}>No favorites yet</Text>}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginTop: 20,
    padding: 12,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  title: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 14, color: "#555" },
  removeButton: { marginTop: 8 },
  empty: { textAlign: "center", marginTop: 40 },
});

export default FavoriteScreen;
