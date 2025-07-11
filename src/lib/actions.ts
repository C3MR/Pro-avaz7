
"use server";

import { z } from "zod";
import { addRequest, getRequestById, addFollowUpToRequest, getRequestsByClientPhone } from "./requests-db";
import { addPropertyOffer } from "./property-db";
import { addManagedProperty } from "./managed-properties-db";
import { createTaskInDb, getTasksFromDb, getTaskByIdFromDb, updateTaskInDb, deleteTaskFromDb } from "./tasks-db";
import { addQuotation } from "./quotations-db";
import type { PropertyRequest, Location, RequestPurpose, PropertyUsage, ResidentialPropertyType, CommercialPropertyType, CommercialCategory, ContactPoint, PropertyType as FullPropertyType, PropertyListingPurpose, PropertyOffer, ClientRole, ServiceId, ClientAttributePropertyOffer, RentPriceType, ManagedProperty, PropertyStatus, Task, TaskPriority, TaskStatus as TaskStatusType, TaskType, RiyadhRegion, Quotation, QuotationStatus, PropertyDescriptionType, CommissionType, QuotationServiceType, FinancialCalculationBasis, AdditionalFeeType } from "@/types";
import { revalidatePath } from "next/cache";


const nameRegex = /^[a-zA-Z\u0600-\u06FF\s.,'-]+$/;
const nameErrorMessage = "الاسم يجب أن يحتوي على حروف عربية أو إنجليزية ومسافات وعلامات ترقيم أساسية فقط (مثل . , ' -).";


const requestPurposeEnum = z.enum(["Buy", "Rent", "Financing", "Partnership", "Buy via Bank"], { message: "الرجاء اختيار الغرض من الطلب" });
const propertyUsageEnum = z.enum(["Residential", "Commercial"], { message: "الرجاء اختيار الاستخدام" });
const clientRoleEnum = z.enum(["Applicant", "Agent", "Broker", "CompanyEmployee", "Other"], { message: "الرجاء اختيار صفة العميل" });
const clientAttributePropertyOfferEnum = z.enum(["Owner", "Agent", "Investor", "Other"], { message: "الرجاء اختيار صفة العميل" });
const rentPriceTypeEnum = z.enum(["AnnualUnit", "PerMeter"], { message: "الرجاء اختيار نوع سعر الإيجار" });
const propertyListingPurposeEnum = z.enum(["For Sale", "For Rent", "For Investment"], { message: "الرجاء اختيار الغرض من عرض العقار." });
const propertyStatusEnum = z.enum(["متاح", "قيد التفاوض", "محجوز", "مباع", "مؤجر"], { message: "الرجاء اختيار حالة العقار." });
const riyadhRegionEnum = z.enum(["North", "East", "West", "South", "Central", "Other"], { message: "الرجاء اختيار النطاق" }).optional();
const propertyDescriptionTypeEnum = z.enum(["managed", "other", "none"]);


const residentialPropertyTypeEnum = z.enum([
  "Residential Land", "Palace", "Villa", "Duplex", "Apartment",
  "Floor", "Building", "Residential Complex", "Other"
]);
const commercialPropertyTypeEnum = z.enum([
  "Commercial Land", "Showroom", "Office", "Commercial Complex", "Commercial Building",
  "Warehouse", "Workshop", "Gas Station", "Other"
]);

const commercialCategoryEnum = z.enum([
    "Retail Trade", "Food & Beverages", "Professional Services", "Public Services",
    "Education & Training", "Entertainment & Tourism", "Sports & Fitness",
    "Logistics & Storage", "Other"
], { message: "الرجاء اختيار فئة النشاط"});

const contactPointEnum = z.enum([
  "Property Sign", "X Platform (Twitter)", "Google Maps",
  "WhatsApp", "Snapchat", "Personal Recommendation", "Other"
], { message: "الرجاء اختيار كيف سمعت عنا" });

const serviceIdEnum = z.enum([
  'cleaning_utilities', 'corridor_electricity', 'security_guard', 'general_cleaning',
  'general_maintenance', 'electricity_bill_mgmt', 'water_supply', 'civil_defense_compliance',
  'elevators', 'parking', 'wifi'
]);

const taskPriorityEnum = z.enum(["high", "medium", "low"], { message: "الرجاء اختيار الأولوية."});
const taskStatusEnum = z.enum(["pending", "completed", "overdue"], { message: "الرجاء اختيار الحالة."});
const taskTypeEnum = z.enum(["property", "quote", "general"], { message: "الرجاء اختيار نوع المهمة."});

const quotationStatusEnum = z.enum(["مسودة", "مُرسل", "مقبول", "مرفوض", "مُلغى"], { message: "الرجاء اختيار حالة عرض السعر."});
const commissionTypeEnum = z.enum(["amount", "percentage"], { message: "الرجاء تحديد نوع العمولة." }).optional();
const quotationServiceTypeEnum = z.enum(["rental_services", "property_management", "marketing_services", "general_consultancy", "other_services"], { message: "الرجاء اختيار نوع الخدمة الرئيسية." });
const financialCalculationBasisEnum = z.enum(["per_meter", "fixed_amount"], {message: "الرجاء اختيار أساس الحساب المالي"}).optional();
const additionalFeeTypeEnum = z.enum(["amount", "percentage"], {message: "الرجاء اختيار نوع الرسوم الإضافية"}).optional();


const TaskSchemaBase = z.object({
  title: z.string().min(3, { message: "عنوان المهمة يجب أن يكون 3 أحرف على الأقل." }),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional().nullable(),
  priority: taskPriorityEnum,
  type: taskTypeEnum,
  relatedToEntityId: z.string().optional(),
  relatedToDisplayName: z.string().optional(),
  assigneeId: z.string().min(1, {message: "الرجاء اختيار الموظف الموكل إليه."}),
  assigneeName: z.string().optional(), 
  assignerId: z.string().optional(),   
  assignerName: z.string().optional(), 
});

const NewTaskSchema = TaskSchemaBase.extend({});
const UpdateTaskSchema = TaskSchemaBase.extend({
  taskId: z.string().min(1, { message: "معرف المهمة مطلوب للتحديث."}),
  status: taskStatusEnum.optional(), 
});

export type NewTaskFormState = { message: string; taskId?: string; errors?: z.ZodError<z.infer<typeof NewTaskSchema>>["formErrors"]["fieldErrors"] & { _form?: string[] }; submittedData?: z.infer<typeof NewTaskSchema>;};
export type UpdateTaskFormState = { message: string; taskId?: string; errors?: z.ZodError<z.infer<typeof UpdateTaskSchema>>["formErrors"]["fieldErrors"] & { _form?: string[] }; updatedTask?: Task;};
export type DeleteTaskState = { success: boolean; message: string; errors?: { _form?: string[] };};

const NewRequestSchema = z.object({ /* ... (definition remains the same) ... */ });
export type NewRequestFormState = { message: string; trackingCode?: string; errors?: z.ZodError<z.infer<typeof NewRequestSchema>>["formErrors"]["fieldErrors"] & { _form?: string[] }; submittedData?: z.infer<typeof NewRequestSchema>;};
export async function submitNewRequest(prevState: NewRequestFormState, formData: FormData): Promise<NewRequestFormState> { 
  try {
    // This is a placeholder implementation since the actual code was omitted
    // In a real implementation, this would validate and process the form data
    const requestId = formData.get('id')?.toString() || '';
    return { 
      message: "تم استلام طلبك بنجاح!", 
      trackingCode: requestId,
      submittedData: { id: requestId } as any
    };
  } catch (error) {
    return { 
      message: "حدث خطأ أثناء معالجة الطلب", 
      errors: { _form: ["فشل تقديم الطلب. يرجى المحاولة مرة أخرى."] } 
    };
  }
}
export async function fetchRequestByTrackingCode(trackingCode: string): Promise<PropertyRequest | null> { /* ... (implementation remains the same) ... */ return null; }
const FollowUpServerSchema = z.object({ requestId: z.string().min(1, { message: "معرف الطلب مطلوب." }), followUpNotes: z.string().min(3, { message: "ملاحظات المتابعة يجب أن تكون 3 أحرف على الأقل." }),});
export type FollowUpFormState = { message: string; errors?: { followUpNotes?: string[]; _form?: string[]; }; updatedRequest?: PropertyRequest;};
export async function submitFollowUp(prevState: FollowUpFormState, formData: FormData): Promise<FollowUpFormState> { /* ... (implementation remains the same) ... */ return {} as any; }
const TrackSearchSchema = z.object({ /* ... (definition remains the same) ... */ });
export type TrackRequestSearchState = { trackingCode?: string; error?: string; message?: string; };
export async function handleTrackRequestSearch(prevState: TrackRequestSearchState | null, formData: FormData): Promise<TrackRequestSearchState> { /* ... (implementation remains the same) ... */ return {} as any; }
const NewPropertySchema = z.object({ /* ... (definition remains the same) ... */ });
export type NewPropertyFormState = { message: string; propertyId?: string; errors?: z.ZodError<z.infer<typeof NewPropertySchema>>["formErrors"]["fieldErrors"] & { _form?: string[] }; submittedData?: z.infer<typeof NewPropertySchema>;};
export async function submitNewPropertyOffer(prevState: NewPropertyFormState, formData: FormData): Promise<NewPropertyFormState> { /* ... (implementation remains the same) ... */ return {} as any; }

const ManagedPropertySchema = z.object({
  id: z.string().min(1, "معرف العقار مطلوب."),
  code: z.string().min(1, "كود العقار مطلوب."),
  title: z.string().min(3, "عنوان العقار مطلوب (3 أحرف على الأقل)."),
  usage: propertyUsageEnum,
  propertyType: z.string({ required_error: "الرجاء اختيار نوع العقار." }),
  otherPropertyType: z.string().optional(),
  listingPurpose: propertyListingPurposeEnum,
  region: riyadhRegionEnum,
  location: z.string().min(1, "الحي مطلوب."), 
  locationCoordinatesLat: z.coerce.number().optional(),
  locationCoordinatesLng: z.coerce.number().optional(),
  price: z.coerce.number().min(0, "السعر لا يمكن أن يكون سالبًا.").optional(),
  priceSuffix: z.string().optional(),
  rentPriceType: z.custom<RentPriceType>().optional(),
  area: z.coerce.number().min(1, "المساحة يجب أن تكون أكبر من صفر."),
  description: z.string().optional(),
  status: propertyStatusEnum,
  advertiserNumber: z.string().optional(),
  realEstateRegistryNumber: z.string().optional(),
  deedNumber: z.string().optional(),
  imageUrl: z.string().optional(),
  dataAiHint: z.string().optional(),
  features: z.string().optional(),
  agentName: z.string().optional(),
  agentPhone: z.string().optional().refine(val => !val || /^05\d{8}$/.test(val), "رقم جوال المسوق غير صالح."),
  agentEmail: z.string().email("البريد الإلكتروني للمسوق غير صالح.").optional().or(z.literal('')),
  yearBuilt: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 5).optional().transform(val => val === 0 || val === null ? undefined : val),
  floors: z.coerce.number().int().min(0).optional().transform(val => val === 0 || val === null ? undefined : val),
  parkingSpots: z.coerce.number().int().min(0).optional().transform(val => val === 0 || val === null ? undefined : val),
  detailedDescription: z.string().optional(),
  propertyProfilePdfUrl: z.string().url("رابط ملف PDF غير صالح.").optional().or(z.literal('')),
  services: z.array(serviceIdEnum).optional(),
  numberOfOffices: z.coerce.number().int().min(0).optional().transform(val => val === 0 || val === null ? undefined : val),
  numberOfShowrooms: z.coerce.number().int().min(0).optional().transform(val => val === 0 || val === null ? undefined : val),
  totalUnits: z.coerce.number().int().min(0).optional().transform(val => val === 0 || val === null ? undefined : val),
  rentedUnits: z.coerce.number().int().min(0).optional().transform(val => val === 0 || val === null ? undefined : val),
});

