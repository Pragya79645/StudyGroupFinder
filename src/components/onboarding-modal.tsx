
'use client';

import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { updateUser } from '@/lib/firebase-service';
import { useToast } from '@/hooks/use-toast';

interface OnboardingModalProps {
  user: User;
  isOpen: boolean;
  onSave: () => void;
}

export function OnboardingModal({ user, isOpen, onSave }: OnboardingModalProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState<User['availability']>('any');
  
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setSubjects(user.subjects || []);
      setSkills(user.skills || []);
      setAvailability(user.availability || 'any');
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUser(user.id, {
        name,
        subjects,
        skills,
        availability,
      });
      toast({ title: 'Profile saved successfully!' });
      onSave(); // Close modal and refresh dashboard
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to save profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = (type: 'subjects' | 'skills') => {
    if (type === 'subjects' && currentSubject.trim()) {
      if (!subjects.includes(currentSubject.trim())) {
        setSubjects([...subjects, currentSubject.trim()]);
      }
      setCurrentSubject('');
    } else if (type === 'skills' && currentSkill.trim()) {
      if (!skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
      }
      setCurrentSkill('');
    }
  };
    
  const removeTag = (type: 'subjects' | 'skills', tag: string) => {
    if (type === 'subjects') {
      setSubjects(subjects.filter(s => s !== tag));
    } else if (type === 'skills') {
      setSkills(skills.filter(s => s !== tag));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[480px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to StudyLink!</DialogTitle>
          <DialogDescription>
            Let's set up your profile to find the best study groups for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
                <Label>Your Subjects</Label>
                <p className="text-sm text-muted-foreground">What topics are you studying? (e.g., Calculus II, Art History)</p>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Add a subject..." 
                        value={currentSubject}
                        onChange={e => setCurrentSubject(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTag('subjects')}
                        />
                    <Button variant="outline" onClick={() => addTag('subjects')}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 min-h-[24px]">
                    {subjects.map(subject => (
                        <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                            {subject}
                            <button onClick={() => removeTag('subjects', subject)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            </div>
            
            <div className="space-y-2">
                <Label>Your Skills</Label>
                 <p className="text-sm text-muted-foreground">What are you good at? (e.g., Python, Public Speaking)</p>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Add a skill..." 
                        value={currentSkill}
                        onChange={e => setCurrentSkill(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTag('skills')}
                        />
                    <Button variant="outline" onClick={() => addTag('skills')}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 min-h-[24px]">
                    {skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                            {skill}
                                <button onClick={() => removeTag('skills', skill)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <Label>Availability</Label>
                <RadioGroup value={availability} onValueChange={(value: User['availability']) => setAvailability(value)} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="weekdays" id="weekdays" />
                        <Label htmlFor="weekdays" className="font-normal">Weekdays</Label>
                    </div>
                        <div className="flex items-center space-x-3">
                        <RadioGroupItem value="weekends" id="weekends" />
                        <Label htmlFor="weekends" className="font-normal">Weekends</Label>
                    </div>
                        <div className="flex items-center space-x-3">
                        <RadioGroupItem value="evenings" id="evenings" />
                        <Label htmlFor="evenings" className="font-normal">Evenings</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="any" id="any" />
                        <Label htmlFor="any" className="font-normal">Any Time</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Profile & Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
