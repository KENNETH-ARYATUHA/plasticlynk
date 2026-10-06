// ---------------------------------------------------------------------------
// DataContext.js — temporary in-memory data store.
//
// This stands in for the Django REST API. When the backend is ready, replace
// the bodies of `addCollection` (POST /collections/) and the initial state
// (GET /collections/) and keep the rest of the app unchanged.
//
// NOTE: data resets when the app restarts. That is expected for the mock.
// ---------------------------------------------------------------------------

import React, { createContext, useContext, useState } from 'react';

// DEMO ONLY — replace after field validation of real buyer prices.
export const PRICE_PER_KG_UGX = 1000;

// Logged-in collector (mock). NIN is deliberately NOT here:
// the concept paper says NIN is visible to administrators only.
export const COLLECTOR = {
  id: 'PL-KBL-C001',
  name: 'Demo Collector',
  phone: '+256 7XX XXX XXX',
  area: 'Demo Trading Centre, Kabale District',
  status: 'Verified', // Pending | Verified | Suspended | Deactivated
};

// Three starter records so Home and History aren't empty on first launch.
const SEED = [
  { id: 'PL-KBL-000121', weightKg: 22, amountUGX: 22000, capturedAt: new Date(Date.now() - 86400000).toISOString(), photoUri: null, coords: { lat: -1.2491, lng: 29.9899 }, status: 'Completed' },
  { id: 'PL-KBL-000122', weightKg: 15.5, amountUGX: 15500, capturedAt: new Date(Date.now() - 86400000 + 3600000).toISOString(), photoUri: null, coords: { lat: -1.2493, lng: 29.9901 }, status: 'Completed' },
  { id: 'PL-KBL-000123', weightKg: 38, amountUGX: 38000, capturedAt: new Date(Date.now() - 7200000).toISOString(), photoUri: null, coords: null, status: 'Completed' },
];

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [collections, setCollections] = useState(SEED);

  // Called by the review screen after the collector confirms.
  // Collection IDs follow the paper's format: PL-KBL-000124
  const addCollection = ({ weightKg, photoUri, coords, capturedAt }) => {
    const next = {
      id: `PL-KBL-${String(collections.length + 121).padStart(6, '0')}`,
      weightKg,
      amountUGX: weightKg * PRICE_PER_KG_UGX,
      capturedAt,
      photoUri,
      coords, // null if GPS was unavailable -> server should flag for review
      status: 'Completed',
    };
    // Newest first
    setCollections((prev) => [next, ...prev]);
    return next;
  };

  return (
    <DataContext.Provider value={{ collections, addCollection }}>
      {children}
    </DataContext.Provider>
  );
}

// Convenience hook: const { collections, addCollection } = useData();
export const useData = () => useContext(DataContext);