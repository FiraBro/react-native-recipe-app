import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { TextInput, Button, Text, Title, HelperText } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";

const ProductSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
  category: Yup.string().required("Category ID is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed().required("Image is required"),
});

export default function UploadProductScreen() {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async (setFieldValue) => {
    // Ask for permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Permission to access gallery is required!"
      );
      return;
    }
    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setFieldValue("image", result.assets[0]);
    }
  };

  //   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  //     try {
  //       const formData = new FormData();
  //       formData.append("title", values.title);
  //       formData.append("price", values.price.toString());
  //       formData.append("category", values.category);
  //       formData.append("description", values.description);
  //       formData.append("image", {
  //         uri: values.image.uri,
  //         name: "photo.jpg",
  //         type: "image/jpeg",
  //       });

  //       const response = await fetch(
  //         "https://ecomerceapi-3.onrender.com/api/v1/products/add",
  //         {
  //           method: "POST",
  //           headers: {
  //             // IMPORTANT: Do NOT set 'Content-Type' header yourself for multipart form data.
  //             // The browser/react-native will set correct boundary automatically.
  //             // If you set it manually, request may fail.
  //             // Authorization or credentials should be handled as needed (e.g., cookie or header)
  //           },
  //           body: formData,
  //           credentials: "include", // if using cookies auth
  //         }
  //       );

  //       const data = await response.json();
  //       console.log(data);

  //       if (!response.ok) {
  //         Alert.alert("Upload failed", data.message || "Something went wrong!");
  //       } else {
  //         Alert.alert("Success", "Product uploaded successfully!");
  //         resetForm();
  //         setImageUri(null);
  //       }
  //     } catch (error) {
  //       Alert.alert("Error", error.message);
  //     } finally {
  //       setSubmitting(false);
  //     }
  //   };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("price", values.price.toString());
      formData.append("categoryId", values.category); // <== here
      formData.append("description", values.description);
      formData.append("image", {
        uri: values.image.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(
        "https://ecomerceapi-3.onrender.com/api/v1/products/add",
        {
          method: "POST",
          headers: {
            // no Content-Type, let fetch set it automatically for FormData
          },
          body: formData,
          credentials: "include", // if using cookie auth
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        Alert.alert("Upload failed", data.message || "Something went wrong!");
      } else {
        Alert.alert("Success", "Product uploaded successfully!");
        resetForm();
        setImageUri(null);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.title}>Upload Product</Title>

        <Formik
          initialValues={{
            title: "",
            price: "",
            category: "",
            description: "",
            image: null,
          }}
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
          }) => (
            <View>
              <TextInput
                label="Title"
                mode="outlined"
                value={values.title}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                error={touched.title && !!errors.title}
                style={styles.input}
              />
              {touched.title && errors.title && (
                <HelperText type="error">{errors.title}</HelperText>
              )}

              <TextInput
                label="Price"
                mode="outlined"
                keyboardType="numeric"
                value={values.price}
                onChangeText={handleChange("price")}
                onBlur={handleBlur("price")}
                error={touched.price && !!errors.price}
                style={styles.input}
              />
              {touched.price && errors.price && (
                <HelperText type="error">{errors.price}</HelperText>
              )}

              <TextInput
                label="Category ID"
                mode="outlined"
                value={values.category}
                onChangeText={handleChange("category")}
                onBlur={handleBlur("category")}
                error={touched.category && !!errors.category}
                style={styles.input}
              />
              {touched.category && errors.category && (
                <HelperText type="error">{errors.category}</HelperText>
              )}

              <TextInput
                label="Description"
                mode="outlined"
                multiline
                numberOfLines={4}
                value={values.description}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                error={touched.description && !!errors.description}
                style={styles.input}
              />
              {touched.description && errors.description && (
                <HelperText type="error">{errors.description}</HelperText>
              )}

              <Button
                mode="outlined"
                onPress={() => pickImage(setFieldValue)}
                style={{ marginVertical: 10 }}
              >
                {values.image ? "Change Image" : "Pick an Image"}
              </Button>

              {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              )}
              {touched.image && errors.image && (
                <HelperText type="error">{errors.image}</HelperText>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={isSubmitting}
                loading={isSubmitting}
                style={styles.submitButton}
              >
                Upload Product
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 24,
  },
  input: {
    marginBottom: 12,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  submitButton: {
    marginTop: 10,
  },
});
