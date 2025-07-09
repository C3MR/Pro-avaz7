
// This file is no longer the primary source for listed requests data.
// The page /app/dashboard/listed-requests/page.tsx now fetches data from Firestore.
// This file can be kept for type definitions or helper functions if needed for seeding/testing,
// or eventually removed if all its contents are migrated or become obsolete.

import type { PropertyRequest, RequestPurpose, PropertyUsage, PropertyType, CommercialCategory, ContactPoint, ClientRole, RequestStatus } from "@/types";

// Helper function to parse date strings (DD/MM/YY ...)
// Updated to handle potential time part and different year formats.
const parseDate = (dateStr?: string): Date => {
  if (!dateStr) return new Date();

  const dateTimeParts = dateStr.split(' ');
  const datePartOnly = dateTimeParts[0];
  const parts = datePartOnly.split('/');

  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    if (year < 100) {
      year = (year >= 70 && year <=99) ? year + 1900 : year + 2000;
    }

    let hours = 0, minutes = 0, seconds = 0;
    if (dateTimeParts.length > 1 && dateTimeParts[1].includes(':')) {
        const timeParts = dateTimeParts[1].split(':');
        if (timeParts.length >= 2) {
            hours = parseInt(timeParts[0], 10);
            minutes = parseInt(timeParts[1], 10);
        }
        if (timeParts.length === 3) {
            seconds = parseInt(timeParts[2], 10);
        }
    }
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  const parsedDate = new Date(dateStr);
  if (!isNaN(parsedDate.getTime())) return parsedDate;

  return new Date();
};


const convertArabicNumerals = (str?: string): string => {
  if (!str) return "";
  return str.replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
};

const parseArea = (areaString?: string): { minArea?: number; maxArea?: number } => {
  if (!areaString || String(areaString).trim() === "-" || String(areaString).trim() === "") return {};

  const westernNumeralsString = convertArabicNumerals(String(areaString));
  const cleanedString = westernNumeralsString.replace(/م²|م|,|sqm|sq\.m/gi, "").trim();

  const parts = cleanedString.split('-').map(p => p.trim());
  const result: { minArea?: number; maxArea?: number } = {};

  if (parts.length === 2) {
    const min = parseInt(parts[0].replace(/\D/g, ''), 10);
    const max = parseInt(parts[1].replace(/\D/g, ''), 10);
    if (!isNaN(min)) result.minArea = min;
    if (!isNaN(max)) result.maxArea = max;
  } else if (parts.length === 1 && parts[0]) {
    const val = parseInt(parts[0].replace(/\D/g, ''), 10);
    if (!isNaN(val)) {
      result.minArea = val;
      result.maxArea = val;
    }
  }
  return result;
};


const mapRequestPurpose = (sheetPurpose?: string): RequestPurpose | undefined => {
  if (!sheetPurpose) return undefined;
  const lowerCasePurpose = String(sheetPurpose).toLowerCase().trim();
  if (lowerCasePurpose.includes("شراء") && (lowerCasePurpose.includes("ايجار") || lowerCasePurpose.includes("إيجار"))) return "Buy";
  if (lowerCasePurpose.includes("شراء") || lowerCasePurpose.includes("بيع") || lowerCasePurpose.includes("تمليك")) return "Buy";
  if (lowerCasePurpose.includes("ايجار") || lowerCasePurpose.includes("إيجار") || lowerCasePurpose.includes("أيجار")) return "Rent";
  if (lowerCasePurpose.includes("استثمار")) return "Buy";
  return undefined;
};

const mapPropertyUsage = (sheetUsage?: string): PropertyUsage | undefined => {
  if (!sheetUsage) return undefined;
  const lowerCaseUsage = String(sheetUsage).toLowerCase().trim();
  if (lowerCaseUsage.includes("سكني")) return "Residential";
  if (lowerCaseUsage.includes("تجاري")) return "Commercial";
  return undefined;
};

