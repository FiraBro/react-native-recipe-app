import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";

export default function PaymentSuccess({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
        }}
        style={styles.image}
      />
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.subtitle}>
        Thank you for your purchase. Your order is on its way!
      </Text>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate("Main", { screen: "Home" })}
      >
        Back to Home
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  button: {
    marginTop: 10,
  },
});
