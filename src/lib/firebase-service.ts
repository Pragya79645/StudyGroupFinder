import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from 'firebase/firestore';
import type { Group, User, Message, CalendarEvent } from './types';
import { v4 as uuidv4 } from 'uuid';


// User services
export const createUserProfile = async (uid: string, data: Omit<User, 'id'>) => {
  await addDoc(collection(db, 'users'), { uid, ...data });
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as User;
  }
  return null;
};

export const getUsersByIds = async (ids: string[]): Promise<User[]> => {
    if (ids.length === 0) return [];
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('__name__', 'in', ids));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};

export const updateUser = async (userId: string, data: Partial<User>) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
};


// Group services
export const createGroup = async (groupData: Omit<Group, 'id' | 'events'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'groups'), { ...groupData, events: [] });
  return docRef.id;
};

export const getGroups = async (): Promise<Group[]> => {
  const querySnapshot = await getDocs(collection(db, 'groups'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
};

export const getGroup = async (groupId: string): Promise<Group | null> => {
    const groupDoc = await getDoc(doc(db, 'groups', groupId));
    if (groupDoc.exists()) {
        return { id: groupDoc.id, ...doc.data() } as Group;
    }
    return null;
}

export const getGroupSnapshot = (groupId: string, callback: (group: Group | null) => void) => {
  const groupDocRef = doc(db, 'groups', groupId);
  const unsubscribe = onSnapshot(groupDocRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as Group);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
};

export const joinGroup = async (groupId: string, userId: string) => {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
        memberIds: arrayUnion(userId)
    });
};

export const leaveGroup = async (groupId: string, userId: string) => {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
        memberIds: arrayRemove(userId)
    });
};

// Calendar Event Services
export const createGroupEvent = async (groupId: string, eventData: Omit<CalendarEvent, 'id'>) => {
    const groupRef = doc(db, 'groups', groupId);
    const newEvent = { ...eventData, id: uuidv4() };
    await updateDoc(groupRef, {
        events: arrayUnion(newEvent)
    });
};

export const updateGroupEvent = async (groupId: string, updatedEvent: CalendarEvent) => {
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    if (groupDoc.exists()) {
        const group = groupDoc.data() as Group;
        const events = (group.events || []).map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
        );
        await updateDoc(groupRef, { events });
    }
};

export const deleteGroupEvent = async (groupId: string, eventId: string) => {
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    if (groupDoc.exists()) {
        const group = groupDoc.data() as Group;
        const eventToDelete = (group.events || []).find(e => e.id === eventId);
        if (eventToDelete) {
             await updateDoc(groupRef, {
                events: arrayRemove(eventToDelete)
            });
        }
    }
};


// Message services
export const getGroupMessages = (groupId: string, callback: (messages: Message[]) => void) => {
    const messagesRef = collection(db, 'groups', groupId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as Message));
        callback(messages);
    });

    return unsubscribe;
};

export const sendMessage = async (groupId: string, userId: string, text: string, isAIMessage: boolean = false) => {
    const messagesRef = collection(db, 'groups', groupId, 'messages');
    await addDoc(messagesRef, {
        groupId,
        userId,
        text,
        timestamp: serverTimestamp(),
        isAIMessage,
    });
};
