
import type { PropertyRequest, RequestPurpose, PropertyUsage, PropertyType, CommercialCategory, ContactPoint, ClientRole, RequestStatus, RiyadhRegion } from "@/types";

// Helper to convert Arabic numerals in strings to Western numerals
const convertArabicNumerals = (str?: string): string => {
  if (!str) return "";
  return String(str).replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
};

// Helper for parsing area, ensuring minArea <= maxArea
const parseArea = (minAreaStr?: string, maxAreaStr?: string): { minArea?: number; maxArea?: number } => {
  const result: { minArea?: number; maxArea?: number } = {};
  let minVal: number | undefined;
  let maxVal: number | undefined;

  if (minAreaStr) {
    const min = parseInt(convertArabicNumerals(minAreaStr).replace(/\D/g, ''), 10);
    if (!isNaN(min)) minVal = min;
  }
  if (maxAreaStr) {
    const max = parseInt(convertArabicNumerals(maxAreaStr).replace(/\D/g, ''), 10);
    if (!isNaN(max)) maxVal = max;
  }

  if (minVal !== undefined && maxVal !== undefined) {
    if (minVal > maxVal) { // Swap if min is greater than max
      result.minArea = maxVal;
      result.maxArea = minVal;
    } else {
      result.minArea = minVal;
      result.maxArea = maxVal;
    }
  } else {
    result.minArea = minVal;
    result.maxArea = maxVal;
  }
  return result;
};

const mapRequestPurpose = (sheetPurpose?: string): RequestPurpose | undefined => {
  if (!sheetPurpose) return undefined;
  const lowerCasePurpose = String(sheetPurpose).toLowerCase().trim();
  if (lowerCasePurpose.includes("شراء")) return "Buy"; // Prioritize Buy if multiple like "شراء , ايجار"
  if (lowerCasePurpose.includes("ايجار") || lowerCasePurpose.includes("إيجار") || lowerCasePurpose.includes("أيجار")) return "Rent";
  return undefined;
};

const mapPropertyUsage = (sheetUsage?: string): PropertyUsage | undefined => {
  if (!sheetUsage) return undefined;
  const lowerCaseUsage = String(sheetUsage).toLowerCase().trim();
  if (lowerCaseUsage.includes("تجاري")) return "Commercial";
  if (lowerCaseUsage.includes("سكني")) return "Residential";
  return undefined;
};

const mapPropertyType = (sheetType?: string, usage?: PropertyUsage): PropertyType | undefined => {
  if (!sheetType) return undefined;
  const type = String(sheetType).toLowerCase().trim();

  if (type.includes("مكتب")) return "Office";
  if (type.includes("معرض")) return "Showroom";
  if (type.includes("أرض تجارية") || type.includes("ارض تجارية")) return "Commercial Land";
  // Add more specific mappings if needed for other types from the sheet
  return "Other"; // Fallback for unmapped types
};

const mapCommercialCategory = (sheetCategory?: string): CommercialCategory | undefined => {
    if(!sheetCategory) return undefined;
    const cat = String(sheetCategory).trim();
    if (cat.includes("الصحة والتعليم")) return "Education & Training";
    if (cat.includes("العقارات والمقاولات")) return "Professional Services";
    if (cat.includes("الأغذية والمشروبات")) return "Food & Beverages";
    if (cat.includes("الخدمات اللوجستية والنقل")) return "Logistics & Storage";
    if (cat.includes("السيارات والمركبات")) return "Retail Trade"; // Or a more specific category
    if (cat.includes("الرياضة واللياقة البدنية")) return "Sports & Fitness";
    if (cat.includes("التجزئة والسلع")) return "Retail Trade";
    return "Other";
};

const mapRiyadhRegion = (regionStr?: string): RiyadhRegion | undefined => {
    if (!regionStr) return undefined;
    const lowerRegion = regionStr.toLowerCase().trim();
    if (lowerRegion.includes("شمال الرياض")) return "North";
    if (lowerRegion.includes("شرق الرياض")) return "East";
    if (lowerRegion.includes("غرب الرياض")) return "West";
    if (lowerRegion.includes("جنوب الرياض")) return "South";
    if (lowerRegion.includes("وسط الرياض")) return "Central";
    return "Other";
};

const normalizePhoneNumber = (phone?: string): string => {
    if (!phone) return "0500000000"; // Default placeholder
    let cleaned = String(phone).replace(/\s/g, '');
    if (cleaned.length === 9 && !cleaned.startsWith('0')) {
        cleaned = '0' + cleaned;
    }
    return cleaned.length === 10 && cleaned.startsWith('05') ? cleaned : `05${Math.floor(10000000 + Math.random() * 90000000)}`; // Fallback for invalid numbers
};


