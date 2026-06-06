// === Apex Motors — Type Definitions ===

export type FuelType = 'Benzin' | 'Diesel' | 'Hybrid' | 'Elektro';
export type GearType = 'Manuell' | 'Automatik' | 'Halbautomatik';
export type DriveType = 'FWD' | 'RWD' | 'AWD' | 'Quattro' | '4MATIC' | 'xDrive' | 'Quattro AWD';
export type VehicleBadge = 'NEU' | 'RESERVIERT' | 'PREIS GESENKT' | 'PREMIUM' | 'SONDERMODELL' | '';

export type PriceRatingLevel = 'sehr-gut' | 'gut' | 'fair' | 'erhoeht' | 'hoch';

export interface PriceRating {
  level: PriceRatingLevel;
  label: string;
  deltaPct: number;
  marketAvg: number;
}

export interface PriceRatingMeta {
  label: string;
  color: string;
  accent: string;
  meter: number;
}

export interface VehicleMedia {
  photoCount: number;
  has360: boolean;
  hasVideo: boolean;
  hasInterior360: boolean;
}

export interface VehicleTrust {
  unfallfrei: boolean;
  scheckheft: boolean;
  garantie: string;
  tuv: string;
  sofortVerfuegbar: boolean;
  nichtraucher: boolean;
  hand: number;
  owners: number;
  hu: string;
}

export interface EquipmentGroups {
  assist: string[];
  info: string[];
  komfort: string[];
  perf: string[];
}

export interface DamageHistory {
  accidents: number;
  severity: string | null;
  repairsCertified: boolean;
  lastService: string;
  nextService: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant: string;
  price: number;
  oldPrice?: number;
  monthly?: number;
  year: string;
  km: number;
  hp: number;
  kw: number;
  fuel: FuelType;
  gear: GearType;
  drive: DriveType;
  color: string;
  doors: number;
  ccm: number;
  location: string;
  dealer: string;
  tag: VehicleBadge;
  accent: string;
  desc: string;
  equipment: string[];
  history: [string, string][];
  top: number;
  accel: number;
  consumption: number;
  co2: number;
  em: string;
  imgAlt: string;
  images?: string[];
  isPremium: boolean;
  priceRating: PriceRating;
  media: VehicleMedia;
  trust: VehicleTrust;
  eqGroups: EquipmentGroups;
  damageHistory: DamageHistory;
}

export interface Dealer {
  name: string;
  location: string;
  rating: number;
  reviews: number;
  responseTime: string;
  responseRate: number;
  established: number;
  followers: number;
  staff: number;
  hoursToday: string;
  phone: string;
  email: string;
}

export interface Testimonial {
  name: string;
  car: string;
  quote: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
}

export interface NavItem {
  key: string;
  label: string;
  desc: string;
}

export interface NavColumn {
  title: string;
  items: NavItem[];
}

export interface NavGroup {
  key: string;
  label: string;
  cols: NavColumn[];
}
