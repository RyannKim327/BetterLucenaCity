export interface EvacuationCenter {
  id?: string;
  name: string;
  barangay: string;
  latitude: number;
  longitude: number;
}

export type DisasterType = "earthquake" | "flood" | "typhoon" | "fire";

export interface DisasterTip {
  id: DisasterType;
  title: string;
  description: string;
  tips: string[];
}
