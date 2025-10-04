import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { apiFetch } from "../../utils/apiClient";

interface Member {
  _id: string;
  name: string;
  phone?: string | null;
  lastKnownLat?: number | null;
  lastKnownLng?: number | null;
}

export default function MapScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await apiFetch<{ members: Member[] }>("/family/me");
        setMembers(data.members);

        // ✅ Find first member with a valid location
        const firstWithLocation = data.members.find(
          (m) => m.lastKnownLat !== null && m.lastKnownLat !== undefined
        );

        if (firstWithLocation) {
          setRegion({
            latitude: firstWithLocation.lastKnownLat!,
            longitude: firstWithLocation.lastKnownLng!,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        } else {
          // ✅ Fallback: Default region (e.g. Lagos)
          setRegion({
            latitude: 6.5244,
            longitude: 3.3792,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          });
        }
      } catch (err) {
        console.error("Failed to fetch members:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  if (loading || !region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
      showsUserLocation={true}
    >
      {members
        .filter(
          (m) =>
            m.lastKnownLat !== null &&
            m.lastKnownLat !== undefined &&
            m.lastKnownLng !== null &&
            m.lastKnownLng !== undefined
        )
        .map((member) => (
          <Marker
            key={member._id}
            coordinate={{
              latitude: member.lastKnownLat!,
              longitude: member.lastKnownLng!,
            }}
            title={member.name}
            description={member.phone ?? ""}
          />
        ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});