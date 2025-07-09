export type PropertyUsage = "Residential" | "Commercial";

export type ResidentialPropertyType = 
  | "Residential Land" 
  | "Palace" 
  | "Villa" 
  | "Duplex" 
  | "Apartment" 
  | "Floor" 
  | "Building" 
  | "Residential Complex" 
  | "Other";

export type CommercialPropertyType = 
  | "Commercial Land" 
  | "Showroom" 
  | "Office" 
  | "Commercial Complex" 
  | "Commercial Building" 
  | "Warehouse" 
  | "Workshop" 
  | "Gas Station" 
  | "Other";

export type PropertyType = ResidentialPropertyType | CommercialPropertyType;

export type RequestPurpose = "Buy" | "Rent" | "Financing" | "Partnership" | "Buy via Bank";

export type ClientRole = "Applicant" | "Agent" | "Broker" | "CompanyEmployee" | "Other";

export type CommercialCategory = 
  | "Retail Trade"
  | "Food & Beverages"
  | "Professional Services"
  | "Public Services"
  | "Education & Training"
  | "Entertainment & Tourism"
  | "Sports & Fitness"
  | "Logistics & Storage"
  | "Other";

export type CommercialActivity = string; 

export type ContactPoint = 
  | "Property Sign" 
  | "X Platform (Twitter)" 
  | "Google Maps" 
  | "WhatsApp" 
  | "Snapchat" 
  | "Personal Recommendation" 
  | "Other";

export type RequestStatus = 
  | "جديد" 
  | "جاري العمل" 
  | "تم عرض عقار" 
  | "تم تقديم عرض" 
  | "مرحلة التفاوض" 
  | "مغلق ناجح" 
  | "مغلق غير ناجح" 
  | "ملغى";

export interface FollowUpEntry {
  id: string;
  timestamp: Date;
  notes: string;
  actor?: string; 
}

export interface PropertyRequest {
  id: string; 
  clientName: string;
  clientContact: string; 
  clientEmail?: string; 
  clientRole?: ClientRole; 
  otherClientRole?: string;
  
  requestPurpose?: RequestPurpose;
  usage?: PropertyUsage;
  propertyType?: PropertyType; 
  otherPropertyType?: string; 

  commercialCategory?: CommercialCategory;
  otherCommercialCategory?: string;
  commercialActivity?: CommercialActivity;
  otherCommercialActivity?: string;
  companyName?: string;
  branchCount?: number;

  neighborhoodPreferences?: string[]; 
  mapScreenshot?: string; 
  minArea?: number;
  maxArea?: number;

  contactPoint?: ContactPoint;
  otherContactPoint?: string; 
  notes?: string;
  
  bedrooms?: number; 
  bathrooms?: number; 
  area?: string; 
  budgetMin?: number;
  budgetMax?: number;
  locationQuery?: string; 
  locationCoordinates?: {
    lat: number;
    lng: number;
  };
  additionalNotes?: string; 

  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  followUps?: FollowUpEntry[];
}

export interface Location {
  lat: number;
  lng: number;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatarLetter: string;
  avatarColor: string;
  phone?: string; 
  dateOfBirth?: string;
  idNumber?: string;
  nationality?: string;
  address?: string;
  hireDate?: string;
  contractType?: string;
  directManager?: string;
  permissions?: string[];
  emergencyContact?: EmergencyContact;
}

export interface CommunicationEntry {
  id: string;
  timestamp: Date;
  notes: string;
  employee: string; 
}

export interface TargetedClient {
  id: string;
  name: string;
  contact: string;
  status: string; 
  priority: string; 
  communicationLog?: CommunicationEntry[];
  generalNotes?: string;
  lastCommunication?: {
    employee: string;
    date: Date;
  };
  nextAction?: string; 
  nextActionDate?: Date; 
}

export type PropertyListingPurpose = "For Sale" | "For Rent" | "For Investment";

export interface PropertyOffer {
  id: string; 
  ownerName: string;
  ownerContact: string;
  ownerEmail?: string;

  deedNumber?: string; 
  propertyType?: PropertyType; 
  otherPropertyType?: string;
  purpose?: PropertyListingPurpose; 
  usage?: PropertyUsage; 
  
  neighborhood?: string;
  areaSize?: number; 
  price?: number;
  brokerageAgreementNumber?: string; 
  
  notes?: string;
  locationCoordinates?: Location;
  mapScreenshot?: string; 
  propertyImage?: string; 

  createdAt: Date;
  updatedAt: Date;
}

// For Property Match Calculator
export type RiyadhRegion = "North" | "East" | "West" | "South" | "Central";
export type MatchCalculatorPropertyType = "Office" | "Apartment" | "Villa" | "Commercial Land" | "Residential Land" | "Building" | "Showroom" | "Warehouse" | "Other";
export type MatchCalculatorPurpose = "Buy" | "Rent" | "Investment" | "Financing"; // Align with RequestPurpose subset

export interface MatchCalculatorFormValues {
  purpose?: MatchCalculatorPurpose;
  usage?: PropertyUsage; // Re-use existing PropertyUsage
  propertyType?: MatchCalculatorPropertyType;
  otherPropertyType?: string; // if propertyType is Other
  area?: number;
  neighborhood?: string;
  region?: RiyadhRegion;
  budgetMin?: number;
  budgetMax?: number;
}