"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface StorageUnit {
  id: string;
  name: string;
  title: string;
  model: string;
  type: string;
  location: string;
  temperature: number;
  status: "Safe" | "Warning" | "Breach" | "Offline";
  stability: number;
  battery: number;
  batteryStatus: string;
  seal: "Closed" | "Micro-leak" | "Ajar";
  doses: number;
  payload: string;
  humidity: number;
  powerSource: string;
  lastDefrost: string;
  history: number[];
}

export interface AlertItem {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info" | "resolved";
  timestamp: string;
  unitId: string;
  acknowledged: boolean;
}

interface TelemetryContextType {
  units: StorageUnit[];
  isLiveStreaming: boolean;
  setIsLiveStreaming: (val: boolean) => void;
  isBreachSimulated: boolean;
  triggerSimulatedBreach: () => void;
  calibrateSensors: () => void;
  dispatchPreventativeAction: () => void;
  selectedUnitFilter: string;
  setSelectedUnitFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  alerts: AlertItem[];
  acknowledgeAlert: (id: string) => void;
  triageChecklist: { [key: number]: boolean };
  toggleChecklistItem: (index: number) => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const initialUnits: StorageUnit[] = [
  {
    id: "unitA",
    name: "Unit A",
    title: "Storage Unit A — Primary Clinical Refrigerator",
    model: "FG-REF-101",
    type: "Undercounter Bio-Pharma Refrigerator",
    location: "Main Hospital Cold Lab 101 • Grid Bay 3",
    temperature: 4.2,
    status: "Safe",
    stability: 99.8,
    battery: 98,
    batteryStatus: "Charging",
    seal: "Closed",
    doses: 3800,
    payload: "mRNA Pfizer Comirnaty & Moderna Spikevax",
    humidity: 42,
    powerSource: "Mains Grid (UPS Backup Ready)",
    lastDefrost: "22m ago",
    history: [4.1, 4.3, 4.2, 4.2, 4.1, 4.2, 4.2],
  },
  {
    id: "unitB",
    name: "Unit B",
    title: "Storage Unit B — Portable Cryo-Carrier",
    model: "CC-842",
    type: "Portable Cryo-Carrier",
    location: "Transit Van 02 • Route Regional Hub #4",
    temperature: 7.6,
    status: "Warning",
    stability: 88.4,
    battery: 84,
    batteryStatus: "Discharging",
    seal: "Micro-leak",
    doses: 240,
    payload: "mRNA COVID-19 & Pneumococcal Conjugate (240 Doses)",
    humidity: 59,
    powerSource: "Internal Lithium-Ion Array",
    lastDefrost: "Passive Coolant Matrix",
    history: [4.8, 5.2, 5.9, 6.4, 7.1, 7.4, 7.6],
  },
  {
    id: "unitC",
    name: "Unit C",
    title: "Storage Unit C — Deep Reserve Freezer",
    model: "FG-FRZ-305",
    type: "Deep Reserve Ultra-Freezer",
    location: "Sub-level Cryo Vault • Lab B",
    temperature: 3.8,
    status: "Safe",
    stability: 99.4,
    battery: 100,
    batteryStatus: "Mains",
    seal: "Closed",
    doses: 5400,
    payload: "Varicella, MMR II, & Rotavirus",
    humidity: 38,
    powerSource: "Three-Phase Industrial Circuit",
    lastDefrost: "4h ago",
    history: [3.9, 3.8, 3.7, 3.8, 3.9, 3.8, 3.8],
  },
  {
    id: "unitD",
    name: "Unit D",
    title: "Storage Unit D — Clinical Dispensing Cooler",
    model: "FG-DISP-09",
    type: "Rapid-Access Dispensing Cooler",
    location: "Emergency Clinic Bay 4 • Ambulatory Care",
    temperature: 4.9,
    status: "Safe",
    stability: 99.1,
    battery: 91,
    batteryStatus: "Internal Backup",
    seal: "Closed",
    doses: 3010,
    payload: "Influenza Quadrivalent & Tdap",
    humidity: 45,
    powerSource: "Mains Grid",
    lastDefrost: "1h ago",
    history: [4.8, 5.0, 4.9, 4.9, 5.0, 4.8, 4.9],
  },
];

const initialAlerts: AlertItem[] = [
  {
    id: "alt-1",
    code: "ALT-2024-089",
    title: "Warning: Unit B Temp Spike",
    description: "Sensor thermistor T-02 recorded +7.6°C (+0.4°C over 10m). ETA to +8.0°C limit: ~42m.",
    severity: "warning",
    timestamp: "4 min ago",
    unitId: "unitB",
    acknowledged: false,
  },
  {
    id: "alt-2",
    code: "EVT-2024-088",
    title: "Info: Unit A Auto-Defrost Cycle",
    description: "Cycle completed normally (+4.2°C stabilized). Compressors functioning nominally.",
    severity: "info",
    timestamp: "22 min ago",
    unitId: "unitA",
    acknowledged: true,
  },
  {
    id: "alt-3",
    code: "RES-2024-087",
    title: "Resolved: Unit C Door Seal Check",
    description: "Magnetic seal re-engaged by laboratory technician. Temperature restored to nominal.",
    severity: "resolved",
    timestamp: "1 hour ago",
    unitId: "unitC",
    acknowledged: true,
  },
];

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [units, setUnits] = useState<StorageUnit[]>(initialUnits);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [isBreachSimulated, setIsBreachSimulated] = useState<boolean>(false);
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [triageChecklist, setTriageChecklist] = useState<{ [key: number]: boolean }>({
    1: true,
    2: false,
    3: false,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Real-time sensor stream simulation
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setUnits((prevUnits) =>
        prevUnits.map((u) => {
          let delta = (Math.random() - 0.5) * 0.04;
          if (u.id === "unitB" && isBreachSimulated) {
            delta = Math.random() * 0.08 + 0.02; // upward climb
          }
          let newTemp = Math.round((u.temperature + delta) * 10) / 10;
          
          let newStatus = u.status;
          if (newTemp > 8.0) {
            newStatus = "Breach";
          } else if (newTemp >= 7.0 || newTemp <= 2.2) {
            newStatus = "Warning";
          } else {
            newStatus = "Safe";
          }

          const newHistory = [...u.history.slice(1), newTemp];
          return {
            ...u,
            temperature: newTemp,
            status: newStatus,
            history: newHistory,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveStreaming, isBreachSimulated]);

  const triggerSimulatedBreach = () => {
    if (!isBreachSimulated) {
      setIsBreachSimulated(true);
      setUnits((prev) =>
        prev.map((u) =>
          u.id === "unitB"
            ? { ...u, temperature: 8.3, status: "Breach", seal: "Ajar" }
            : u
        )
      );
      setAlerts((prev) => [
        {
          id: "alt-breach-" + Date.now(),
          code: "EXC-2024-099",
          title: "CRITICAL BREACH: Unit B Excursion Above +8.0°C",
          description: "Core thermistor T-02 reported +8.3°C. WHO PQS violation threshold reached!",
          severity: "critical",
          timestamp: "Just now",
          unitId: "unitB",
          acknowledged: false,
        },
        ...prev,
      ]);
      showToast("⚠️ Simulated Thermal Breach Triggered: Unit B exceeded +8.0°C threshold!");
    } else {
      setIsBreachSimulated(false);
      setUnits((prev) =>
        prev.map((u) =>
          u.id === "unitB"
            ? { ...u, temperature: 7.6, status: "Warning", seal: "Micro-leak" }
            : u
        )
      );
      showToast("ℹ️ Simulated breach stopped. Reverted to standard drift state.");
    }
  };

  const calibrateSensors = () => {
    setIsBreachSimulated(false);
    setUnits((prev) =>
      prev.map((u) => {
        let nominalTemp = 4.2;
        if (u.id === "unitA") nominalTemp = 4.2;
        if (u.id === "unitB") nominalTemp = 4.5;
        if (u.id === "unitC") nominalTemp = 3.8;
        if (u.id === "unitD") nominalTemp = 4.9;
        return {
          ...u,
          temperature: nominalTemp,
          status: "Safe",
          seal: "Closed",
          stability: 99.8,
        };
      })
    );
    showToast("✅ NIST Traceable Calibration Complete! All unit thermistors zeroed to nominal safe zone.");
  };

  const dispatchPreventativeAction = () => {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === "unitB"
          ? { ...u, temperature: 4.8, status: "Safe", seal: "Closed", stability: 98.9 }
          : u
      )
    );
    setTriageChecklist({ 1: true, 2: true, 3: true });
    showToast("🚀 Preventative Action Dispatched: Driver engaged secondary latch. Cooling restored!");
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
    showToast("Incident acknowledged and logged in GXP compliance audit stream.");
  };

  const toggleChecklistItem = (index: number) => {
    setTriageChecklist((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <TelemetryContext.Provider
      value={{
        units,
        isLiveStreaming,
        setIsLiveStreaming,
        isBreachSimulated,
        triggerSimulatedBreach,
        calibrateSensors,
        dispatchPreventativeAction,
        selectedUnitFilter,
        setSelectedUnitFilter,
        searchQuery,
        setSearchQuery,
        alerts,
        acknowledgeAlert,
        triageChecklist,
        toggleChecklistItem,
        toastMessage,
        setToastMessage,
        mobileMenuOpen,
        setMobileMenuOpen,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error("useTelemetry must be used within a TelemetryProvider");
  }
  return context;
}
