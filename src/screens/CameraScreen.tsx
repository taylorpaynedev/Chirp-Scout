import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBirdModel, runInference } from "../services/tflite";
import { useTheme } from "../theme";

export function CameraScreen({ navigation }: any) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);
  const birdModel = useBirdModel();
  const model = birdModel.state === "loaded" ? birdModel.model : undefined;
  const state = birdModel.state;
  const theme = useTheme();

  if (!permission) {
    return <View style={[styles.center, { backgroundColor: theme.background }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.permissionText, { color: theme.text }]}>
          Camera access is required to identify birds.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.accent }]}
          onPress={requestPermission}
        >
          <Text style={[styles.buttonText, { color: theme.accentText }]}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function handleCapture() {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo) return;

      const predictions = await runInference(model, photo.uri);
      navigation.navigate("Result", { photoUri: photo.uri, predictions });
    } catch (err) {
      console.error("Inference error", err);
    } finally {
      setCapturing(false);
    }
  }

  async function handlePickFromLibrary() {
    if (capturing) return;
    setCapturing(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });
      if (result.canceled) return;

      const photoUri = result.assets[0].uri;
      const predictions = await runInference(model, photoUri);
      navigation.navigate("Result", { photoUri, predictions });
    } catch (err) {
      console.error("Inference error", err);
    } finally {
      setCapturing(false);
    }
  }

  const modelReady = state === "loaded";

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.footer}>
        {state === "loading" && (
          <Text style={styles.loadingText}>Loading model…</Text>
        )}
        {state === "error" && (
          <Text style={styles.loadingText}>Model not available — train and add bird_model.tflite</Text>
        )}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.libraryButton, (!modelReady || capturing) && styles.captureButtonDisabled]}
            onPress={handlePickFromLibrary}
            disabled={!modelReady || capturing}
          >
            <Text style={styles.libraryButtonText}>Library</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureButton, (!modelReady || capturing) && styles.captureButtonDisabled]}
            onPress={handleCapture}
            disabled={!modelReady || capturing}
          >
            {capturing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={styles.captureInner} />
            )}
          </TouchableOpacity>

          <View style={styles.libraryButton} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  footer: {
    position: "absolute",
    bottom: 48,
    width: "100%",
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 24,
  },
  libraryButton: {
    width: 72,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  libraryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingText: {
    color: "#fff",
    marginBottom: 12,
    fontSize: 14,
    opacity: 0.8,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonDisabled: { opacity: 0.4 },
  captureInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  permissionText: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { fontSize: 16, fontWeight: "600" },
});
