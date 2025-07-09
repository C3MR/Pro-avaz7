
"use server";

import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  writeBatch // Added for batch operations
} from "firebase/firestore";
import type { PropertyRequest, RequestStatus, FollowUpEntry } from "@/types";
import { importedRequests } from './imported-sample-requests'; // Import the sample data

const REQUESTS_COLLECTION = "propertyRequests";
const METADATA_COLLECTION = "_app_status"; // For seeding status
const SEEDING_INFO_DOC = "seedingInfo";

// Helper to convert Firestore doc data (with Timestamps) to PropertyRequest (with Dates)
function docDataToPropertyRequest(docId: string, data: any): PropertyRequest {
  const requestData = { ...data } as PropertyRequest;
  requestData.id = docId;
  if (data.createdAt && data.createdAt instanceof Timestamp) {
    requestData.createdAt = data.createdAt.toDate();
  } else if (typeof data.createdAt === 'string') {
    requestData.createdAt = new Date(data.createdAt);
  }

  if (data.updatedAt && data.updatedAt instanceof Timestamp) {
    requestData.updatedAt = data.updatedAt.toDate();
  } else if (typeof data.updatedAt === 'string') {
    requestData.updatedAt = new Date(data.updatedAt);
  }

  if (data.followUps && Array.isArray(data.followUps)) {
    requestData.followUps = data.followUps.map((fu: any) => {
      const followUpEntry = { ...fu };
      if (fu.timestamp && fu.timestamp instanceof Timestamp) {
        followUpEntry.timestamp = fu.timestamp.toDate();
      } else if (typeof fu.timestamp === 'string') {
        followUpEntry.timestamp = new Date(fu.timestamp);
      }
      return followUpEntry;
    });
  }
  return requestData;
}


export async function addRequest(requestData: Omit<PropertyRequest, "status" | "createdAt" | "updatedAt" | "followUps"> & { id: string }): Promise<PropertyRequest> {
  try {
    const { id: requestId, ...restOfData } = requestData;
    const cleanedRequestData: { [key: string]: any } = {};
    for (const key in restOfData) {
      if ((restOfData as any)[key] !== undefined) {
        cleanedRequestData[key] = (restOfData as any)[key];
      }
    }

    const docRef = doc(db, REQUESTS_COLLECTION, requestId);
    await setDoc(docRef, {
      ...cleanedRequestData,
      status: "جديد" as RequestStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      followUps: [],
    });

    const newDocSnap = await getDoc(docRef);
    if (newDocSnap.exists()) {
      return docDataToPropertyRequest(newDocSnap.id, newDocSnap.data());
    } else {
      throw new Error("Failed to fetch newly created request document.");
    }
  } catch (error) {
    console.error("Error adding request to Firestore: ", error);
    throw error;
  }
}

