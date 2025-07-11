
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

export type ClientAttributePropertyOffer = "Owner" | "Agent" | "Investor" | "Other";

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

export type RiyadhRegion = "North" | "East" | "West" | "South" | "Central" | "Other";


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

  region?: RiyadhRegion;
  neighborhoodPreferences?: string[];
  mapScreenshot?: string;
  minArea?: number;
  maxArea?: number;
  budgetMin?: number;
  budgetMax?: number;

  contactPoint?: ContactPoint;
  otherContactPoint?: string;
  notes?: string;

  bedrooms?: number;
  bathrooms?: number;
  area?: string;
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
  assignedMarketer?: string;
  lastCommunicationNote?: string;
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

export type UserRole = "admin" | "user";

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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

export interface AuthenticatedUser {
  email: string;
  name: string;
  role: UserRole;
}

export interface CommunicationEntry {
  id: string;
  timestamp: string;
  notes: string;
  employee: string;
  date: string;

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
  nextActionDate?: string;
}

export type PropertyListingPurpose = "For Sale" | "For Rent" | "For Investment";
export type RentPriceType = "AnnualUnit" | "PerMeter";

export type ServiceId =
  | 'cleaning_utilities'
  | 'corridor_electricity'
  | 'security_guard'
  | 'general_cleaning'
  | 'general_maintenance'
  | 'electricity_bill_mgmt'
  | 'water_supply'
  | 'civil_defense_compliance'
  | 'elevators'
  | 'parking'
  | 'wifi';

export interface PropertyOffer {
  id: string;
  clientName: string;
  clientContact: string;
  clientEmail?: string;
  clientAttribute?: ClientAttributePropertyOffer;
  otherClientAttribute?: string;

  deedNumber?: string;
  realEstateRegistryNumber?: string;
  propertyType?: PropertyType;
  otherPropertyType?: string;
  purpose?: PropertyListingPurpose;
  usage?: PropertyUsage;

  region?: RiyadhRegion;
  neighborhood?: string;
  areaSize?: number;

  price?: number;
  priceSuffix?: string; 
  rentPriceType?: RentPriceType; 
  askingPrice?: number;

  notes?: string;
  locationCoordinates?: Location;
  mapScreenshot?: string;
  propertyImage?: string;
  propertyProfilePdfUrl?: string;
  services?: ServiceId[];

  createdAt: Date;
  updatedAt: Date;
}

export type MatchCalculatorPropertyType = "Office" | "Apartment" | "Villa" | "Commercial Land" | "Residential Land" | "Building" | "Showroom" | "Warehouse" | "Other";
export type MatchCalculatorPurpose = "Buy" | "Rent" | "Investment" | "Financing";

export interface MatchCalculatorFormValues {
  purpose?: MatchCalculatorPurpose;
  usage?: PropertyUsage;
  propertyType?: MatchCalculatorPropertyType;
  otherPropertyType?: string;
  area?: number;
  region?: RiyadhRegion;
  neighborhood?: string;
  budgetMin?: number;
  budgetMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  commercialCategory?: CommercialCategory;
  otherCommercialCategory?: string;
  services?: ServiceId[];
  yearBuilt?: number;
  floors?: number;
  parkingSpots?: number;
}

export type PropertyStatus = "متاح" | "قيد التفاوض" | "محجوز" | "مباع" | "مؤجر";

export interface ManagedProperty {
  id: string;
  code: string;
  title: string;
  propertyType: PropertyType;
  usage: PropertyUsage;
  listingPurpose: PropertyListingPurpose;
  location: string; 
  region?: RiyadhRegion;
  locationCoordinates?: Location;
  price?: number;
  priceSuffix?: string; 
  rentPriceType?: RentPriceType;
  askingPrice?: number;
  area: number;
  description?: string; 
  status: PropertyStatus;
  advertiserNumber?: string;
  realEstateRegistryNumber?: string;
  deedNumber?: string;
  imageUrl?: string;
  dataAiHint?: string;
  moreImages?: string[];
  features?: string[];
  agent?: { name: string; phone: string; email?: string };
  yearBuilt?: number;
  floors?: number;
  parkingSpots?: number;
  detailedDescription?: string;
  propertyProfilePdfUrl?: string;
  services?: ServiceId[];

