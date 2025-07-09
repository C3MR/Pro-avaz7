
"use server";

import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import type { ManagedProperty } from "@/types";

const MANAGED_PROPERTIES_COLLECTION = "managedProperties";

// Helper to convert Firestore doc data to ManagedProperty
function docDataToManagedProperty(docId: string, data: any): ManagedProperty {
  const propertyData = { ...data } as ManagedProperty;
  propertyData.id = docId;

  if (data.createdAt && data.createdAt instanceof Timestamp) {
    propertyData.createdAt = data.createdAt.toDate();
  } else if (typeof data.createdAt === 'string') {
     propertyData.createdAt = new Date(data.createdAt);
  }


  if (data.updatedAt && data.updatedAt instanceof Timestamp) {
    propertyData.updatedAt = data.updatedAt.toDate();
  } else if (typeof data.updatedAt === 'string') {
    propertyData.updatedAt = new Date(data.updatedAt);
  }
  // Ensure services is an array, default to empty if undefined
  propertyData.services = data.services || [];
  propertyData.moreImages = data.moreImages || [];
  propertyData.features = data.features || [];


  return propertyData;
}

// Function to add a single managed property (useful for forms or individual additions)
export async function addManagedProperty(propertyData: Omit<ManagedProperty, "createdAt" | "updatedAt">): Promise<ManagedProperty> {
  try {
    const docRef = doc(db, MANAGED_PROPERTIES_COLLECTION, propertyData.id); // Use provided ID

    // Filter out undefined values before sending to Firestore
    const dataToSet: { [key: string]: any } = {};
    for (const key in propertyData) {
      if (Object.prototype.hasOwnProperty.call(propertyData, key)) {
        const value = (propertyData as any)[key];
        if (value !== undefined) {
          dataToSet[key] = value;
        }
      }
    }
    
    await setDoc(docRef, {
      ...dataToSet,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const newDocSnap = await getDoc(docRef);
    if (newDocSnap.exists()) {
      return docDataToManagedProperty(newDocSnap.id, newDocSnap.data());
    } else {
      throw new Error("Failed to fetch newly created managed property.");
    }
  } catch (error) {
    console.error("Error adding managed property to Firestore: ", error);
    throw error;
  }
}

// Function to add multiple managed properties in a batch (for seeding)
export async function addManagedPropertyBatch(properties: ManagedProperty[]): Promise<void> {
  const batch = writeBatch(db);
  properties.forEach((property) => {
    const docRef = doc(db, MANAGED_PROPERTIES_COLLECTION, property.id); // Use property.id as document ID
    
    // Filter out undefined values for batch write as well
    const propertyDataToSet: { [key: string]: any } = {};
    for (const key in property) {
      if (Object.prototype.hasOwnProperty.call(property, key)) {
        const value = (property as any)[key];
        if (value !== undefined) {
          propertyDataToSet[key] = value;
        }
      }
    }

    const dataWithTimestamps = {
        ...propertyDataToSet,
        createdAt: property.createdAt instanceof Date ? Timestamp.fromDate(property.createdAt) : serverTimestamp(), // Convert Date to Timestamp
        updatedAt: serverTimestamp(),
    };
    delete dataWithTimestamps.id; // ID is part of docRef, not data itself for setDoc in batch

    batch.set(docRef, dataWithTimestamps);
  });
  try {
    await batch.commit();
    console.log("Batch write of managed properties successful.");
  } catch (error) {
    console.error("Error in batch writing managed properties: ", error);
    throw error;
  }
}


export async function getAllManagedProperties(): Promise<ManagedProperty[]> {
  try {
    const q = query(collection(db, MANAGED_PROPERTIES_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docDataToManagedProperty(doc.id, doc.data()));
  } catch (error) {
    console.error("Error fetching all managed properties from Firestore: ", error);
    throw error;
  }
}

export async function getManagedPropertyById(id: string): Promise<ManagedProperty | undefined> {
  try {
    const docRef = doc(db, MANAGED_PROPERTIES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docDataToManagedProperty(docSnap.id, docSnap.data());
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching managed property by ID: ", error);
    throw error;
  }
}

    
