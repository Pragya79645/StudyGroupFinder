// 🔄 Study Group Finder - Type Definitions
// Following the exact workflow: Onboarding → AI Matching → Group Creation/Joining

// ===== Step 1: Student Onboarding =====
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  
  // Core academic info
  subjects: string[];
  skills: string[];
  availability: string[];
  
  // Tags for AI matching
  examTags: string[];      // e.g., ["JEE", "NEET", "SAT"]
  skillTags: string[];     // e.g., ["Mathematics", "Physics", "Programming"]
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
}

// ===== Step 2: AI Smart Matching Results =====
export interface GroupSuggestion {
  // Existing group data (undefined if new group recommendation)
  groupId?: string;
  groupName: string;
  subject: string;
  examFocus: string;
  description: string;
  tags: string[];
  memberCount?: number;
  
  // AI analysis
  matchScore: number;      // 0-100 compatibility score
  reason: string;          // Why this group/creation is suggested
  isNewGroupRecommendation: boolean;
}

// ===== Step 3: Group Creation & Management =====
export interface Group {
  id: string;
  groupName: string;
  subject: string;
  examFocus: string;       // Main exam/skill focus
  description: string;
  tags: string[];
  
  // Member management
  members: string[];       // Array of user IDs
  adminId: string;         // Group creator
  
  // Group features
  calendar: GroupEvent[];
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number;        // in minutes
  type: 'study' | 'exam' | 'discussion' | 'project';
}

// ===== Real-time Chat =====
export interface Message {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

// ===== AI Processing =====
export interface AIMatchingRequest {
  userProfile: UserProfile;
  existingGroups: Group[];
}

export interface AIMatchingResponse {
  suggestions: GroupSuggestion[];
  recommendNewGroup: boolean;
  newGroupSuggestion?: {
    suggestedName: string;
    suggestedSubject: string;
    suggestedTags: string[];
    reason: string;
  };
}
