
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updateUser } from '@/lib/firebase-service';
import type { User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();
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
            setSubjects(user.subjects);
            setSkills(user.skills);
            setAvailability(user.availability);
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
            toast({ title: 'Profile updated successfully!' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to update profile.' });
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

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
                <p className="text-muted-foreground">Manage your profile and account settings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>This information helps us recommend the best study groups for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Your Subjects</Label>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="e.g. Calculus II" 
                                value={currentSubject}
                                onChange={e => setCurrentSubject(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addTag('subjects')}
                             />
                            <Button onClick={() => addTag('subjects')}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
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
                         <div className="flex gap-2">
                            <Input 
                                placeholder="e.g. Python" 
                                value={currentSkill}
                                onChange={e => setCurrentSkill(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addTag('skills')}
                             />
                            <Button onClick={() => addTag('skills')}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
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
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
