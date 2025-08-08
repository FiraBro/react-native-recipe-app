// CartScreen.js
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Button } from "react-native-paper";
import { CartContext } from "../contexts/cartContext";

export default function CartScreen() {
  const { cartItems, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);

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

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Your Cart
      </Text>
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
});