// New data based on the provided image
export const importedRequests: PropertyRequest[] = [
  {
    id: "PR-24-08-001",
    clientName: "صالح صديق",
    clientContact: normalizePhoneNumber("0561223553"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("مكتب", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("الصحة والتعليم"),
    companyName: "شركة المصادر الدولية لصحة البيئه",
    branchCount: 1,
    region: mapRiyadhRegion("شمال الرياض"),
    ...parseArea("350", "250"), // Swapped in parseArea
    notes: "من شمال الدايري الى جنوب طريق الملك سلمان مكتب أو مكتبين تكون مساحة مفتوحة ويفضل المواقع الجاهزة",
    lastCommunicationNote: "من شمال الدايري الى جنوب طريق الملك سلمان مكتب أو مكتبين تكون مساحة مفتوحة ويفضل المواقع الجاهزة",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-002",
    clientName: "محمد المغامس",
    clientContact: normalizePhoneNumber("0533388876"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("العقارات والمقاولات"),
    companyName: "رخام و سراميك",
    branchCount: 0,
    region: mapRiyadhRegion("شمال الرياض"),
    ...parseArea("100", "70"), // Swapped
    notes: "شوارع الرئيسية الملك عبد العزيز ابوبكر الصديق انس بن مالك عثمان بن عفان",
    lastCommunicationNote: "شوارع الرئيسية الملك عبد العزيز ابوبكر الصديق انس بن مالك عثمان بن عفان",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-003",
    clientName: "رامي مجرشي",
    clientContact: normalizePhoneNumber("531870604"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("الأغذية والمشروبات"),
    companyName: "مطعم مشويات وشاورما",
    branchCount: 0,
    region: mapRiyadhRegion("شرق الرياض"),
    ...parseArea("200", "100"), // Swapped
    notes: "الربوة - الدار البيضاء العزيزية الشفا",
    lastCommunicationNote: "الربوة - الدار البيضاء العزيزية الشفا",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-004",
    clientName: "صلاح",
    clientContact: normalizePhoneNumber("0567525649"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("الخدمات اللوجستية والنقل"),
    companyName: "شركة القائد للسيارات",
    branchCount: 4,
    region: mapRiyadhRegion("شمال الرياض"),
    ...parseArea("200", "150"), // Swapped
    notes: "معرض لتأجير سيارات الفارهه",
    lastCommunicationNote: "معرض لتأجير سيارات الفارهه",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-005",
    clientName: "محمد الصالح",
    clientContact: normalizePhoneNumber("0581164400"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("العقارات والمقاولات"),
    companyName: "استون هنش",
    branchCount: 2,
    region: mapRiyadhRegion("شمال الرياض"),
    ...parseArea("150", "200"),
    notes: "معرض سراميك وبورسلان ايطالي الاهتمام طريق الملك عبد العزيز والإمام سعود أو الموقع تواجد معارض السراميك",
    lastCommunicationNote: "معرض سراميك وبورسلان ايطالي الاهتمام طريق الملك عبد العزيز والإمام سعود أو الموقع تواجد معارض السراميك",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-006",
    clientName: "رضوان",
    clientContact: normalizePhoneNumber("0536277786"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("الأغذية والمشروبات"),
    companyName: "مكان العصير",
    branchCount: 4,
    region: mapRiyadhRegion("شرق الرياض"),
    ...parseArea("200", "100"), // Swapped
    notes: "تم التواصل على درايف ترو الربوة الاهتمام بمساحة 200م تم عرض السعر 350 الف",
    lastCommunicationNote: "تم التواصل على درايف ترو الربوة الاهتمام بمساحة 200م تم عرض السعر 350 الف",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-007",
    clientName: "محمد ابویوسف",
    clientContact: normalizePhoneNumber("0530168541"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("الأغذية والمشروبات"),
    companyName: "مطعم المكي",
    branchCount: 4,
    region: mapRiyadhRegion("شمال الرياض"),
    ...parseArea("800", "1000"),
    notes: "مواقع شمال طريق الملك سلمان على الشوارع الرئيسية",
    lastCommunicationNote: "مواقع شمال طريق الملك سلمان على الشوارع الرئيسية",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-008",
    clientName: "سعد الحداد",
    clientContact: normalizePhoneNumber("0542511111"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("الأغذية والمشروبات"),
    companyName: "بيتزاء وفطائر",
    branchCount: 3,
    region: mapRiyadhRegion("شمال الرياض"),
    ...parseArea("200", "100"), // Swapped
    notes: "صاحب مجموعه مطاعم مهتم لموقع شمال الرياض شارع ريحانه وكذلك عقار الثلاثين",
    lastCommunicationNote: "صاحب مجموعه مطاعم مهتم لموقع شمال الرياض شارع ريحانه وكذلك عقار الثلاثين",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-009",
    clientName: "صالح ابو حربي",
    clientContact: normalizePhoneNumber("0506810196"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("السيارات والمركبات"),
    companyName: "موسسة ندى للإطارات",
    branchCount: 7,
    region: mapRiyadhRegion("شمال الرياض"),
    ...parseArea("800", "500"), // Swapped
    notes: "من شمال الدائري الشمالي الي جنوب طريق الملك سلمان على الشوارع الرئيسيه مهتم الموقع اللؤلؤه",
    lastCommunicationNote: "من شمال الدائري الشمالي الي جنوب طريق الملك سلمان على الشوارع الرئيسيه مهتم الموقع اللؤلؤه",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-010",
    clientName: "عبد الإله المقبل",
    clientContact: normalizePhoneNumber("0539533538"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("الرياضة واللياقة البدنية"),
    companyName: "اورفت",
    branchCount: 72,
    region: mapRiyadhRegion("شمال الرياض"),
    ...parseArea("1200", "800"), // Swapped
    notes: "مهتم بشرق الرياض الاسعار بحدود 700 الف",
    lastCommunicationNote: "مهتم بشرق الرياض الاسعار بحدود 700 الف",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-011",
    clientName: "رضی",
    clientContact: normalizePhoneNumber("05693262442"),
    requestPurpose: mapRequestPurpose("شراء"), // "شراء , ايجار" -> Buy
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("الأغذية والمشروبات"),
    companyName: "كازا باستا",
    branchCount: 69,
    region: mapRiyadhRegion("شرق الرياض"),
    ...parseArea("150", "100"), // Swapped
    notes: "",
    lastCommunicationNote: "",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-012",
    clientName: "متعب القحطاني",
    clientContact: normalizePhoneNumber("0565857291"),
    requestPurpose: mapRequestPurpose("شراء"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("أرض تجارية", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("السيارات والمركبات"),
    companyName: "السيارات والمركبات",
    branchCount: 0,
    region: mapRiyadhRegion("شرق الرياض"),
    ...parseArea("3119", "1063"), // Swapped
    notes: "يرغب في شراء أراضي ابن الهيثم كاملة",
    lastCommunicationNote: "يرغب في شراء أراضي ابن الهيثم كاملة",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-013",
    clientName: "خالد الغيت",
    clientContact: normalizePhoneNumber("0555587477"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("التجزئة والسلع"),
    companyName: "المخلف للعود",
    branchCount: 0,
    region: mapRiyadhRegion("شمال الرياض"),
    ...parseArea("500", "300"), // Swapped
    notes: "معرض للايجار طريق الملك فهد من شمال طريق التمامه أو أرض مناسبة لإنشاء معرض لللعود",
    lastCommunicationNote: "معرض للايجار طريق الملك فهد من شمال طريق التمامه أو أرض مناسبة لإنشاء معرض لللعود",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-014",
    clientName: "محمد البعاج",
    clientContact: normalizePhoneNumber("0543333002"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("العقارات والمقاولات"),
    companyName: "شركة عقارية",
    branchCount: 0,
    region: mapRiyadhRegion("شمال الرياض"),
    ...parseArea("600", "400"), // Swapped
    notes: "معرض + مكتب بالشوارع الرئيسية شرق طريق الملك فهد",
    lastCommunicationNote: "معرض + مكتب بالشوارع الرئيسية شرق طريق الملك فهد",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-015",
    clientName: "خالد عسيري",
    clientContact: normalizePhoneNumber("0545335550"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("الأغذية والمشروبات"),
    companyName: "مطلبيكم", // Assuming 'مطبخكم' or similar
    branchCount: 0,
    region: mapRiyadhRegion("شمال الرياض"),
    ...parseArea("450", "350"), // Swapped
    notes: "",
    lastCommunicationNote: "",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-016",
    clientName: "على العميري",
    clientContact: normalizePhoneNumber("0530070911"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("التجزئة والسلع"),
    companyName: "حكيم عيون",
    branchCount: 98,
    region: mapRiyadhRegion("شمال الرياض"),
    ...parseArea("300", "80"), // Swapped
    notes: "الاهتمام لشوارع الرئيسية ويفضل المجمعات الأرب مول يقرب من سوبرماركت والتركيز على الشمال والشرق",
    lastCommunicationNote: "الاهتمام لشوارع الرئيسية ويفضل المجمعات الأرب مول يقرب من سوبرماركت والتركيز على الشمال والشرق",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  },
  {
    id: "PR-24-08-017",
    clientName: "العوني", // Assuming this is the client name
    clientContact: normalizePhoneNumber("0539379573"),
    requestPurpose: mapRequestPurpose("ايجار"),
    usage: mapPropertyUsage("تجاري"),
    propertyType: mapPropertyType("معرض", mapPropertyUsage("تجاري")),
    commercialCategory: mapCommercialCategory("الرياضة واللياقة البدنية"),
    companyName: "نادي أطفال رياضي",
    branchCount: 0,
    region: mapRiyadhRegion("شمال الرياض"),
    ...parseArea("1000", "400"), // Swapped
    notes: "شمال الرياض شوارع رائيسيه",
    lastCommunicationNote: "شمال الرياض شوارع رائيسيه",
    status: "جديد", createdAt: new Date(), updatedAt: new Date(), clientRole: "Applicant", assignedMarketer: "فريق أفاز",
  }
];

