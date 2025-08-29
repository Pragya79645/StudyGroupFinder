import { Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  subjects: string[];
  skills: string[];
  availability: 'weekdays' | 'weekends' | 'evenings' | 'any';
};

export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  startTime: Timestamp;
  endTime: Timestamp;
  createdBy: string; // userId
}

export type Group = {
  id: string;
  name:string;
  subject: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  events?: CalendarEvent[];
};

export type Message = {
  id: string;
  groupId: string;
  userId: string;
  text: string;
  timestamp: Timestamp | Date;
  isAIMessage?: boolean;
};