const mapPropertyType = (sheetType?: string, usage?: PropertyUsage): PropertyType | undefined => {
  if (!sheetType) return undefined;
  const type = String(sheetType).toLowerCase().trim();

  if (type.includes("فيلا") || type.includes("فله")) return "Villa";
  if (type.includes("شقة") || type.includes("شقق")) return "Apartment";
  if (type.includes("قصر")) return "Palace";
  if (type.includes("دور") && !type.includes("أدوار ومكاتب")) return "Floor";

  if (type.includes("ارض تجارية") || type.includes("أرض تجاريه") || type.includes("ارض إستثمارية")) return "Commercial Land";
  if (type.includes("ارض سكنية") || type.includes("أرض سكنيه")) return "Residential Land";
  if (type.includes("ارض صناعية")) return "Commercial Land";
  if (type.includes("ارض") || type.includes("أرض")) {
    if (usage === "Residential") return "Residential Land";
    if (usage === "Commercial") return "Commercial Land";
    return "Other"; // Fallback if usage not specified for "ارض"
  }

  if (type.includes("عمارة تجارية") || type.includes("عماره تجاريه")) return "Commercial Building";
  if (type.includes("عمارة سكنية") || type.includes("عماره سكنيه")) return "Building";
  if (type.includes("عمارة بالكامل") && usage === "Commercial") return "Commercial Building";
  if (type.includes("عمارة") || type.includes("عماره") || (type.includes("عمائر") && !type.includes("تجارية"))) {
    if (usage === "Residential") return "Building";
    if (usage === "Commercial") return "Commercial Building";
    return "Other"; // Fallback if usage not specified for "عمارة"
  }

  if (type.includes("مجمع تجاري") || type.includes("مجمع")) return "Commercial Complex";
  if (type.includes("مكتب") || type.includes("مكاتب") || type.includes("أدوار ومكاتب")) return "Office";
  if (type.includes("معرض") || type.includes("معارض")) return "Showroom";
  if (type.includes("شقق فندقية")) return "Commercial Complex";
  if (type.includes("استراحة") || type.includes("إستراحه")) return "Other";
  if (type.includes("مستودع")) return "Warehouse";

  return "Other";
};

const mapClientRole = (sheetRole?: string): ClientRole | undefined => {
    if (!sheetRole) return "Applicant";
    const lowerCaseRole = String(sheetRole).toLowerCase().trim();
    if (lowerCaseRole.includes("صاحب الطلب") || lowerCaseRole.includes("مقدم الطلب") || lowerCaseRole.includes("طالب")) return "Applicant";
    if (lowerCaseRole.includes("وكيل")) return "Agent";
    if (lowerCaseRole.includes("وسيط")) return "Broker";
    return "Applicant";
};

const mapCommercialCategory = (sheetCategory?: string): CommercialCategory | undefined => {
    if(!sheetCategory) return undefined;
    const cat = String(sheetCategory).trim();
    if (cat.includes("صحة") || cat.includes("تعليم")) return "Education & Training";
    if (cat.includes("عقارات") || cat.includes("مقاولات")) return "Professional Services";
    if (cat.includes("اغذية") || cat.includes("أغذية") || cat.includes("مشروبات") || cat.includes("مطاعم") || cat.includes("كافيهات")) return "Food & Beverages";
    if (cat.includes("ترفيه") || cat.includes("نقل") || cat.includes("سياحة")) return "Entertainment & Tourism";
    if (cat.includes("سيارات") || cat.includes("مركبات")) return "Retail Trade";
    if (cat.includes("رياضة") || cat.includes("لياقة")) return "Sports & Fitness";
    if (cat.includes("تخزين") || cat.includes("لوجستي")) return "Logistics & Storage";
    return "Other";
};

