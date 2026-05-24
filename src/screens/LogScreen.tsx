import React, { useCallback } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "../context/AppContext";
import { deleteSighting, Sighting } from "../services/db";
import { CLASS_IDS } from "../services/class-ids";
import { useTheme } from "../theme";

export function LogScreen({ navigation }: any) {
  const { sightings, refreshSightings } = useApp();
  const theme = useTheme();

  function handleDelete(id: number) {
    deleteSighting(id);
    refreshSightings();
  }

  function handlePress(sighting: Sighting) {
    const classId = CLASS_IDS[sighting.classIndex] ?? "";
    navigation.navigate("SpeciesDetail", {
      prediction: {
        index: sighting.classIndex,
        species: sighting.species,
        confidence: sighting.confidence,
      },
      classId,
      photoUri: sighting.photoUri,
    });
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const renderItem = useCallback(
    ({ item }: { item: Sighting }) => (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.cardBorder },
        ]}
        onPress={() => handlePress(item)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.photoUri }}
          style={[styles.thumb, { backgroundColor: theme.photoPlaceholder }]}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={[styles.species, { color: theme.text }]} numberOfLines={2}>
            {item.species}
          </Text>
          <Text style={[styles.meta, { color: theme.textMuted }]}>
            {item.confidence}% • {formatDate(item.timestamp)}
          </Text>
        </View>
        <TouchableOpacity style={styles.delete} onPress={() => handleDelete(item.id)} hitSlop={8}>
          <Text style={[styles.deleteText, { color: theme.textSubtle }]}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [sightings, theme]
  );

  if (sightings.length === 0) {
    return (
      <SafeAreaView style={[styles.empty, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.text }]}>No sightings yet.</Text>
        <Text style={[styles.emptySubText, { color: theme.textSubtle }]}>
          Identify a bird to save it here.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={sightings}
        keyExtractor={(s) => String(s.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onRefresh={refreshSightings}
        refreshing={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    alignItems: "center",
  },
  thumb: { width: 72, height: 72 },
  info: { flex: 1, paddingHorizontal: 12 },
  species: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  meta: { fontSize: 13 },
  delete: { padding: 12 },
  deleteText: { fontSize: 16 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 18, fontWeight: "600" },
  emptySubText: { fontSize: 14, marginTop: 6 },
});