  numberOfOffices?: number;
  numberOfShowrooms?: number;
  totalUnits?: number; 
  rentedUnits?: number; 

  createdAt: Date;
  updatedAt?: Date;
}

export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "pending" | "completed" | "overdue";
export type TaskType = "property" | "quote" | "general";

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'document' | 'other';
  size?: number; 
  uploadedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  type: TaskType;
  relatedToEntityId?: string; 
  relatedToDisplayName?: string; 
  assigneeId: string; 
  assigneeName?: string; 
  assignerId?: string; 
  assignerName?: string; 
  createdAt: string;
  updatedAt: string;
  updatedAt: Date;
}

export type MarketTransactionPropertyType =
  | "سكني"
  | "تجاري"
  | "زراعي"
  | "صناعي"
  | "أخرى";

export type MarketTransactionDealType =
  | "بيع"
  | "هبة"
  | "إيجار"
  | "أخرى";

export interface MarketTransaction {
  id: string;
  transactionDate: Date;
  city: string; 
  neighborhood: string;
  propertyType: MarketTransactionPropertyType; 
  propertyUsage?: string; 
  dealType: MarketTransactionDealType;
  areaM2: number;
  priceSAR: number;
  pricePerM2?: number;
  sourceAgency: "MOJ"; 
  rawSourceData?: any; 
  importedAt: Date; 
}

export type QuotationStatus = "مسودة" | "مُرسل" | "مقبول" | "مرفوض" | "مُلغى";
export type PropertyDescriptionType = "managed" | "other" | "none";

export type CommissionType = "amount" | "percentage";
export type QuotationServiceType = "rental_services" | "property_management" | "marketing_services" | "general_consultancy" | "other_services";
export type FinancialCalculationBasis = "per_meter" | "fixed_amount";
export type AdditionalFeeType = "amount" | "percentage";


export interface Quotation {
  id: string;
  quotationNumber?: string; 

  clientName: string;
  clientContact: string;
  clientEmail?: string;
  companyName?: string;

  serviceType: QuotationServiceType;
  otherServiceTypeDetail?: string;
  subject: string;

  propertyDescriptionType?: PropertyDescriptionType;
  linkedManagedPropertyId?: string;
  propertyUsage?: PropertyUsage;
  propertyType?: PropertyType; 
  otherPropertyTypeDetail?: string;
  propertyNeighborhood?: string;
  propertyAreaM2?: number;

  financialCalculationBasis?: FinancialCalculationBasis;
  pricePerMeter?: number;
  fixedAmountForService?: number;
  
  calculatedPropertyOrServiceBaseValue: number; 

  hasAdditionalFees?: boolean;
  additionalFeeType?: AdditionalFeeType;
  additionalFeeValue?: number; 
  calculatedAdditionalFeeAmount: number; 

  subTotalBeforeTax: number; 
  taxPercentage: number; 
  calculatedTaxAmount: number; 

  finalQuotedAmountToClient: number; 

  commissionType?: CommissionType;
  commissionValue?: number; 
  calculatedCommissionAmount: number; 
  
  contractDurationYears?: number;
  gracePeriodDays?: number;
  issueDate: Date;
  validityPeriodDays?: number;
  expiryDate?: Date | null; 

  scopeOfWork?: string;
  paymentTerms?: string;
  termsAndConditions?: string;
  
  status: QuotationStatus;
  currency: "SAR";
  
  includedPropertyServices?: ServiceId[];

  createdAt: Date;
  updatedAt: Date;
}
