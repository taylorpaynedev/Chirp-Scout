import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MAX_PHOTO_HEIGHT = Dimensions.get("window").height * 0.4;

function computePhotoSize(aspectRatio: number) {
  const heightAtFullWidth = SCREEN_WIDTH / aspectRatio;
  if (heightAtFullWidth <= MAX_PHOTO_HEIGHT) {
    return { width: SCREEN_WIDTH, height: heightAtFullWidth };
  }
  return { width: MAX_PHOTO_HEIGHT * aspectRatio, height: MAX_PHOTO_HEIGHT };
}
import { PredictionRow } from "../components/PredictionRow";
import { Prediction } from "../services/tflite";
import { useTheme } from "../theme";

// NABird leaf class IDs, sorted numerically, match the label index order from train.py.
// We need to map prediction.index → the actual class ID string for thumbnail lookup.
// The sorted class IDs are embedded here as a lookup table (generated from classes.txt).
// We import the label-to-classId map produced by export.py.
import { CLASS_IDS } from "../services/class-ids";

export function ResultScreen({ navigation, route }: any) {
  const { photoUri, predictions }: { photoUri: string; predictions: Prediction[] } =
    route.params;
  const theme = useTheme();
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  useEffect(() => {
    if (!photoUri) return;
    Image.getSize(
      photoUri,
      (w, h) => {
        if (w > 0 && h > 0) setAspectRatio(w / h);
      },
      () => {}
    );
  }, [photoUri]);

  function handlePredictionPress(prediction: Prediction) {
    const classId = CLASS_IDS[prediction.index] ?? "";
    navigation.navigate("SpeciesDetail", { prediction, classId, photoUri, canSave: true });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image
          source={{ uri: photoUri }}
          style={[
            styles.photo,
            computePhotoSize(aspectRatio),
            { backgroundColor: theme.photoPlaceholder },
          ]}
          resizeMode="contain"
        />

        <View style={styles.predictions}>
          {predictions.map((p, i) => (
            <PredictionRow
              key={p.index}
              prediction={p}
              rank={i + 1}
              onPress={() => handlePredictionPress(p)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => navigation.popToTop()}
        >
          <Text style={[styles.retakeText, { color: theme.accent }]}>
            Take Another Photo
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 32 },
  photo: {
    alignSelf: "center",
  },
  predictions: { paddingHorizontal: 16, paddingTop: 20 },
  retakeButton: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  retakeText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
