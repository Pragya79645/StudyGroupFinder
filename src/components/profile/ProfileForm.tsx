'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useAuth } from '@/hooks/use-auth';
import { updateUserProfile } from '@/actions/user';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export function ProfileForm() {
    const { user } = useAuth();
    const initialState = { message: null, errors: {} };
    // The updateUserProfile action needs the user's UID. We can bind it here.
    const updateUserWithId = updateUserProfile.bind(null, user!.uid);
    const [state, dispatch] = useActionState(updateUserWithId, initialState);
    
    if (!user) {
        return <p>Loading profile...</p>;
    }

    return (
        <form action={dispatch}>
            <Card>
                <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>This information will be used to match you with study groups.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" defaultValue={user.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" defaultValue={user.email} disabled />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subjects">Subjects</Label>
                        <Textarea id="subjects" name="subjects" placeholder="e.g., Calculus II, Organic Chemistry, World History" defaultValue={user.subjects.join(', ')} />
                        <p className="text-sm text-muted-foreground">Separate subjects with a comma.</p>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="skills">Skills</Label>
                        <Textarea id="skills" name="skills" placeholder="e.g., Python, Public Speaking, Lab Techniques" defaultValue={user.skills.join(', ')} />
                         <p className="text-sm text-muted-foreground">Separate skills with a comma.</p>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="availability">Availability</Label>
                        <Input id="availability" name="availability" placeholder="e.g., Weekday evenings, Weekend mornings" defaultValue={user.availability} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input id="tags" name="tags" placeholder="e.g., Grad Student, Remote Only, Competitive" defaultValue={user.tags.join(', ')} />
                        <p className="text-sm text-muted-foreground">Separate tags with a comma for better matching.</p>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                   <SubmitButton />
                </CardFooter>
            </Card>
        </form>
    );
}
