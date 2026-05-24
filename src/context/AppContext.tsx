import React, { createContext, useContext, useEffect, useState } from "react";
import { getSightings, initDB, Sighting } from "../services/db";

interface AppContextValue {
  sightings: Sighting[];
  refreshSightings: () => void;
}

const AppContext = createContext<AppContextValue>({
  sightings: [],
  refreshSightings: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sightings, setSightings] = useState<Sighting[]>([]);

  useEffect(() => {
    initDB();
    setSightings(getSightings());
  }, []);

  function refreshSightings() {
    setSightings(getSightings());
  }

  return (
    <AppContext.Provider value={{ sightings, refreshSightings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
