import * as SQLite from "expo-sqlite";

export interface Sighting {
  id: number;
  species: string;
  confidence: number;
  classIndex: number;
  photoUri: string;
  timestamp: string;
}

const db = SQLite.openDatabaseSync("birdapp.db");

export function initDB(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS sightings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      species TEXT NOT NULL,
      confidence INTEGER NOT NULL,
      class_index INTEGER NOT NULL,
      photo_uri TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);
}

export function saveSighting(
  species: string,
  confidence: number,
  classIndex: number,
  photoUri: string
): void {
  const timestamp = new Date().toISOString();
  db.runSync(
    "INSERT INTO sightings (species, confidence, class_index, photo_uri, timestamp) VALUES (?, ?, ?, ?, ?)",
    [species, confidence, classIndex, photoUri, timestamp]
  );
}

export function getSightings(): Sighting[] {
  const rows = db.getAllSync<{
    id: number;
    species: string;
    confidence: number;
    class_index: number;
    photo_uri: string;
    timestamp: string;
  }>("SELECT * FROM sightings ORDER BY timestamp DESC");

  return rows.map((r) => ({
    id: r.id,
    species: r.species,
    confidence: r.confidence,
    classIndex: r.class_index,
    photoUri: r.photo_uri,
    timestamp: r.timestamp,
  }));
}

export function deleteSighting(id: number): void {
  db.runSync("DELETE FROM sightings WHERE id = ?", [id]);
}
