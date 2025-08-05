import React from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";

const CategoryList = ({ categories, active, onSelect }) => {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={categories}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => {
        const isActive = item._id === active;
        return (
          <TouchableOpacity
            onPress={() => onSelect(item)}
            style={[styles.item, isActive && styles.activeItem]}
          >
            <Text style={[styles.text, isActive && styles.activeText]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 16,
//     marginVertical: 12,
//   },
//   item: {
//     backgroundColor: "#f1f1f1",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   activeItem: {
//     backgroundColor: "#e91e63",
//   },
//   text: {
//     color: "#333",
//     fontWeight: "500",
//   },
//   activeText: {
//     color: "#fff",
//   },
// });

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  item: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 36,
  },
  activeItem: {
    backgroundColor: "#e91e63",
  },
  text: {
    color: "#333",
    fontWeight: "500",
    fontSize: 14,
  },
  activeText: {
    color: "#fff",
  },
});

export default CategoryList;
