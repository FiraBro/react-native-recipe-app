import React, { useContext, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { CartContext } from "../contexts/cartContext";
import { useFocusEffect } from "@react-navigation/native";

export default function CartScreen({ navigation }) {
  const { cartItems, increaseQuantity, decreaseQuantity, fetchCart } =
    useContext(CartContext);

  // This runs every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (fetchCart) {
        fetchCart(); // If your context has a fetch method, call it to reload data
      }
    }, [fetchCart])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>

        <View style={styles.buttonsContainer}>
          <Button mode="outlined" onPress={() => decreaseQuantity(item._id)}>
            -
          </Button>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <Button mode="outlined" onPress={() => increaseQuantity(item._id)}>
            +
          </Button>
        </View>
      </View>
    </View>
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      {cartItems.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Your cart is empty
        </Text>
      )}

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("PaymentSuccess")}
          >
            Buy Now
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    color: "#777",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    alignItems: "center",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
