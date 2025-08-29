'use client';

import { ProfileForm } from "@/components/profile/ProfileForm";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PartyPopper } from "lucide-react";

export default function ProfilePage() {
    const searchParams = useSearchParams();
    const isNewUser = searchParams.get('new') === 'true';

    return (
        <div className="grid gap-6">
            {isNewUser && (
                 <Alert style={{borderColor: 'hsl(var(--accent))'}}>
                    <PartyPopper className="h-4 w-4" style={{color: 'hsl(var(--accent))'}}/>
                    <AlertTitle className="font-headline" style={{color: 'hsl(var(--accent))'}}>Welcome to StudyVerse!</AlertTitle>
                    <AlertDescription>
                        Complete your profile to get the best group suggestions.
                    </AlertDescription>
                </Alert>
            )}
            <div>
                <h1 className="text-3xl font-bold font-headline">Your Profile</h1>
                <p className="text-muted-foreground">Manage your personal information and study preferences.</p>
            </div>
            <ProfileForm />
        </div>
    );
}
