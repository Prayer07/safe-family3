import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter, Link } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import ThemedText from "../../components/ThemedText";
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedView from "../../components/ThemedView";
import { usePushNotifications } from "../../hooks/usePushNotifications";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false)
  const expoPushToken = usePushNotifications()

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    if (!expoPushToken){
      Alert.alert("Push Token not available yet. Please wait a second")
      return
    }
    setLoading(true)
    try {
      await login(data.email, data.password);
      Alert.alert("Expo Push Token "+expoPushToken)
      router.replace("/"); // ✅ go to home after login
    } catch (err: any) {
      console.error("Login failed: ", err.message);
      Alert.alert("Login failed ", err.message)
    }finally{
      setLoading(false)
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Login</ThemedText>

      <ThemedTextInput
        placeholder="Email"
        placeholderTextColor= {""}
        style={styles.input}
        keyboardType="email-address"
        onChangeText={(text) => setValue("email", text)}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <ThemedTextInput
        placeholder="Password"
        placeholderTextColor={""}
        style={styles.input}
        secureTextEntry
        onChangeText={(text) => setValue("password", text)}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>
          {loading? "Logging in....." : "Login"}
        </Text>
      </Pressable>

      <ThemedText style={styles.footer}>
        Don’t have an account?{" "}
        <Link href="/signup" style={styles.link}>
          Sign Up
        </Link>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "600", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1E90FF",
    borderRadius: 8,
    padding: 14,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  error: { color: "red", marginBottom: 8 },
  footer: { marginTop: 20, textAlign: "center" },
  link: { color: "#1E90FF", fontWeight: "600" },
});