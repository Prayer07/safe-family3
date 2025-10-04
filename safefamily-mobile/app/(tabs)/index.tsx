// app/(tabs)/map.tsx
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable, ScrollView, RefreshControl, Alert } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { apiFetch } from "../../utils/apiClient";

interface MemberLocation {
  userId: string;
  name: string;
  lat: number;
  lng: number;
  lastActiveAt?: string | null;
}

export default function MapScreen() {
  const [region, setRegion] = useState<Region>({
    latitude: 6.5244, // Lagos coordinates as fallback
    longitude: 3.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [members, setMembers] = useState<MemberLocation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const data = await apiFetch<MemberLocation[]>("/location/family/last");
      
      // Validate data before using
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        if (first && typeof first.lat === 'number' && typeof first.lng === 'number') {
          setRegion({
            latitude: first.lat,
            longitude: first.lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
        setMembers(data.filter(m => m && typeof m.lat === 'number' && typeof m.lng === 'number'));
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.error("Failed to load locations:", err);
      setError(err instanceof Error ? err.message : "Failed to load family locations");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

  const centerOnMe = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Location permission is required to center the map on you");
        return;
      }
      
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      
      setRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      
      // Post location to backend
      try {
        await apiFetch("/location", {
          method: "POST",
          body: JSON.stringify({ lat, lng }),
        });
      } catch (e) {
        console.error("Failed to post location:", e);
      }
    } catch (err) {
      console.error("Center on me failed:", err);
      Alert.alert("Error", "Failed to get your location");
    }
  };

  const triggerSOS = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Location permission is required for SOS");
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      await apiFetch("/sos/trigger", {
        method: "POST",
        body: JSON.stringify({ 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude 
        }),
      });

      Alert.alert("SOS Sent", "Your family has been notified!");
    } catch (err) {
      console.error("SOS failed:", err);
      Alert.alert("Error", "Failed to send SOS alert");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <Pressable style={styles.retryButton} onPress={() => {
          setLoading(true);
          load();
        }}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <MapView 
          style={styles.map} 
          region={region} 
          onRegionChangeComplete={(r) => setRegion(r)}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {members.map((m) => (
            <Marker
              key={m.userId}
              coordinate={{ latitude: m.lat, longitude: m.lng }}
              title={m.name}
              description={m.lastActiveAt ? new Date(m.lastActiveAt).toLocaleString() : "Location unavailable"}
            />
          ))}
        </MapView>

        {members.length === 0 && (
          <View style={styles.noDataBanner}>
            <Text style={styles.noDataText}>No family member locations available</Text>
          </View>
        )}

        <Pressable style={[styles.fab, { bottom: 120 }]} onPress={centerOnMe}>
          <Text style={styles.fabText}>📍</Text>
        </Pressable>

        <Pressable
          style={[styles.fab, { bottom: 40, backgroundColor: "#FF3B30" }]}
          onPress={triggerSOS}
        >
          <Text style={styles.fabText}>SOS</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  errorText: { fontSize: 16, color: "#FF3B30", textAlign: "center", marginBottom: 20 },
  retryButton: { 
    backgroundColor: "#1E90FF", 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 8 
  },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  noDataBanner: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 12,
    borderRadius: 8,
    elevation: 4,
  },
  noDataText: { textAlign: "center", color: "#666" },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1E90FF",
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: { color: "#fff", fontWeight: "700", fontSize: 18 },
});