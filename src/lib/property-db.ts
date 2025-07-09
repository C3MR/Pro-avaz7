
import { db } from './firebase';
import { 
  collection, 
  doc,
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  Timestamp 
} from "firebase/firestore";
import type { PropertyOffer } from "@/types";

const PROPERTY_OFFERS_COLLECTION = "propertyOffers";

// Helper to convert Firestore doc data (with Timestamps) to PropertyOffer (with Dates)
function docDataToPropertyOffer(docId: string, data: any): PropertyOffer {
  const offerData = { 
    ...data,
    clientName: data.ownerName, 
    clientContact: data.ownerContact, 
    clientEmail: data.ownerEmail, 
    propertyProfilePdfUrl: data.propertyProfilePdfUrl,
   } as PropertyOffer;
  offerData.id = docId;

  delete (offerData as any).ownerName;
  delete (offerData as any).ownerContact;
  delete (offerData as any).ownerEmail;
  
  if (data.createdAt && data.createdAt instanceof Timestamp) {
    offerData.createdAt = data.createdAt.toDate();
  }
  if (data.updatedAt && data.updatedAt instanceof Timestamp) {
    offerData.updatedAt = data.updatedAt.toDate();
  }
  offerData.services = data.services || []; 
  return offerData;
}

export async function addPropertyOffer(offerData: Omit<PropertyOffer, "createdAt" | "updatedAt" | "priceSuffix"> & { id: string }): Promise<PropertyOffer> {
  try {
    const { id: offerId, ...restOfData } = offerData;
    const cleanedOfferData: { [key: string]: any } = {};
    for (const key in restOfData) {
      if ((restOfData as any)[key] !== undefined) {
        if (key === 'clientName') cleanedOfferData['ownerName'] = (restOfData as any)[key];
        else if (key === 'clientContact') cleanedOfferData['ownerContact'] = (restOfData as any)[key];
        else if (key === 'clientEmail') cleanedOfferData['ownerEmail'] = (restOfData as any)[key];
        else cleanedOfferData[key] = (restOfData as any)[key];
      }
    }
    
    const docRef = doc(db, PROPERTY_OFFERS_COLLECTION, offerId);
    await setDoc(docRef, {
      ...cleanedOfferData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const newDocSnap = await getDoc(docRef);
    if (newDocSnap.exists()) {
      return docDataToPropertyOffer(newDocSnap.id, newDocSnap.data());
    } else {
      throw new Error("Failed to fetch newly created property offer document.");
    }
  } catch (error) {
    console.error("Error adding property offer to Firestore: ", error);
    throw error;
  }
}

export async function getPropertyOfferById(id: string): Promise<PropertyOffer | undefined> {
  try {
    const docRef = doc(db, PROPERTY_OFFERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docDataToPropertyOffer(docSnap.id, docSnap.data());
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching property offer by ID from Firestore: ", error);
    throw error;
  }
}

export async function getAllPropertyOffers(): Promise<PropertyOffer[]> {
  try {
    const q = query(collection(db, PROPERTY_OFFERS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docDataToPropertyOffer(doc.id, doc.data()));
  } catch (error) {
    console.error("Error fetching all property offers from Firestore: ", error);
    throw error;
  }
}
