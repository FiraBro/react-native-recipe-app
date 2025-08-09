import React, { useContext } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { Text, Button } from "react-native-paper";
import { UserContext } from "../contexts/userContext";

export default function AccountScreen() {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: () => setUser(null),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>You are not logged in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri:
            user.image ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        buttonColor="#e91e63"
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
  },
  logoutButton: {
    width: "60%",
    paddingVertical: 6,
  },
});
