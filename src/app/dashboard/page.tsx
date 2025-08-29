'use client';

import { GroupSuggestions } from "@/components/dashboard/GroupSuggestions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// In a real app, this data would be fetched from Firestore
const userGroups = [
    { id: '1', name: 'Calculus Crew', subject: 'Math 101', memberCount: 5 },
    { id: '2', name: 'Physics Phantoms', subject: 'Physics 202', memberCount: 3 },
];

export default function DashboardPage() {
    const { user } = useAuth();
    
    return (
        <div className="grid gap-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Welcome back, {user?.name}!</h1>
                <p className="text-muted-foreground">Here's what's happening in your StudyVerse.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Groups</CardTitle>
                    <CardDescription>The study groups you are currently a part of.</CardDescription>
                </CardHeader>
                <CardContent>
                    {userGroups.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {userGroups.map((group) => (
                                <Card key={group.id} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{group.name}</CardTitle>
                                        <CardDescription>{group.subject}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>{group.memberCount} members</span>
                                        </div>
                                    </CardContent>
                                    <div className="p-4 pt-0">
                                         <Button variant="outline" asChild className="w-full">
                                            <Link href={`/dashboard/groups/${group.id}`}>
                                                Go to Group <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            <p>You haven't joined any groups yet.</p>
                            <Button asChild className="mt-4" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                                <Link href="/dashboard/groups/create">Create a Group</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <GroupSuggestions />

        </div>
    );
}
