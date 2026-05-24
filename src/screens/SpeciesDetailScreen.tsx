import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThumbnailGallery } from "../components/ThumbnailGallery";
import { Prediction } from "../services/tflite";
import { saveSighting } from "../services/db";
import { useApp } from "../context/AppContext";
import { useTheme } from "../theme";

export function SpeciesDetailScreen({ navigation, route }: any) {
  const { prediction, classId }: { prediction: Prediction; classId: string } =
    route.params;
  const { refreshSightings } = useApp();
  const theme = useTheme();

  // photoUri is passed through from ResultScreen via navigation state
  const photoUri: string = route.params?.photoUri ?? "";

  function handleSave() {
    saveSighting(prediction.species, prediction.confidence, prediction.index, photoUri);
    refreshSightings();
    navigation.popToTop();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.header, { color: theme.text }]}>{prediction.species}</Text>
        <Text style={[styles.confidence, { color: theme.accent }]}>
          {prediction.confidence}% Likely
        </Text>

        <View style={styles.galleryContainer}>
          <ThumbnailGallery classId={classId} />
        </View>

        <View
          style={[
            styles.infoSection,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={[styles.infoLabel, { color: theme.text }]}>Information</Text>
          <Text style={[styles.infoText, { color: theme.textMuted }]}>
            This species is part of the North American bird database (NABird).
            Swipe the photos above to see more reference images.
          </Text>
        </View>

        {photoUri ? (
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.accent }]}
            onPress={handleSave}
          >
            <Text style={[styles.saveButtonText, { color: theme.accentText }]}>
              Save Sighting
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  confidence: {
    fontSize: 15,
    marginBottom: 16,
  },
  galleryContainer: { marginHorizontal: -16, paddingHorizontal: 16, marginBottom: 24 },
  infoSection: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  saveButton: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