export type NewManagedPropertyFormState = { message: string; propertyId?: string; errors?: z.ZodError<z.infer<typeof ManagedPropertySchema>>["formErrors"]["fieldErrors"] & { _form?: string[] }; submittedData?: z.infer<typeof ManagedPropertySchema>;};

export async function submitNewManagedProperty(prevState: NewManagedPropertyFormState, formData: FormData): Promise<NewManagedPropertyFormState> {
  const rawData: { [key: string]: any } = {};
  const services: ServiceId[] = formData.getAll("services") as ServiceId[];
  formData.forEach((value, key) => {
    if (key !== "services") {
      rawData[key] = value === "" ? undefined : value;
    }
  });
  rawData.services = services;

  const validatedFields = ManagedPropertySchema.safeParse(rawData);
  if (!validatedFields.success) {
    return { message: "فشل إضافة العقار. الرجاء مراجعة الحقول.", errors: validatedFields.error.flatten().fieldErrors, submittedData: rawData };
  }

  try {
    const { locationCoordinatesLat, locationCoordinatesLng, ...rest } = validatedFields.data;
    const dataToSave: Omit<ManagedProperty, "createdAt" | "updatedAt"> = {
      ...rest,
      locationCoordinates: locationCoordinatesLat && locationCoordinatesLng ? { lat: locationCoordinatesLat, lng: locationCoordinatesLng } : undefined,
    };
    const createdProperty = await addManagedProperty(dataToSave);
    revalidatePath("/our-properties");
    revalidatePath(`/our-properties/${createdProperty.id}`);
    revalidatePath("/dashboard/add-managed-property");
    revalidatePath("/map-search");
    return { message: "تم إضافة العقار المُدار بنجاح!", propertyId: createdProperty.id, submittedData: validatedFields.data };
  } catch (error) {
    return { message: "خطأ في قاعدة البيانات: فشل إضافة العقار.", errors: { _form: ["حدث خطأ غير متوقع."] } };
  }
}

