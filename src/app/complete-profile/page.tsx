'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { validateProfileCompletion } from '@/actions/auth_google';
import { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Plus, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

// ===== Complete Profile after Google Auth =====

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'English', 'History', 'Geography', 'Economics', 'Accounting',
  'Engineering', 'Medicine', 'Law', 'Business', 'Arts'
];

const SKILLS = [
  'Problem Solving', 'Critical Thinking', 'Research', 'Writing',
  'Programming', 'Data Analysis', 'Public Speaking', 'Team Work',
  'Leadership', 'Time Management', 'Project Management'
];

const AVAILABILITY_OPTIONS = [
  'Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings',
  'Weekend Mornings', 'Weekend Afternoons', 'Weekend Evenings',
  'Late Night Study', 'Flexible Schedule'
];

const EXAM_TAGS = [
  'JEE Main', 'JEE Advanced', 'NEET', 'GATE', 'CAT', 'SAT', 'GRE', 'GMAT',
  'UPSC', 'Bank PO', 'SSC', 'CLAT', 'AIIMS', 'JIPMER', 'BITSAT'
];

export default function CompleteProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState(user?.displayName || '');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedExamTags, setSelectedExamTags] = useState<string[]>([]);
  const [customSkillTags, setCustomSkillTags] = useState<string[]>([]);
  const [newCustomTag, setNewCustomTag] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!user) {
      setError('You must be logged in to complete your profile');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.set('name', name);
    formData.set('subjects', JSON.stringify(selectedSubjects));
    formData.set('skills', JSON.stringify(selectedSkills));
    formData.set('availability', JSON.stringify(selectedAvailability));
    formData.set('examTags', JSON.stringify(selectedExamTags));
    formData.set('skillTags', JSON.stringify(customSkillTags));

    try {
      const result = await validateProfileCompletion({}, formData);
      
      if (result.success && result.data) {
        // Update user profile in Firestore
        const updatedProfile: Partial<UserProfile> = {
          ...result.data,
          updatedAt: new Date(),
        };

        await updateDoc(doc(db, 'users', user.uid), updatedProfile);

        // Trigger AI matching
        await fetch('/api/ai/trigger-matching', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid }),
        });

        router.push('/dashboard');
      } else {
        setError(result.message || 'Please complete all required fields');
      }
    } catch (error: any) {
      setError('Failed to complete profile');
    }

    setIsLoading(false);
  };

  const addCustomTag = () => {
    if (newCustomTag.trim() && !customSkillTags.includes(newCustomTag.trim())) {
      setCustomSkillTags([...customSkillTags, newCustomTag.trim()]);
      setNewCustomTag('');
    }
  };

  const removeCustomTag = (tag: string) => {
    setCustomSkillTags(customSkillTags.filter(t => t !== tag));
  };

  const toggleSelection = (item: string, list: string[], setList: (list: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
        <p className="text-muted-foreground">Help us find the perfect study groups for you</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Subjects */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Academic Subjects *</h3>
          <div className="grid grid-cols-3 gap-2">
            {SUBJECTS.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={subject}
                  checked={selectedSubjects.includes(subject)}
                  onCheckedChange={() => toggleSelection(subject, selectedSubjects, setSelectedSubjects)}
                />
                <Label htmlFor={subject} className="text-sm">{subject}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Skills & Strengths *</h3>
          <div className="grid grid-cols-2 gap-2">
            {SKILLS.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={skill}
                  checked={selectedSkills.includes(skill)}
                  onCheckedChange={() => toggleSelection(skill, selectedSkills, setSelectedSkills)}
                />
                <Label htmlFor={skill} className="text-sm">{skill}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Study Availability *</h3>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABILITY_OPTIONS.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={selectedAvailability.includes(option)}
                  onCheckedChange={() => toggleSelection(option, selectedAvailability, setSelectedAvailability)}
                />
                <Label htmlFor={option} className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Exam Focus (Optional)</h3>
          <div className="grid grid-cols-3 gap-2">
            {EXAM_TAGS.map((exam) => (
              <div key={exam} className="flex items-center space-x-2">
                <Checkbox
                  id={exam}
                  checked={selectedExamTags.includes(exam)}
                  onCheckedChange={() => toggleSelection(exam, selectedExamTags, setSelectedExamTags)}
                />
                <Label htmlFor={exam} className="text-sm">{exam}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Skills */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Skills (Optional)</h3>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Machine Learning, Debate"
              value={newCustomTag}
              onChange={(e) => setNewCustomTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
            />
            <Button type="button" onClick={addCustomTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {customSkillTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customSkillTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeCustomTag(tag)}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Completing Profile...' : 'Complete Profile & Find Groups'}
        </Button>
      </form>
    </div>
  );
}
