import React, { useState, useContext } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { UserContext } from "../hooks/userContext"; // ✅ Adjust path as needed

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6).required("Required"),
});

export default function LoginScreen({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { setUser } = useContext(UserContext); // ✅ useContext to set logged-in user

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch(
        "https://ecomerceapi-3.onrender.com/api/v1/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({ password: data.message || "Login failed" });
      } else {
        console.log("Login success:", data);
        setUser(data); // ✅ Set user in context
        navigation.navigate("Main");
      }
    } catch (err) {
      console.error(err);
      setErrors({ password: "Something went wrong!" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Title style={styles.title}>Login</Title>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <View>
            <TextInput
              label="Email"
              mode="outlined"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              style={styles.input}
              error={touched.email && errors.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry={!passwordVisible}
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              style={styles.input}
              error={touched.password && errors.password}
              right={
                <TextInput.Icon
                  icon={passwordVisible ? "eye-off" : "eye"}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                />
              }
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Login
            </Button>

            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Signup")}
            >
              Don't have an account? Sign up
            </Text>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { textAlign: "center", marginBottom: 24 },
  input: { marginBottom: 8 },
  button: { marginTop: 16 },
  error: { color: "red", fontSize: 12, marginLeft: 4 },
  link: { textAlign: "center", marginTop: 16, color: "#6200ee" },
});