export async function getRequestById(id: string): Promise<PropertyRequest | undefined> {
  try {
    const docRef = doc(db, REQUESTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docDataToPropertyRequest(docSnap.id, docSnap.data());
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching request by ID from Firestore: ", error);
    throw error;
  }
}

export async function getAllRequests(): Promise<PropertyRequest[]> {
  try {
    const q = query(collection(db, REQUESTS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docDataToPropertyRequest(doc.id, doc.data()));
  } catch (error) {
    console.error("Error fetching all requests from Firestore: ", error);
    throw error;
  }
}


export async function getRequestsByClientPhone(clientPhone: string): Promise<PropertyRequest[]> {
  try {
    const q = query(
      collection(db, REQUESTS_COLLECTION),
      where("clientContact", "==", clientPhone),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docDataToPropertyRequest(doc.id, doc.data()));
  } catch (error) {
    console.error("Error fetching requests by client phone from Firestore: ", error);
    throw error;
  }
}

export async function updateRequestStatus(id: string, status: RequestStatus): Promise<PropertyRequest | undefined> {
  try {
    const docRef = doc(db, REQUESTS_COLLECTION, id);
    await updateDoc(docRef, {
      status: status,
      updatedAt: serverTimestamp(),
    });
    const updatedDocSnap = await getDoc(docRef);
     if (updatedDocSnap.exists()) {
      return docDataToPropertyRequest(updatedDocSnap.id, updatedDocSnap.data());
    }
    return undefined;
  } catch (error) {
    console.error("Error updating request status in Firestore: ", error);
    throw error;
  }
}

export async function addFollowUpToRequest(requestId: string, notes: string, actor?: string): Promise<PropertyRequest | undefined> {
  try {
    const docRef = doc(db, REQUESTS_COLLECTION, requestId);

    const newFollowUpWithId: FollowUpEntry = {
      id: crypto.randomUUID(),
      notes,
      actor: actor || "System",
      timestamp: new Date(),
    };

    await updateDoc(docRef, {
      followUps: arrayUnion(newFollowUpWithId),
      updatedAt: serverTimestamp(),
    });

    const updatedDocSnap = await getDoc(docRef);
     if (updatedDocSnap.exists()) {
      return docDataToPropertyRequest(updatedDocSnap.id, updatedDocSnap.data());
    }
    return undefined;
  } catch (error) {
    console.error("Error adding follow-up to Firestore: ", error);
    throw error;
  }
}

// Function to seed initial property requests if the collection is empty or not yet seeded
export async function seedInitialPropertyRequests(): Promise<void> {
  const seedingStatusRef = doc(db, METADATA_COLLECTION, SEEDING_INFO_DOC);
  try {
    const seedingStatusSnap = await getDoc(seedingStatusRef);

    if (seedingStatusSnap.exists() && seedingStatusSnap.data()?.propertyRequestsSeeded) {
      // console.log("Property requests already seeded. Skipping.");
      return;
    }

    // Optional: Check if collection is empty before seeding (more robust than just flag)
    const requestsCollectionRef = collection(db, REQUESTS_COLLECTION);
    const existingRequestsSnap = await getDocs(query(requestsCollectionRef, orderBy("createdAt"), where("id", "!=", ""))); // Simple query to check count
    
    if (existingRequestsSnap.size > 0 && !(seedingStatusSnap.exists() && seedingStatusSnap.data()?.propertyRequestsSeeded === false) ) {
        // If collection is not empty, and we haven't explicitly tried and failed seeding before,
        // mark as seeded to prevent accidental overwrite of existing data if flag was missing.
        if (!seedingStatusSnap.exists() || !seedingStatusSnap.data()?.propertyRequestsSeeded) {
            await setDoc(seedingStatusRef, { propertyRequestsSeeded: true, lastChecked: serverTimestamp() }, { merge: true });
            console.log("Property requests collection is not empty. Marking as seeded to prevent overwrite.");
        }
        return;
    }


    console.log("Seeding initial property requests from imported-sample-requests.ts...");
    const batch = writeBatch(db);
    let count = 0;

    importedRequests.forEach(request => {
      const docRef = doc(db, REQUESTS_COLLECTION, request.id); // Use the ID from importedRequests
      
      // Prepare data for Firestore, converting Date objects to Timestamps
      const firestoreData: { [key: string]: any } = { ...request };
      delete firestoreData.id; // ID is used for docRef, not in data itself

      if (request.createdAt instanceof Date) {
        firestoreData.createdAt = Timestamp.fromDate(request.createdAt);
      } else {
        firestoreData.createdAt = serverTimestamp(); // Fallback
      }
      if (request.updatedAt instanceof Date) {
        firestoreData.updatedAt = Timestamp.fromDate(request.updatedAt);
      } else {
        firestoreData.updatedAt = serverTimestamp(); // Fallback
      }
      firestoreData.followUps = request.followUps || []; // Ensure it's an array
      
      // Remove undefined fields from the object before sending to Firestore
      Object.keys(firestoreData).forEach(key => {
        if (firestoreData[key] === undefined) {
          delete firestoreData[key];
        }
      });

      batch.set(docRef, firestoreData);
      count++;
    });

    // Set the flag indicating seeding is done
    batch.set(seedingStatusRef, { propertyRequestsSeeded: true, seededCount: count, lastSeeded: serverTimestamp() }, { merge: true });

    await batch.commit();
    console.log(`Successfully seeded ${count} property requests and set seeding flag.`);

  } catch (error) {
    console.error("Error during seeding property requests: ", error);
    // Optionally mark seeding as failed to allow re-try or manual intervention
    try {
        await setDoc(seedingStatusRef, { propertyRequestsSeeded: false, error: String(error), lastAttempt: serverTimestamp() }, { merge: true });
    } catch (metaError) {
        console.error("Error updating seeding status after failure: ", metaError);
    }
  }
}

