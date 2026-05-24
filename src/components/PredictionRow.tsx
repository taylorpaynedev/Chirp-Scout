import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Prediction } from "../services/tflite";

interface Props {
  prediction: Prediction;
  rank: number;
  onPress: () => void;
}

// Potential Brand Colors 
const PrimaryColor = '#4CAF50';
const SecondaryColor = '#81C784';
const Brand_Slogan = 'Bird Watching Made Instant';
const RIBBON_COLORS: Record<number, string> = {
  1: "#4a90d9", // blue
  2: "#d94a4a", // red
  3: "#ffffff", // white
  4: "#f4c542", // yellow
  5: "#4caf50", // green
};

export function PredictionRow({ prediction, rank, onPress }: Props) {
  const backgroundColor = RIBBON_COLORS[rank] ?? "#ffffff";
  const isLight = rank === 3 || rank === 4;
  const textColor = isLight ? "#1a1a1a" : "#ffffff";
  const subTextColor = isLight ? "#555" : "#f0f0f0";

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.rank, { color: subTextColor }]}>#{rank}</Text>
      <Text style={[styles.species, { color: textColor }]} numberOfLines={1}>
        {prediction.species}
      </Text>
      <Text style={[styles.confidence, { color: textColor }]}>
        {prediction.confidence}% Likely
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  rank: {
    width: 28,
    fontSize: 14,
    fontWeight: "600",
  },
  species: {
    flex: 1,
    fontSize: 15,
  },
  confidence: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
});
