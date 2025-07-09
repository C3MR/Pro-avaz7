
"use server";

import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  // getDocs, // For future use
  // query, // For future use
  // orderBy, // For future use
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import type { Quotation } from "@/types";

const QUOTATIONS_COLLECTION = "quotations";

// Helper to convert Firestore doc data to Quotation (handling Timestamps)
function docDataToQuotation(docId: string, data: any): Quotation {
  const quotationData = { ...data } as Quotation;
  quotationData.id = docId;

  const dateFields: (keyof Quotation)[] = ['createdAt', 'updatedAt', 'issueDate', 'expiryDate'];
  dateFields.forEach(field => {
    if (data[field] && data[field] instanceof Timestamp) {
      (quotationData as any)[field] = (data[field] as Timestamp).toDate();
    } else if (typeof data[field] === 'string' && data[field]) { 
      const parsedDate = new Date(data[field]);
      if (!isNaN(parsedDate.getTime())) { 
        (quotationData as any)[field] = parsedDate;
      } else {
         (quotationData as any)[field] = undefined; 
      }
    } else if (data[field] === null) { // Ensure null is preserved for optional dates
        (quotationData as any)[field] = null;
    }
     else {
        (quotationData as any)[field] = undefined; 
    }
  });
  
  quotationData.includedPropertyServices = data.includedPropertyServices || [];


  return quotationData;
}

export async function addQuotation(quotationData: Omit<Quotation, "createdAt" | "updatedAt" | "currency"> & { id: string }): Promise<Quotation> {
  try {
    const { id: quotationId, issueDate, expiryDate, ...restOfData } = quotationData;
    const cleanedQuotationData: { [key: string]: any } = {};

    for (const key in restOfData) {
      const typedKey = key as keyof typeof restOfData;
      // Ensure that even if a field is optional and undefined, it's not explicitly set as undefined to Firestore
      // unless it's meant to delete a field (which setDoc doesn't do, merge:true would).
      // For creating new docs, if a field is not present in quotationData, it won't be in cleanedQuotationData.
      if (restOfData[typedKey] !== undefined) { 
        cleanedQuotationData[typedKey] = restOfData[typedKey];
      }
    }
    
    const dataToSet: any = {
      ...cleanedQuotationData,
      // id: quotationId, // ID is used for doc ref, not in the data itself for setDoc
      currency: "SAR" as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (issueDate instanceof Date) {
      dataToSet.issueDate = Timestamp.fromDate(issueDate);
    } else if (typeof issueDate === 'string' && issueDate) {
        const parsedIssueDate = new Date(issueDate);
        if (!isNaN(parsedIssueDate.getTime())) dataToSet.issueDate = Timestamp.fromDate(parsedIssueDate);
    }


    if (expiryDate instanceof Date) {
      dataToSet.expiryDate = Timestamp.fromDate(expiryDate);
    } else if (typeof expiryDate === 'string' && expiryDate) {
         const parsedExpiryDate = new Date(expiryDate);
        if (!isNaN(parsedExpiryDate.getTime())) dataToSet.expiryDate = Timestamp.fromDate(parsedExpiryDate);
    } else if (expiryDate === null || expiryDate === undefined) { 
        // If explicitly null or undefined, store as null or let Firestore handle undefined
        dataToSet.expiryDate = null; 
    }


    const docRef = doc(db, QUOTATIONS_COLLECTION, quotationId);
    await setDoc(docRef, dataToSet);

    const newDocSnap = await getDoc(docRef);
    if (newDocSnap.exists()) {
      return docDataToQuotation(newDocSnap.id, newDocSnap.data());
    } else {
      throw new Error("Failed to fetch newly created quotation document.");
    }
  } catch (error) {
    console.error("Error adding quotation to Firestore: ", error);
    throw error;
  }
}

export async function getQuotationById(id: string): Promise<Quotation | undefined> {
  try {
    const docRef = doc(db, QUOTATIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docDataToQuotation(docSnap.id, docSnap.data());
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching quotation by ID from Firestore: ", error);
    throw error;
  }
}

// export async function getAllQuotations(): Promise<Quotation[]> {
//   try {
//     const q = query(collection(db, QUOTATIONS_COLLECTION), orderBy("createdAt", "desc"));
//     const querySnapshot = await getDocs(q);
//     return querySnapshot.docs.map(doc => docDataToQuotation(doc.id, doc.data()));
//   } catch (error) {
//     console.error("Error fetching all quotations from Firestore: ", error);
//     throw error;
//   }
// }

    