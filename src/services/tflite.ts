import { Asset } from "expo-asset";
import { File } from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { useTensorflowModel, TfliteModel } from "react-native-fast-tflite";
// @ts-ignore – jpeg-js has no bundled types
import jpegJs from "jpeg-js";

const MODEL_ASSET = require("../../assets/model/bird_model.tflite");
const LABELS_ASSET = require("../../assets/model/labels.txt");

export interface Prediction {
  index: number;
  species: string;
  confidence: number;
}

let labelsCache: string[] | null = null;

async function loadLabels(): Promise<string[]> {
  if (labelsCache !== null) return labelsCache;
  const [asset] = await Asset.loadAsync(LABELS_ASSET);
  const text = await new File(asset.localUri!).text();
  labelsCache = text.trim().split("\n");
  return labelsCache;
}

export function useBirdModel() {
  return useTensorflowModel(MODEL_ASSET, []);
}

export async function runInference(
  model: TfliteModel | undefined,
  photoUri: string,
  topK = 5
): Promise<Prediction[]> {
  if (!model) throw new Error("Model not loaded");

  const labels = await loadLabels();

  // Resize photo to 224x224 JPEG
  const { uri: resizedUri } = await ImageManipulator.manipulateAsync(
    photoUri,
    [{ resize: { width: 224, height: 224 } }],
    { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
  );

  // Read JPEG as base64, decode raw RGBA pixels with jpeg-js
  const base64 = await new File(resizedUri).base64();
  const jpegBytes = Buffer.from(base64, "base64");
  const { data: rgba, width, height } = jpegJs.decode(jpegBytes, {
    useTArray: true,
  }) as { data: Uint8Array; width: number; height: number };

  // Convert RGBA → normalized Float32Array [H * W * 3]
  const float32 = new Float32Array(width * height * 3);
  for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
    float32[j] = rgba[i] / 255;
    float32[j + 1] = rgba[i + 1] / 255;
    float32[j + 2] = rgba[i + 2] / 255;
  }

  // runSync expects ArrayBuffer[]; output is also ArrayBuffer[]
  const output = model.runSync([float32.buffer as ArrayBuffer]);
  const scores = new Float32Array(output[0]);

  const indexed = Array.from(scores).map((score, i) => ({ index: i, score }));
  indexed.sort((a, b) => b.score - a.score);

  return indexed.slice(0, topK).map(({ index, score }) => ({
    index,
    species: labels[index] ?? `Class ${index}`,
    confidence: Math.round(score * 100),
  }));
}
