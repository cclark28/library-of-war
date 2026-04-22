export type ServiceBranch =
  | 'army'
  | 'navy'
  | 'marines'
  | 'air_force'
  | 'coast_guard'
  | 'special_forces';

export type CasualtyStatus = 'kia' | 'mia' | 'wia' | 'pow';

export type WarEra =
  | 'wwi'
  | 'wwii'
  | 'korea'
  | 'vietnam'
  | 'gulf'
  | 'iraq'
  | 'afghanistan'
  | 'iran';

export interface Soldier {
  id: string;
  first_name: string;
  last_name: string;
  rank: string;
  branch: ServiceBranch;
  status: CasualtyStatus;
  era: WarEra;
  date_of_casualty: string;   // ISO 8601
  date_of_birth?: string;     // ISO 8601 — used for duplicate detection
  age_at_casualty?: number;
  hometown_city?: string;
  hometown_state?: string;
  battle_location: string;
  battle_lat: number;
  battle_lng: number;
  unit?: string;
  service_number?: string;
  photo_url?: string;
  photo_credit?: string;
  source_url?: string;
  source_label?: string;      // e.g. "VVMF Wall of Faces"
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SoldierGeoFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: Soldier;
}

export interface MapFilters {
  era: WarEra | 'all';
  branch: ServiceBranch | 'all';
  status: CasualtyStatus | 'all';
  search: string;
}
