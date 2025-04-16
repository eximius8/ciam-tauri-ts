import Database from '@tauri-apps/plugin-sql';

export interface Ngdu {
  id: string;
  uid: string;
  baseId: string;
  abbrev: string;
  title: string;
}

export interface Workshop {
  id: string;
  uuid: string | null;
  baseId: string;
  abbrev: string;
  title: string;
  extendedTitle: string;
  ngduId: string;
}

export interface Well {
  id: string;
  uuid: string | null;
  baseId: string;
  number: string;
  workshopId: string;
}

export interface Measurement {
  id: string;
  creationdtm: string;
  source: string | null;
  ngdu_id: string | null;
  mtype: string | null;
  operator: string | null;
  bush: string | null;
  type_hr: string | null;
  workshop_id: string | null;
  well_id: string | null;
  mdt: string | null;
  meta: string | null; // JSON data as string
  device_meta: string | null; // JSON data as string
  dataArray: string | null; // JSON data as string
}

export interface DBInfo {
  ngduNum: number;
  workshopNum: number;
  wellNum: number;
  measurementNum: number;
}

export interface DBContextValue {
  db: Database | null;
  isDBLoading: boolean;
  error: string | null;
  selectQuery: <T>(query: string, params?: any[]) => Promise<T[]>;
  executeQuery: (query: string, params?: any[]) => Promise<any>;
  clearDB: () => Promise<void>;
  fetchNgdus: () => Promise<Ngdu[]>;
  fetchWorkshops: () => Promise<Workshop[]>;
  fetchWells: () => Promise<Well[]>;
  fetchMeasurements: () => Promise<Measurement[]>;
}