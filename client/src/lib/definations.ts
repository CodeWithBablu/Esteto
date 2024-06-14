export interface UserType {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  lastSeenAt: string;
}

export interface Estate {
  _id: string;
  title: string;
  price: number;
  images: string[];
  address: string;
  city: string;
  bedroom: number;
  bathroom: number;
  latitude: string;
  longitude: string;
  type: "buy" | "rent";
  property: "apartment" | "house" | "condo";
  createdAt?: string;
  updatedAt?: string;
  isSaved?: boolean;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  postdetail: {
    _id: string;
    desc: string;
    utilities: string;
    pet: string;
    income: string;
    size: number;
    school: number;
    bus: number;
    restaurant: number;
  };
}

export interface EstateRaw {
  _id: string;
  title: string;
  price: number;
  images: string[];
  address: string;
  city: string;
  bedroom: number;
  bathroom: number;
  latitude: string;
  longitude: string;
  type: "buy" | "rent";
  property: "apartment" | "house" | "condo";
  createdAt?: string;
  updatedAt?: string;
  isSaved?: boolean;
  user: string;
  postdetail: string;
}

export interface ChatType {
  _id: string;
  messages: string[];
  participants: UserType[];
  post: {
    title: string;
    images: [string];
    address: string;
    city: string;
  };
  seenBy: string[];
  latestMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageType {
  chatId: string;
  text: string;
  sender: string;
  createdAt: string;
}

export interface City {
  city: string;
  coordinates: {
    lon: number;
    lat: number;
  };
}

export interface Address {
  place: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface Country {
  iso2: string;
  coordinates: { lon: number; lat: number };
  country: string;
}

export interface Viewport {
  width?: number | string;
  height?: number | string;
  latitude: number;
  longitude: number;
  zoom?: number;
}

export interface GeoJSONFeature {
  type: string;
  id: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: Properties;
}

interface Properties {
  mapbox_id: string;
  feature_type: string;
  full_address: string;
  name: string;
  name_preferred: string;
  coordinates: Coordinates;
  place_formatted: string;
  context: Context;
}

interface Coordinates {
  longitude: number;
  latitude: number;
}

interface Context {
  street?: Record<string, string>;
  neighborhood?: Record<string, string>;
  postcode?: Record<string, string>;
  locality?: Record<string, string>;
  place?: Record<string, string>;
  district: District;
  region: Region;
  country?: Record<string, string>;
}

interface District {
  mapbox_id: string;
  name: string;
}

interface Region {
  mapbox_id: string;
  name: string;
  region_code: string;
  region_code_full: string;
}
