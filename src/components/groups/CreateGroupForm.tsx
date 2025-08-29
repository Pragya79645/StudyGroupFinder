'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createGroup } from '@/actions/groups';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
      {pending ? 'Creating Group...' : 'Create Group'}
    </Button>
  );
}

export function CreateGroupForm() {
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useActionState(createGroup, initialState);

    return (
        <form action={dispatch}>
            <Card>
                <CardHeader>
                    <CardTitle>Group Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="groupName">Group Name</Label>
                        <Input id="groupName" name="groupName" placeholder="e.g., Quantum Mechanics Masters" required />
                         {state.errors?.groupName && <p className="text-sm text-destructive">{state.errors.groupName}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subject">Subject / Exam</Label>
                        <Input id="subject" name="subject" placeholder="e.g., PHYS 350" required />
                        {state.errors?.subject && <p className="text-sm text-destructive">{state.errors.subject}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input id="tags" name="tags" placeholder="e.g., Midterm Prep, Homework Help" />
                        <p className="text-sm text-muted-foreground">Separate tags with a comma.</p>
                        {state.errors?.tags && <p className="text-sm text-destructive">{state.errors.tags}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </Card>
        </form>
    );
}