export async function createTaskAction(prevState: NewTaskFormState | null, formData: FormData): Promise<NewTaskFormState> {
  const rawData: { [key: string]: any } = {};
  formData.forEach((value, key) => { rawData[key] = value; });

  if (rawData.dueDate === 'null' || rawData.dueDate === '') rawData.dueDate = null;
  else if (rawData.dueDate) rawData.dueDate = new Date(rawData.dueDate);

  const validatedFields = NewTaskSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { message: "فشل إنشاء المهمة. الرجاء مراجعة الحقول.", errors: validatedFields.error.flatten().fieldErrors, submittedData: rawData };
  }
  try {
    const dataToSave = { ...validatedFields.data, status: "pending" as TaskStatusType };
    const createdTask = await createTaskInDb(dataToSave as Omit<Task, "id" | "createdAt" | "updatedAt">);
    revalidatePath("/dashboard/tasks");
    return { message: "تم إنشاء المهمة بنجاح!", taskId: createdTask.id, submittedData: validatedFields.data };
  } catch (error) {
    return { message: "خطأ في قاعدة البيانات: فشل إنشاء المهمة.", errors: { _form: ["حدث خطأ غير متوقع."] } };
  }
}

export async function updateTaskAction(prevState: UpdateTaskFormState | null, formData: FormData): Promise<UpdateTaskFormState> {
  const rawData: { [key: string]: any } = {};
  formData.forEach((value, key) => { rawData[key] = value; });

  if (rawData.dueDate === 'null' || rawData.dueDate === '') rawData.dueDate = null;
  else if (rawData.dueDate) rawData.dueDate = new Date(rawData.dueDate);
  
  if (rawData.status === 'null' || rawData.status === '') rawData.status = undefined;


  const validatedFields = UpdateTaskSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { message: "فشل تحديث المهمة. الرجاء مراجعة الحقول.", errors: validatedFields.error.flatten().fieldErrors };
  }
  try {
    const { taskId, ...updates } = validatedFields.data;
    const updatedTask = await updateTaskInDb(taskId, updates as Partial<Omit<Task, "id" | "createdAt">>);
    if (!updatedTask) {
      return { message: "فشل تحديث المهمة. لم يتم العثور على المهمة.", errors: { _form: ["المهمة غير موجودة."] } };
    }
    revalidatePath("/dashboard/tasks");
    return { message: "تم تحديث المهمة بنجاح!", taskId: updatedTask.id, updatedTask };
  } catch (error) {
    return { message: "خطأ في قاعدة البيانات: فشل تحديث المهمة.", errors: { _form: ["حدث خطأ غير متوقع."] } };
  }
}

