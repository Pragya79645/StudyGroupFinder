export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  subjects: string[];
  skills: string[];
  availability: string;
  tags: string[];
  groups: string[];
}

export interface Group {
  id: string;
  groupName: string;
  subject: string;
  members: string[]; // array of user uids
  tags: string[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}