const mapContactPoint = (sheetContactPoint?: string): ContactPoint | undefined => {
    if (!sheetContactPoint) return undefined;
    const cp = String(sheetContactPoint).toLowerCase().trim();
    if (cp.includes("لوحة على عقار") || cp.includes("لوحة")) return "Property Sign";
    if (cp.includes("تويتر") || cp.includes("اكس")) return "X Platform (Twitter)";
    if (cp.includes("قوقل ماب") || cp.includes("خرائط جوجل")) return "Google Maps";
    if (cp.includes("واتساب")) return "WhatsApp";
    if (cp.includes("سناب شات") || cp.includes("سناب")) return "Snapchat";
    if (cp.includes("توصية شخص") || cp.includes("توصيه")) return "Personal Recommendation";
    return "Other";
};

const parseNeighborhoods = (neighborhoodsStr?: string): string[] | undefined => {
    if (!neighborhoodsStr || String(neighborhoodsStr).trim() === "-") return undefined;
    return String(neighborhoodsStr).split(/،|,|\sو\s|\sأو\s|أو|\s-\s|\//).map(n => n.trim()).filter(n => n && n.toLowerCase() !== 'او' && n.length > 1);
};

const parseBudget = (budgetStr?: string): number | undefined => {
    if (!budgetStr || String(budgetStr).trim() === "-" || String(budgetStr).trim() === "") return undefined;
    const cleaned = convertArabicNumerals(String(budgetStr)).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? undefined : num;
};


// Data is now fetched from Firestore in the page component.
// This array can be used for seeding data or for local testing if needed.
export const listedRequestsData: PropertyRequest[] = [
  // Data from the provided image (14 requests)
  // All statuses set to "جاري العمل"
  // All assignedMarketer set to "فريق أفاز"
  // lastCommunicationNote is taken from 'الملاحظات' column
  // budgetMin/budgetMax is parsed from 'الميزانية المرصودة'
  {
    id: "TRN-001",
    createdAt: parseDate("22/04/70 12:15:44"), // Note: '70' will be 1970
    clientName: "صالح صديق",
    clientContact: "0561223553",
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("مكتب", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("الصحة والتعليم"),
    companyName: "شركة المصادر الدولية لصحة البيئة",
    neighborhoodPreferences: parseNeighborhoods("شمال الرياض"),
    ...parseArea("250 - 350"),
    budgetMax: parseBudget("1,500.00"), // Assuming this is max, min can be undefined
    status: "جاري العمل",
    lastCommunicationNote: "من شمال الدايري الى جنوب طريق الملك سلمان او معتدين تكون مساحة مفتوحة ويحصل المواقع الجاهزة",
    updatedAt: parseDate("22/04/70 12:15:44"),
    assignedMarketer: "فريق أفاز",
    notes: "من شمال الدايري الى جنوب طريق الملك سلمان او معتدين تكون مساحة مفتوحة ويحصل المواقع الجاهزة",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint("لوحة على عقار"),
  },
  {
    id: "TRN-002",
    createdAt: parseDate("22/04/24"),
    clientName: "ناصر عبدالله",
    clientContact: "0505893330",
    requestPurpose: mapRequestPurpose("بيع"), // map to Buy
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("أرض تجاريه", mapPropertyUsage("تجاري")),
    neighborhoodPreferences: parseNeighborhoods("الرياض"),
    ...parseArea("٣١١٠م"),
    budgetMin: parseBudget("١٦ مليون"),
    budgetMax: parseBudget("١٦ مليون"),
    status: "جاري العمل",
    lastCommunicationNote: "ارغب في شراء ارض تجارية في الرياض بقيمة ١٦ مليون ريال.",
    updatedAt: parseDate("22/04/24"),
    assignedMarketer: "فريق أفاز",
    notes: "ارغب في شراء ارض تجارية في الرياض بقيمة ١٦ مليون ريال.",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint(""), // Empty in sheet
  },
  {
    id: "TRN-003",
    createdAt: parseDate("22/04/24"),
    clientName: "تركي محمد",
    clientContact: "0552625280",
    requestPurpose: mapRequestPurpose("شراء"),
    usage: mapPropertyUsage("سكني"),
    propertyType: mapPropertyType("فيلا", mapPropertyUsage("سكني")),
    neighborhoodPreferences: parseNeighborhoods("الرياض"),
    ...parseArea("٣٠٠ - ٤٠٠م"),
    budgetMin: parseBudget("٢ مليون"),
    budgetMax: parseBudget("٢ مليون و ٥٠٠ الف"),
    status: "جاري العمل",
    lastCommunicationNote: "أرغب في شراء فلة في الرياض بمساحة بين ٣٠٠ و ٤٠٠ متر مربع وبميزانية من ٢ مليون إلى ٢ مليون و ٥٠٠ ألف.",
    updatedAt: parseDate("22/04/24"),
    assignedMarketer: "فريق أفاز",
    notes: "أرغب في شراء فلة في الرياض بمساحة بين ٣٠٠ و ٤٠٠ متر مربع وبميزانية من ٢ مليون إلى ٢ مليون و ٥٠٠ ألف.",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint(""),
  },
  {
    id: "TRN-004",
    createdAt: parseDate("22/04/24"),
    clientName: "محمد حمد",
    clientContact: "0503288880",
    requestPurpose: mapRequestPurpose("شراء"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("أرض تجارية", mapPropertyUsage("تجاري")),
    neighborhoodPreferences: parseNeighborhoods("العارض أو الخير"),
    ...parseArea("2717"),
    budgetMin: parseBudget("8 مليون و 500 ألف"),
    budgetMax: parseBudget("8 مليون و 500 ألف"),
    status: "جاري العمل",
    lastCommunicationNote: "أرغب في شراء أرض في العارض أو الخير بمساحة ٢٧١٧ متر مربع وبميزانية ٨ مليون و ٥٠٠ ألف.",
    updatedAt: parseDate("22/04/24"),
    assignedMarketer: "فريق أفاز",
    notes: "أرغب في شراء أرض في العارض أو الخير بمساحة ٢٧١٧ متر مربع وبميزانية ٨ مليون و ٥٠٠ ألف.",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint("توصية شخص"),
  },
  {
    id: "TRN-005",
    createdAt: parseDate("21/04/24"),
    clientName: "مساعد",
    clientContact: "0503238130",
    requestPurpose: mapRequestPurpose("شراء"),
    usage: mapPropertyUsage("سكني"),
    propertyType: mapPropertyType("فيلا", mapPropertyUsage("سكني")),
    neighborhoodPreferences: parseNeighborhoods("النرجس"),
    ...parseArea(""), // Empty in sheet
    budgetMin: parseBudget("3 مليون"),
    budgetMax: parseBudget("3 مليون"),
    status: "جاري العمل",
    lastCommunicationNote: "ابحث عن فيلا في حي النرجس بسعر ٣ مليون ريال.",
    updatedAt: parseDate("21/04/24"),
    assignedMarketer: "فريق أفاز",
    notes: "ابحث عن فيلا في حي النرجس بسعر ٣ مليون ريال.",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint("لوحة على عقار"),
  },
  {
    id: "TRN-006",
    createdAt: parseDate("21/04/24"),
    clientName: "عبدالله القحطاني",
    clientContact: "0504238090",
    requestPurpose: mapRequestPurpose("شراء"),
    usage: mapPropertyUsage("سكني"),
    propertyType: mapPropertyType("فيلا", mapPropertyUsage("سكني")),
    neighborhoodPreferences: parseNeighborhoods("النرجس"),
    ...parseArea(""),
    budgetMin: parseBudget("٣ مليون و ٣٠٠ الف"),
    budgetMax: parseBudget("٣ مليون و ٣٠٠ الف"),
    status: "جاري العمل",
    lastCommunicationNote: "ابحث عن فيلا في النرجس بسعر ٣ مليون و ٣٠٠ ألف ريال.",
    updatedAt: parseDate("21/04/24"),
    assignedMarketer: "فريق أفاز",
    notes: "ابحث عن فيلا في النرجس بسعر ٣ مليون و ٣٠٠ ألف ريال.",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint("لوحة على عقار"),
  },
  {
    id: "TRN-007",
    createdAt: parseDate("21/04/24"),
    clientName: "راشد حمد",
    clientContact: "0505236208",
    requestPurpose: mapRequestPurpose("شراء"),
    usage: mapPropertyUsage("سكني"),
    propertyType: mapPropertyType("فيلا", mapPropertyUsage("سكني")),
    neighborhoodPreferences: parseNeighborhoods("النرجس"),
    ...parseArea(""),
    budgetMin: parseBudget("٣ مليون"),
    budgetMax: parseBudget("٣ مليون"),
    status: "جاري العمل",
    lastCommunicationNote: "ابحث عن فيلا في النرجس بسعر ٣ مليون ريال.",
    updatedAt: parseDate("21/04/24"),
    assignedMarketer: "فريق أفاز",
    notes: "ابحث عن فيلا في النرجس بسعر ٣ مليون ريال.",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint("لوحة على عقار"),
  },
  {
    id: "TRN-008",
    createdAt: parseDate("20/04/24"),
    clientName: "عبدالرحمن الفارس",
    clientContact: "0500703377",
    requestPurpose: mapRequestPurpose("شراء"),
    usage: mapPropertyUsage("سكني"),
    propertyType: mapPropertyType("فيلا", mapPropertyUsage("سكني")),
    neighborhoodPreferences: parseNeighborhoods("النرجس"),
    ...parseArea(""),
    budgetMin: parseBudget("٣ مليون"),
    budgetMax: parseBudget("٣ مليون"),
    status: "جاري العمل",
    lastCommunicationNote: "ابحث عن فيلا في النرجس بسعر ٣ مليون ريال.",
    updatedAt: parseDate("20/04/24"),
    assignedMarketer: "فريق أفاز",
    notes: "ابحث عن فيلا في النرجس بسعر ٣ مليون ريال.",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint("لوحة على عقار"),
  },
  {
    id: "TRN-009",
    createdAt: parseDate("20/04/24"),
    clientName: "نواف السالم",
    clientContact: "0505440032",
    requestPurpose: mapRequestPurpose("استثمار"), // map to Buy
    usage: mapPropertyUsage("سكني"),
    propertyType: mapPropertyType("أرض سكنية", mapPropertyUsage("سكني")),
    neighborhoodPreferences: parseNeighborhoods("النرجس"),
    ...parseArea("300-400"),
    budgetMin: parseBudget("١،٤٠٠،٠٠٠"),
    budgetMax: parseBudget("١،٤٠٠،٠٠٠"),
    status: "جاري العمل",
    lastCommunicationNote: "ابحث عن أرض سكنية في النرجس بمساحة 300-400م بسعر مليون و ٤٠٠ ألف ريال لغرض الاستثمار.",
    updatedAt: parseDate("20/04/24"),
    assignedMarketer: "فريق أفاز",
    notes: "ابحث عن أرض سكنية في النرجس بمساحة 300-400م بسعر مليون و ٤٠٠ ألف ريال لغرض الاستثمار.",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint("لوحة على عقار"),
  },
  {
    id: "TRN-010",
    createdAt: parseDate("19/04/24"),
    clientName: "سلطان",
    clientContact: "0547700067",
    requestPurpose: mapRequestPurpose("شراء"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("أرض تجارية", mapPropertyUsage("تجاري")),
    neighborhoodPreferences: parseNeighborhoods("الرياض"),
    ...parseArea(""),
    budgetMin: parseBudget(""),
    budgetMax: parseBudget(""),
    status: "جاري العمل",
    lastCommunicationNote: "عميل يبحث عن أرض تجارية في الرياض.",
    updatedAt: parseDate("19/04/24"),
    assignedMarketer: "فريق أفاز",
    notes: "عميل يبحث عن أرض تجارية في الرياض.",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint("تويتر"),
  },
  {
    id: "TRN-011",
    createdAt: parseDate("19/04/24"),
    clientName: "ام عبدالله",
    clientContact: "0505222857",
    requestPurpose: mapRequestPurpose("شراء"),
    usage: mapPropertyUsage("سكني"),
    propertyType: mapPropertyType("فيلا", mapPropertyUsage("سكني")),
    neighborhoodPreferences: parseNeighborhoods("الصحافة"),
    ...parseArea(""),
    budgetMin: parseBudget("٣ مليون"),
    budgetMax: parseBudget("٣ مليون"),
    status: "جاري العمل",
    lastCommunicationNote: "تبحث عن فيلا في حي الصحافة بسعر ٣ مليون ريال.",
    updatedAt: parseDate("19/04/24"),
    assignedMarketer: "فريق أفاز",
    notes: "تبحث عن فيلا في حي الصحافة بسعر ٣ مليون ريال.",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint("لوحة على عقار"),
  },
  {
    id: "TRN-012",
    createdAt: parseDate("19/04/24"),
    clientName: "ام محمد",
    clientContact: "0505410811",
    requestPurpose: mapRequestPurpose("شراء"),
    usage: mapPropertyUsage("سكني"),
    propertyType: mapPropertyType("فيلا", mapPropertyUsage("سكني")),
    neighborhoodPreferences: parseNeighborhoods("النرجس"),
    ...parseArea(""),
    budgetMin: parseBudget("٣ مليون و ٥٠٠ الف"),
    budgetMax: parseBudget("٣ مليون و ٥٠٠ الف"),
    status: "جاري العمل",
    lastCommunicationNote: "تبحث عن فيلا في النرجس بسعر ٣ مليون و ٥٠٠ ألف ريال.",
    updatedAt: parseDate("19/04/24"),
    assignedMarketer: "فريق أفاز",
    notes: "تبحث عن فيلا في النرجس بسعر ٣ مليون و ٥٠٠ ألف ريال.",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint("لوحة على عقار"),
  },
  {
    id: "TRN-013",
    createdAt: parseDate("19/04/24"),
    clientName: "عبدالله",
    clientContact: "0553387788",
    requestPurpose: mapRequestPurpose("استثمار"), // map to Buy
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("عمارة تجارية", mapPropertyUsage("تجاري")),
    neighborhoodPreferences: parseNeighborhoods("شمال الرياض"),
    ...parseArea("600-900"),
    budgetMin: parseBudget("٨ مليون"),
    budgetMax: parseBudget("١٠ مليون"),
    status: "جاري العمل",
    lastCommunicationNote: "يبحث عن عمارة تجارية للاستثمار في شمال الرياض بمساحة 600-900م وميزانية ٨-١٠ مليون.",
    updatedAt: parseDate("19/04/24"),
    assignedMarketer: "فريق أفاز",
    notes: "يبحث عن عمارة تجارية للاستثمار في شمال الرياض بمساحة 600-900م وميزانية ٨-١٠ مليون.",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint("لوحة على عقار"),
  },
  {
    id: "TRN-014",
    createdAt: parseDate("19/04/24"),
    clientName: "محمد المحارب",
    clientContact: "0552625280", // Duplicate phone number, but different name
    requestPurpose: mapRequestPurpose("استثمار"), // map to Buy
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("عمارة تجارية", mapPropertyUsage("تجاري")),
    neighborhoodPreferences: parseNeighborhoods("شمال الرياض"),
    ...parseArea("600-900"),
    budgetMin: parseBudget("٥ مليون"),
    budgetMax: parseBudget("٨ مليون"),
    status: "جاري العمل",
    lastCommunicationNote: "يبحث عن عمارة تجارية للاستثمار في شمال الرياض بمساحة 600-900م وميزانية ٥-٨ مليون.",
    updatedAt: parseDate("19/04/24"),
    assignedMarketer: "فريق أفاز",
    notes: "يبحث عن عمارة تجارية للاستثمار في شمال الرياض بمساحة 600-900م وميزانية ٥-٨ مليون.",
    clientRole: mapClientRole("صاحب الطلب"),
    contactPoint: mapContactPoint("لوحة على عقار"),
  }
];
