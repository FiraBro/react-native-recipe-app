import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";

// Screens
import LoginScreen from "./src/screen/LoginScreen";
import SignupScreen from "./src/screen/SignupScreen";
import HomeScreen from "./src/screen/HomeScreen";
import SearchScreen from "./src/screen/SearchScreen";
import UploadProductScreen from "./src/screen/UploadProductScreen";
import FavoriteScreen from "./src/screen/FavoriteScreen";
import CartScreen from "./src/screen/CartScreen";
import PaymentSuccess from "./src/components/PaymentSuccess"; // ✅ Added

// Context Providers
import { UserProvider, UserContext } from "./src/contexts/userContext";
import { CartProvider } from "./src/contexts/cartContext";
import { FavoriteProvider } from "./src/contexts/favoriteContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { user } = useContext(UserContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Favorite") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "Upload") {
            iconName = focused ? "cloud-upload" : "cloud-upload-outline";
          } else if (route.name === "Cart") {
            iconName = focused ? "cart" : "cart-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#e91e63",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorite" component={FavoriteScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      {user?.role === "admin" && (
        <Tab.Screen name="Upload" component={UploadProductScreen} />
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <CartProvider>
        <FavoriteProvider>
          <PaperProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen
                  name="PaymentSuccess"
                  component={PaymentSuccess} // ✅ Added here
                />
              </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </FavoriteProvider>
      </CartProvider>
    </UserProvider>
  );
}