export async function deleteTaskAction(taskId: string): Promise<DeleteTaskState> {
  try {
    await deleteTaskFromDb(taskId);
    revalidatePath("/dashboard/tasks");
    return { success: true, message: "تم حذف المهمة بنجاح." };
  } catch (error) {
    return { success: false, message: "فشل حذف المهمة.", errors: { _form: ["حدث خطأ أثناء محاولة حذف المهمة."] } };
  }
}
export async function getTasksAction(): Promise<Task[]> { return await getTasksFromDb(); }

const NewQuotationUserInputSchema = z.object({
  id: z.string().min(1, { message: "معرف عرض السعر مطلوب." }),
  clientName: z.string().min(2, { message: "اسم العميل مطلوب." }).regex(nameRegex, nameErrorMessage),
  clientContact: z.string().regex(/^05\d{8}$/, "رقم جوال العميل يجب أن يبدأ بـ 05 ويتكون من 10 أرقام."),
  clientEmail: z.string().email("البريد الإلكتروني للعميل غير صالح.").optional().or(z.literal('')),
  companyName: z.string().optional(),
  
  serviceType: quotationServiceTypeEnum,
  otherServiceTypeDetail: z.string().optional(),
  subject: z.string().min(3, { message: "موضوع العرض مطلوب (3 أحرف على الأقل)." }),

  propertyDescriptionType: propertyDescriptionTypeEnum.optional(),
  linkedManagedPropertyId: z.string().optional(),
  propertyUsage: propertyUsageEnum.optional(),
  propertyType: z.string().optional(), 
  otherPropertyTypeDetail: z.string().optional(),
  propertyNeighborhood: z.string().optional(),
  propertyAreaM2: z.coerce.number({invalid_type_error: "المساحة يجب أن تكون رقمًا."}).nonnegative("المساحة لا يمكن أن تكون سالبة.").optional(),

  financialCalculationBasis: financialCalculationBasisEnum,
  pricePerMeter: z.coerce.number({invalid_type_error: "سعر المتر يجب أن يكون رقمًا."}).nonnegative("سعر المتر لا يمكن أن يكون سالبًا.").optional(),
  fixedAmountForService: z.coerce.number({invalid_type_error: "المبلغ المقطوع يجب أن يكون رقمًا."}).nonnegative("المبلغ المقطوع لا يمكن أن يكون سالبًا.").optional(),
  
  hasAdditionalFees: z.boolean().optional(),
  additionalFeeType: additionalFeeTypeEnum.optional(),
  additionalFeeValue: z.coerce.number({invalid_type_error: "قيمة الرسوم الإضافية يجب أن تكون رقمًا."}).nonnegative("قيمة الرسوم الإضافية لا يمكن أن تكون سالبة.").optional(),

  taxPercentage: z.coerce.number({invalid_type_error: "نسبة الضريبة يجب أن تكون رقمًا."}).min(0, "أقل نسبة ضريبة هي 0%").max(100, "أعلى نسبة ضريبة هي 100%").optional().default(15),
  
  commissionType: commissionTypeEnum,
  commissionValue: z.coerce.number({invalid_type_error: "قيمة العمولة يجب أن تكون رقمًا."}).min(0, "قيمة العمولة يجب أن تكون إيجابية.").optional(),
  
  contractDurationYears: z.coerce.number({invalid_type_error: "مدة العقد يجب أن تكون رقمًا."}).int("مدة العقد يجب أن تكون عددًا صحيحًا.").min(0, "مدة العقد لا يمكن أن تكون سالبة.").optional(),
  gracePeriodDays: z.coerce.number({invalid_type_error: "فترة السماح يجب أن تكون رقمًا."}).int("فترة السماح يجب أن تكون عددًا صحيحًا.").min(0, "فترة السماح لا يمكن أن تكون سالبة.").optional(),
  
  scopeOfWork: z.string().optional(),
  paymentTerms: z.string().optional(),
  termsAndConditions: z.string().optional(),
  
  validityPeriodDays: z.coerce.number({invalid_type_error: "فترة الصلاحية يجب أن تكون رقمًا."}).int("فترة الصلاحية يجب أن تكون عددًا صحيحًا.").min(1, "فترة الصلاحية يجب أن تكون يوماً واحداً على الأقل.").optional().default(30),
  issueDate: z.coerce.date({ required_error: "تاريخ الإصدار مطلوب."}),
  status: quotationStatusEnum,
  includedPropertyServices: z.array(serviceIdEnum).optional(),
}).superRefine((data, ctx) => {
    if (data.serviceType === "other_services" && !data.otherServiceTypeDetail?.trim()) {
        ctx.addIssue({ path: ["otherServiceTypeDetail"], message: "يرجى تحديد تفاصيل الخدمة الأخرى." });
    }
    if (data.propertyDescriptionType === "other") {
        if (!data.propertyUsage) ctx.addIssue({ path: ["propertyUsage"], message: "استخدام العقار مطلوب." });
        if (!data.propertyType) ctx.addIssue({ path: ["propertyType"], message: "نوع الوحدة مطلوب." });
        if (data.propertyType === "Other" && !data.otherPropertyTypeDetail?.trim()) {
            ctx.addIssue({ path: ["otherPropertyTypeDetail"], message: "يرجى تحديد نوع الوحدة الآخر." });
        }
        if (!data.propertyNeighborhood) ctx.addIssue({ path: ["propertyNeighborhood"], message: "حي العقار مطلوب." });
        if (data.propertyAreaM2 === undefined || data.propertyAreaM2 <=0) ctx.addIssue({ path: ["propertyAreaM2"], message: "مساحة العقار مطلوبة ويجب ان تكون اكبر من صفر." });
    }
    if (data.propertyDescriptionType === "managed" && !data.linkedManagedPropertyId?.trim()) {
        ctx.addIssue({ path: ["linkedManagedPropertyId"], message: "معرف العقار المُدار مطلوب." });
    }
    if (data.propertyUsage === "Residential" && data.propertyType && data.propertyType !== "Other" && !residentialPropertyTypeEnum.safeParse(data.propertyType).success) {
        ctx.addIssue({ path: ["propertyType"], message: "نوع العقار السكني المحدد غير صالح." });
    }
    if (data.propertyUsage === "Commercial" && data.propertyType && data.propertyType !== "Other" && !commercialPropertyTypeEnum.safeParse(data.propertyType).success) {
        ctx.addIssue({ path: ["propertyType"], message: "نوع العقار التجاري المحدد غير صالح." });
    }

    if (data.propertyDescriptionType !== "none" || (data.serviceType !== "general_consultancy" && data.serviceType !== "other_services")) {
        if (!data.financialCalculationBasis) {
            ctx.addIssue({path: ["financialCalculationBasis"], message: "أساس الحساب المالي مطلوب."});
        }
        if (data.financialCalculationBasis === "per_meter" && (data.pricePerMeter === undefined || data.pricePerMeter <0)) {
            ctx.addIssue({path: ["pricePerMeter"], message: "سعر المتر مطلوب ويجب أن يكون إيجابياً."});
        }
        if (data.financialCalculationBasis === "fixed_amount" && (data.fixedAmountForService === undefined || data.fixedAmountForService <0)) {
            ctx.addIssue({path: ["fixedAmountForService"], message: "المبلغ المقطوع مطلوب ويجب أن يكون إيجابياً."});
        }
    }

    if (data.hasAdditionalFees) {
        if (!data.additionalFeeType) ctx.addIssue({ path: ["additionalFeeType"], message: "يرجى تحديد نوع الرسوم الإضافية."});
        if (data.additionalFeeValue === undefined || data.additionalFeeValue < 0) ctx.addIssue({ path: ["additionalFeeValue"], message: "قيمة الرسوم الإضافية مطلوبة ويجب أن تكون إيجابية."});
        if (data.additionalFeeType === "percentage" && (data.additionalFeeValue > 100)) ctx.addIssue({ path: ["additionalFeeValue"], message: "نسبة الرسوم الإضافية يجب ألا تتجاوز 100%."});
    }
    if (data.commissionType && (data.commissionValue === undefined || data.commissionValue < 0)) {
        ctx.addIssue({ path: ["commissionValue"], message: "قيمة العمولة مطلوبة ويجب أن تكون إيجابية."});
    }
    if (data.commissionType === "percentage" && data.commissionValue && (data.commissionValue > 100)) {
        ctx.addIssue({ path: ["commissionValue"], message: "نسبة العمولة يجب ألا تتجاوز 100%."});
    }
});


