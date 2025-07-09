
"use server";

import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  // where, // For future filtering
} from "firebase/firestore";
import type { Task, TaskPriority, TaskStatus, TaskType } from "@/types";

const TASKS_COLLECTION = "tasks";

// Helper to convert Firestore doc data to Task (handling Timestamps)
function docDataToTask(docId: string, data: any): Task {
  const taskData = { ...data } as Task;
  taskData.id = docId;

  if (data.createdAt && data.createdAt instanceof Timestamp) {
    taskData.createdAt = data.createdAt.toDate();
  } else if (typeof data.createdAt === 'string') {
    taskData.createdAt = new Date(data.createdAt);
  } else {
    taskData.createdAt = new Date(); // Fallback if undefined
  }


  if (data.updatedAt && data.updatedAt instanceof Timestamp) {
    taskData.updatedAt = data.updatedAt.toDate();
  } else if (typeof data.updatedAt === 'string') {
    taskData.updatedAt = new Date(data.updatedAt);
  } else {
    taskData.updatedAt = new Date(); // Fallback if undefined
  }

  if (data.dueDate && data.dueDate instanceof Timestamp) {
    taskData.dueDate = data.dueDate.toDate();
  } else if (typeof data.dueDate === 'string' && data.dueDate) {
    taskData.dueDate = new Date(data.dueDate);
  } else {
    taskData.dueDate = null; // Ensure it's null if not a valid date or undefined
  }
  
  taskData.attachments = data.attachments || []; // Ensure attachments is an array

  return taskData;
}

export async function createTaskInDb(taskData: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
  try {
    const newDocRef = doc(collection(db, TASKS_COLLECTION)); // Firestore generates ID
    
    const dataToSave: { [key: string]: any } = { ...taskData };
    
    if (taskData.dueDate instanceof Date) {
      dataToSave.dueDate = Timestamp.fromDate(taskData.dueDate);
    } else if (taskData.dueDate === undefined || taskData.dueDate === null) {
      dataToSave.dueDate = null; 
    }
    
    Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] === undefined) {
            delete dataToSave[key];
        }
    });
    
    const newTaskFirestore = {
      ...dataToSave,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(newDocRef, newTaskFirestore);
    const newDocSnap = await getDoc(newDocRef);
    if (newDocSnap.exists()) {
      return docDataToTask(newDocSnap.id, newDocSnap.data());
    } else {
      throw new Error("Failed to fetch newly created task.");
    }
  } catch (error) {
    console.error("Error creating task in Firestore: ", error);
    throw error;
  }
}

export async function getTasksFromDb(/* filters */): Promise<Task[]> {
  try {
    const q = query(collection(db, TASKS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docDataToTask(doc.id, doc.data()));
  } catch (error) {
    console.error("Error fetching tasks from Firestore: ", error);
    throw error;
  }
}

export async function getTaskByIdFromDb(taskId: string): Promise<Task | undefined> {
  try {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docDataToTask(docSnap.id, docSnap.data());
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching task ${taskId} from Firestore: `, error);
    throw error;
  }
}

export async function updateTaskInDb(taskId: string, updates: Partial<Omit<Task, "id" | "createdAt">>): Promise<Task | undefined> {
  try {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    const updateData: { [key: string]: any } = { ...updates, updatedAt: serverTimestamp() };
    
    if (updates.dueDate instanceof Date) {
      updateData.dueDate = Timestamp.fromDate(updates.dueDate);
    } else if (updates.dueDate === null) { // Explicitly passed as null
      updateData.dueDate = null;
    }
    // If updates.dueDate is undefined (not passed in updates object), it will not be included in updateData
    
    // Filter out undefined values from updates to prevent Firestore errors
    Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
            delete updateData[key];
        }
    });

    await updateDoc(docRef, updateData);
    const updatedDocSnap = await getDoc(docRef);
    if (updatedDocSnap.exists()) {
      return docDataToTask(updatedDocSnap.id, updatedDocSnap.data());
    }
    return undefined;
  } catch (error) {
    console.error(`Error updating task ${taskId} in Firestore: `, error);
    throw error;
  }
}

export async function deleteTaskFromDb(taskId: string): Promise<void> {
  try {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting task ${taskId} from Firestore: `, error);
    throw error;
  }
}