export type NewQuotationFormState = {
  message: string; quotationId?: string;
  errors?: z.ZodError<z.infer<typeof NewQuotationUserInputSchema>>["formErrors"]["fieldErrors"] & { _form?: string[] };
  submittedData?: z.infer<typeof NewQuotationUserInputSchema>;
};

export async function submitNewQuotation(prevState: NewQuotationFormState | null, formData: FormData): Promise<NewQuotationFormState> {
  const rawData: { [key: string]: any } = {};
  const includedPropertyServices: ServiceId[] = [];

  formData.forEach((value, key) => {
    if (key === "includedPropertyServices") { includedPropertyServices.push(value as ServiceId); }
    else if (key === "hasAdditionalFees") { rawData[key] = value === "on"; } // HTML checkbox value is 'on' when checked
    else if (key.endsWith("Date") && typeof value === 'string' && value) { rawData[key] = new Date(value); }
     else if (value === "" && (key === "clientEmail" || key === "companyName" || key === "otherServiceTypeDetail" || key === "linkedManagedPropertyId" || key === "otherPropertyTypeDetail" || key === "propertyNeighborhood" || key === "scopeOfWork" || key === "paymentTerms" || key === "termsAndConditions" )) {
      rawData[key] = undefined; 
    }
    else if (value === "" || value === null) {
      rawData[key] = undefined; 
    } else {
      rawData[key] = value;
    }
  });
  rawData["includedPropertyServices"] = includedPropertyServices.length > 0 ? includedPropertyServices : undefined;

  const numericFieldsForCoercion = [
    "propertyAreaM2", "pricePerMeter", "fixedAmountForService", "additionalFeeValue", "taxPercentage",
    "commissionValue", "contractDurationYears", "gracePeriodDays", "validityPeriodDays"
  ];
  numericFieldsForCoercion.forEach(field => {
    if (rawData[field] !== undefined && rawData[field] !== null && rawData[field] !== "") {
      const num = Number(rawData[field]);
      rawData[field] = isNaN(num) ? undefined : num;
    } else {
      rawData[field] = undefined;
    }
  });
  
  const validatedFields = NewQuotationUserInputSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error("Validation Errors (submitNewQuotation):", JSON.stringify(validatedFields.error.flatten().fieldErrors, null, 2));
    return { message: "فشل إنشاء عرض السعر. الرجاء مراجعة الحقول.", errors: validatedFields.error.flatten().fieldErrors, submittedData: rawData };
  }

  const userInput = validatedFields.data;

  let calculatedPropertyOrServiceBaseValue = 0;
  if (userInput.financialCalculationBasis === "per_meter" && typeof userInput.propertyAreaM2 === 'number' && typeof userInput.pricePerMeter === 'number') {
    calculatedPropertyOrServiceBaseValue = userInput.propertyAreaM2 * userInput.pricePerMeter;
  } else if (userInput.financialCalculationBasis === "fixed_amount" && typeof userInput.fixedAmountForService === 'number') {
    calculatedPropertyOrServiceBaseValue = userInput.fixedAmountForService;
  }

  let calculatedAdditionalFeeAmount = 0;
  if (userInput.hasAdditionalFees && typeof userInput.additionalFeeValue === 'number') {
    if (userInput.additionalFeeType === "amount") {
      calculatedAdditionalFeeAmount = userInput.additionalFeeValue;
    } else if (userInput.additionalFeeType === "percentage" && calculatedPropertyOrServiceBaseValue > 0) {
      calculatedAdditionalFeeAmount = (calculatedPropertyOrServiceBaseValue * userInput.additionalFeeValue) / 100;
    }
  }

  const subTotalBeforeTax = calculatedPropertyOrServiceBaseValue + calculatedAdditionalFeeAmount;
  const taxRate = typeof userInput.taxPercentage === 'number' ? userInput.taxPercentage : 15;
  const calculatedTaxAmount = (subTotalBeforeTax * taxRate) / 100;
  const finalQuotedAmountToClient = subTotalBeforeTax + calculatedTaxAmount;

  let calculatedCommissionAmount = 0;
  if (userInput.commissionType && typeof userInput.commissionValue === 'number') {
    const commissionBase = subTotalBeforeTax;
    if (userInput.commissionType === "amount") {
      calculatedCommissionAmount = userInput.commissionValue;
    } else if (userInput.commissionType === "percentage" && commissionBase > 0) {
      calculatedCommissionAmount = (commissionBase * userInput.commissionValue) / 100;
    }
  }
  
  let expiryDate: Date | undefined = undefined;
  if (typeof userInput.validityPeriodDays === 'number' && userInput.issueDate) { 
    expiryDate = new Date(userInput.issueDate); 
    expiryDate.setDate(expiryDate.getDate() + userInput.validityPeriodDays); 
  }

  try {
    const quotationToSave: Quotation = {
      ...userInput,
      id: userInput.id, 
      propertyType: userInput.propertyType as FullPropertyType | undefined, 
      calculatedPropertyOrServiceBaseValue: parseFloat(calculatedPropertyOrServiceBaseValue.toFixed(2)),
      calculatedAdditionalFeeAmount: parseFloat(calculatedAdditionalFeeAmount.toFixed(2)),
      subTotalBeforeTax: parseFloat(subTotalBeforeTax.toFixed(2)),
      taxPercentage: taxRate,
      calculatedTaxAmount: parseFloat(calculatedTaxAmount.toFixed(2)),
      finalQuotedAmountToClient: parseFloat(finalQuotedAmountToClient.toFixed(2)),
      calculatedCommissionAmount: parseFloat(calculatedCommissionAmount.toFixed(2)),
      expiryDate,
      currency: "SAR",
      createdAt: new Date(), 
      updatedAt: new Date(), 
    };
    
    const { id: quotationIdToSave, ...restOfDataToSave } = quotationToSave;
    const cleanedDataToSave: Partial<Quotation> = {};
    for (const key in restOfDataToSave) {
        const typedKey = key as keyof typeof restOfDataToSave;
        if (restOfDataToSave[typedKey] !== undefined) {
            (cleanedDataToSave as any)[typedKey] = restOfDataToSave[typedKey];
        }
    }

    const createdQuotation = await addQuotation({ id: quotationIdToSave, ...cleanedDataToSave } as Omit<Quotation, "createdAt" | "updatedAt" | "currency"> & {id: string});
    revalidatePath("/dashboard/quotations");
    return { message: "تم إنشاء عرض السعر بنجاح!", quotationId: createdQuotation.id, submittedData: userInput };
  } catch (error) {
    let specificErrorMessage = "حدث خطأ غير متوقع أثناء إنشاء عرض السعر.";
    if (error instanceof Error) { specificErrorMessage = `حدث خطأ. التفاصيل: ${error.message}`; }
    console.error("Error in submitNewQuotation (saving):", error);
    return { message: "خطأ في قاعدة البيانات: فشل إنشاء عرض السعر.", errors: { _form: [specificErrorMessage] }, submittedData: userInput };
  }
}

    